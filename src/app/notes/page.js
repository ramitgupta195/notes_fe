"use client";
import { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  logout,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const data = await getNotes();
      setNotes(data || []);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCreateOrUpdate(e) {
    e.preventDefault();
    try {
      if (editingNoteId) {
        await updateNote(editingNoteId, { title, content });
      } else {
        await createNote({ title, content });
      }
      setTitle("");
      setContent("");
      setEditingNoteId(null);
      fetchNotes();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEdit(note) {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setEditingNoteId(note?.id || null);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleCreateOrUpdate}
        className="mb-4 flex flex-col gap-2 bg-gray-800 p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-700 p-2 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-700 p-2 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded font-semibold transition"
        >
          {editingNoteId ? "Update Note" : "Create Note"}
        </button>
      </form>

      <ul>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <li
              key={note?.id || Math.random()}
              className="border border-gray-700 p-2 mb-2 rounded flex justify-between items-start bg-gray-800"
            >
              <div>
                <strong className="text-indigo-300">
                  {note?.title || "No Title"}
                </strong>
                <p className="text-gray-200">{note?.content || "No Content"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white p-1 rounded"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded"
                  onClick={() => note?.id && handleDelete(note.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center p-4">No notes available.</li>
        )}
      </ul>
    </div>
  );
}
