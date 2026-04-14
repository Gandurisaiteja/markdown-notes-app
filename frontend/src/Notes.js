import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notes.css';

import NotesList from './components/NotesList';
import Editor from './components/Editor';

function Notes({ token }) {

  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      Authorization: token
    }
  });

  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchNotes = async () => {
    const res = await api.get('/notes');
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="layout">

      <div className="sidebar">
        <NotesList
          notes={[...notes].reverse()}
          select={setSelected}
          refresh={fetchNotes}
          api={api}
          selected={selected}
        />
      </div>

      <div className="main">
        <Editor
          note={selected}
          refresh={fetchNotes}
          api={api}
        />
      </div>

    </div>
  );
}

export default Notes;