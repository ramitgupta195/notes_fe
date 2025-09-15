"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "@/lib/api";
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
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editUser, setEditUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error(err?.message || "Failed to fetch users.");
    }
  }

  function confirmDelete(id) {
    setDeleteUserId(id);
    setIsDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId);
      toast.success("User deleted successfully.");
      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || "Failed to delete user.");
    }
  }

  function openEdit(user) {
    setEditUser({ ...user }); // clone so we can edit
    setIsEditDialogOpen(true);
  }

  async function handleUpdate() {
    try {
      await updateUser(editUser.id, {
        email: editUser.email,
        role: editUser.role,
      });
      toast.success("User updated successfully.");
      setIsEditDialogOpen(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err?.message || "Failed to update user.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-800 via-purple-900 to-blue-900 p-6">
      <Toaster position="top-center" />

      <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white p-6">
        <CardHeader className="flex justify-between items-center border-b border-white/20 pb-4">
          <h1 className="text-3xl font-bold">All Users</h1>
        </CardHeader>

        <CardContent className="mt-6">
          <div className="overflow-hidden rounded-xl border border-white/20">
            <Table className="w-full text-white">
              <TableHeader className="bg-white/10 backdrop-blur-md">
                <TableRow>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-white/10 transition"
                    >
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500/80 hover:bg-blue-500"
                          onClick={() => openEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500/80 hover:bg-red-500"
                          onClick={() => confirmDelete(user.id)}
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
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="text-white/80">
              Are you sure you want to delete this user? This action cannot be
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-white/80">
              Update user details below.
            </DialogDescription>
          </DialogHeader>

          {editUser && (
            <div className="space-y-4">
              <Input
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="bg-white/25 text-white placeholder-white/80 px-3 py-2 rounded-lg"
              />
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="w-full bg-white/25 text-white px-3 py-2 rounded-lg appearance-none"
              >
                <option className="bg-gray-800 text-white" value="user">
                  User
                </option>
                <option className="bg-gray-800 text-white" value="admin">
                  Admin
                </option>
              </select>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-green-500/80 hover:bg-green-500 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
