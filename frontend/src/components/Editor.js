import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function Editor({ note, refresh, api }) {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const saveNote = async () => {
    if (!title && !content) return;

    if (note?.id) {
      await api.put(`/notes/${note.id}`, { title, content });
    } else {
      await api.post('/notes', { title, content });
    }

    refresh();
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <h3>Select or create a note</h3>
      </div>
    );
  }

  return (
    <div className="editor">

      <div className="editor-header">
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
        />

        <button className="btn save-btn" onClick={saveNote}>
          Save
        </button>
      </div>

      <div className="editor-container">

        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write markdown..."
        />

        <div className="preview">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

      </div>
    </div>
  );
}

export default Editor;