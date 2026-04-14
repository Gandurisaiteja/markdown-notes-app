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

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    function (err) {
      if (err) {
        console.log(err);
        return res.status(400).json({ msg: "User already exists" });
      }
      res.json({ msg: "Registered successfully" });
    }
  );
});



app.post('/login', (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {

    if (!user) return res.status(400).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user.id }, SECRET);

    res.json({ token });
  });
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
  db.all(
    "SELECT * FROM notes WHERE user_id=?",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});


app.post('/notes', auth, (req, res) => {
  const { title, content } = req.body;

  db.run(
    "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
    [req.user.id, title, content],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});


app.put('/notes/:id', auth, (req, res) => {
  const { title, content } = req.body;

  db.run(
    "UPDATE notes SET title=?, content=? WHERE id=? AND user_id=?",
    [title, content, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});


app.delete('/notes/:id', auth, (req, res) => {
  db.run(
    "DELETE FROM notes WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    }
  );
});


app.listen(5000, () => console.log("Server running on port 5000"));