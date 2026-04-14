const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = "secret123";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = require('./db');



app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)")
      .run(email, hash);

    res.json({ msg: "Registered successfully" });

  } catch (err) {
    return res.status(400).json({ msg: "User already exists" });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email=?")
                 .get(email);

  if (!user) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user.id }, SECRET);

  res.json({ token });
});


function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
}




app.get('/notes', auth, (req, res) => {
  const notes = db.prepare("SELECT * FROM notes WHERE user_id=?")
                  .all(req.user.id);

  res.json(notes);
});

app.post('/notes', auth, (req, res) => {
  const { title, content } = req.body;

  const result = db.prepare(
    "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)"
  ).run(req.user.id, title, content);

  res.json({ id: result.lastInsertRowid });
});

app.put('/notes/:id', auth, (req, res) => {
  const { title, content } = req.body;

  const result = db.prepare(
    "UPDATE notes SET title=?, content=? WHERE id=? AND user_id=?"
  ).run(title, content, req.params.id, req.user.id);

  res.json({ updated: result.changes });
});

app.delete('/notes/:id', auth, (req, res) => {
  const result = db.prepare(
    "DELETE FROM notes WHERE id=? AND user_id=?"
  ).run(req.params.id, req.user.id);

  res.json({ deleted: result.changes });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});