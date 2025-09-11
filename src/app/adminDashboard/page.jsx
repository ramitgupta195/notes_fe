"use client";

import { useEffect, useState } from "react";
import { getNotes, deleteNote, logout } from "@/lib/api";
import { useRouter } from "next/navigation";
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
import { Toaster } from "@/components/ui/sonner"; // your Sonner Toaster
import { toast } from "sonner";

export default function AdminDashboard() {
  const [notes, setNotes] = useState([]);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

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

  function confirmDelete(id) {
    setDeleteNoteId(id);
    setIsDialogOpen(true);
  }

  async function handleDelete() {
    if (!deleteNoteId) return;
    try {
      await deleteNote(deleteNoteId);
      toast.success("Note deleted successfully.");
      setIsDialogOpen(false);
      setDeleteNoteId(null);
      fetchNotes();
    } catch (err) {
      toast.error(err?.message || "Failed to delete note.");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      toast.error(err?.message || "Failed to logout.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-4">
      <Toaster position="top-center" /> {/* Sonner Toaster */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </CardHeader>
        <CardContent>
          <Table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>{note.title || "No Title"}</TableCell>
                    <TableCell>{note.content || "No Content"}</TableCell>
                    <TableCell>{note.user?.email || "Unknown User"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(note.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No notes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
