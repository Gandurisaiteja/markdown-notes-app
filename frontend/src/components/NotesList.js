import React from 'react';

function NotesList({ notes, select, refresh, api, selected }) {

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    await api.delete(`/notes/${id}`);
    refresh();
  };

  return (
    <div className="notes-list">

      <button
        className="btn new-btn"
        onClick={() => select({ title: '', content: '' })}
      >
        + New Note
      </button>

      {notes.map(n => (
        <div
          className={`note-item ${selected?.id === n.id ? 'active' : ''}`}
          key={n.id}
          onClick={() => select(n)}
        >
          <div className="note-content">
            <h4>{n.title || "Untitled"}</h4>
            <p>{n.content?.slice(0, 60)}</p>
          </div>

          <button
            className="delete-btn"
            onClick={(e) => deleteNote(n.id, e)}
          >
            ×
          </button>
        </div>
      ))}

    </div>
  );
}

export default NotesList;