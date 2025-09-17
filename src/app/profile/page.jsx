"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ email: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const data = await getProfile();
      setProfile({ email: data.email }); // only email editable
    } catch (err) {
      toast.error(err.message || "Failed to load profile");
    }
  }

  async function handleUpdate() {
    setLoading(true);
    try {
      const payload = { email: profile.email };
      if (password) payload.password = password; // only send if changed

      await updateProfile(payload);

      toast.success("✅ Profile updated successfully");
      setPassword(""); // clear password field
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-green-800 via-purple-900 to-blue-900 p-6">
      <Toaster position="top-center" />

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white p-6">
        <CardHeader className="border-b border-white/20 pb-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </CardHeader>

        <CardContent className="mt-6 space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="bg-white/25 text-white placeholder-white/80 px-3 py-2 rounded-lg"
          />

          <Input
            type="password"
            placeholder="New Password (leave blank to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/25 text-white placeholder-white/80 px-3 py-2 rounded-lg"
          />

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-500/80 hover:bg-green-500 text-white w-full"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
