"use client";

import { useEffect, useState } from "react";
import { getNotes, deleteNote, createNote, updateNote } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null); // null = create
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const data = await getNotes();
      setNotes(data || []);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch notes.");
    }
  }

  // Delete
  function confirmDelete(id) {
    setDeleteNoteId(id);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!deleteNoteId) return;
    try {
      await deleteNote(deleteNoteId);
      toast.success("Note deleted successfully.");
      setIsDeleteDialogOpen(false);
      setDeleteNoteId(null);
      fetchNotes();
    } catch (err) {
      toast.error(err?.message || "Failed to delete note.");
    }
  }

  // Open dialog for create or edit
  function openNoteDialog(note = null) {
    setCurrentNote(note ? { ...note } : { title: "", content: "" });
    setNoteDialogOpen(true);
  }

  // Save note (create or update)
  async function handleNoteSave() {
    try {
      if (currentNote.id) {
        await updateNote(currentNote.id, currentNote);
        toast.success(`Note "${currentNote.title}" updated successfully.`);
      } else {
        await createNote(currentNote);
        toast.success(`Note "${currentNote.title}" created successfully.`);
      }
      setNoteDialogOpen(false);
      setCurrentNote(null);
      fetchNotes();
    } catch (err) {
      toast.error(err?.message || "Failed to save note.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-800 via-purple-900 to-blue-900 p-6">
      <Toaster position="top-center" />

      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white p-6">
        <CardHeader className="flex justify-between items-center border-b border-white/20 pb-4">
          <h1 className="text-3xl font-bold">My Notes</h1>
          <Button
            onClick={() => openNoteDialog()}
            className="bg-green-500/80 hover:bg-green-500"
          >
            + Add Note
          </Button>
        </CardHeader>

        <CardContent className="mt-6">
          <div className="overflow-hidden rounded-xl border border-white/20">
            <Table className="w-full text-white">
              <TableHeader className="bg-white/10 backdrop-blur-md">
                <TableRow>
                  <TableHead className="text-white">Title</TableHead>
                  <TableHead className="text-white">Content</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <TableRow
                      key={note.id}
                      className="hover:bg-white/10 transition"
                    >
                      <TableCell>{note.title || "No Title"}</TableCell>
                      <TableCell>{note.content || "No Content"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500/80 hover:bg-blue-500 text-white"
                          onClick={() => openNoteDialog(note)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/80 hover:bg-red-500"
                          onClick={() => confirmDelete(note.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-6 text-white/70"
                    >
                      No notes yet. Start by adding one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {currentNote?.id ? "Edit Note" : "New Note"}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {currentNote?.id
                ? "Update the note details below."
                : "Enter the details for the new note."}
            </DialogDescription>
          </DialogHeader>
          {currentNote && (
            <div className="space-y-4 py-4">
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, title: e.target.value })
                }
                placeholder={currentNote?.id ? "" : "Enter note title"}
                className="w-full bg-white/25 text-white placeholder-white/80 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                value={currentNote.content}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, content: e.target.value })
                }
                placeholder={currentNote?.id ? "" : "Enter note content"}
                className="w-full bg-white/25 text-white placeholder-white/80 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-24"
              />
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setNoteDialogOpen(false)}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNoteSave}
              className="bg-blue-500/80 hover:bg-blue-500 text-white"
            >
              {currentNote?.id ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500/80 hover:bg-red-500"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
