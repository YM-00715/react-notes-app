import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // 🔹 Word-based preview (≈10 words)
  const getPreview = (text, wordLimit = 10) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const saveNote = () => {
    if (!title.trim() || !content.trim()) return;

    if (selectedNote) {
      setNotes(
        notes.map(note =>
          note.id === selectedNote.id
            ? { ...note, title, content }
            : note
        )
      );
    } else {
      setNotes([...notes, { id: Date.now(), title, content }]);
    }

    closeEditor();
  };

  const deleteNote = () => {
    setNotes(notes.filter(note => note.id !== selectedNote.id));
    closeEditor();
  };

  const openEditor = (note = null) => {
    if (note) {
      setSelectedNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setIsCreating(true);
      setTitle("");
      setContent("");
    }
  };

  const closeEditor = () => {
    setSelectedNote(null);
    setIsCreating(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white p-6">

        {/* Header */}
        <div className="relative mb-6">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            Notes
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-0 right-0 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
      </div>


        {/* Notes Preview Grid */}
        {!selectedNote && !isCreating && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <div
                key={note.id}
                onClick={() => openEditor(note)}
                className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 hover:shadow-xl transition"
              >
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getPreview(note.content, 10)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Note Editor */}
        {(selectedNote || isCreating) && (
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <input
              className="w-full mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              className="w-full mb-4 p-2 rounded bg-gray-100 dark:bg-gray-700"
              rows="6"
              placeholder="Write your note..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={saveNote}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              {selectedNote && (
                <button
                  onClick={deleteNote}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )}

              <button onClick={closeEditor} className="px-4 py-2">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Floating Add Button */}
        {!selectedNote && !isCreating && (
          <button
            onClick={() => openEditor()}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white text-3xl shadow-lg"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
