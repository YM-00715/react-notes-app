import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (title.trim() === "" || content.trim() === "") return;

    setNotes([
      ...notes,
      { id: Date.now(), title: title, content: content }
    ]);

    setTitle("");
    setContent("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditing = (note) => {
  setEditingId(note.id);
  setEditTitle(note.title);
  setEditContent(note.content);
};

const saveEdit = (id) => {
  setNotes(
    notes.map(note =>
      note.id === id
        ? { ...note, title: editTitle, content: editContent }
        : note
    )
  );
  setEditingId(null);
};

const cancelEdit = () => {
  setEditingId(null);
};

  return (
    <div className="app-container">
      <h1>Notes App</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={addNote}>Add Note</button>
      </div>

      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note">
  {editingId === note.id ? (
    <>
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
      />

      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
      />

      <button onClick={() => saveEdit(note.id)}>Save</button>
      <button onClick={cancelEdit}>Cancel</button>
    </>
  ) : (
    <>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => startEditing(note)}>Edit</button>
      <button onClick={() => deleteNote(note.id)}>Delete</button>
    </>
  )}
</div>

        ))}
      </div>
    </div>
  );
}

export default App;
