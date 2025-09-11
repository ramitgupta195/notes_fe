"use client";
import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await login(email, password);
      console.log(response);
      const role = response.user.role;
      if (role === "admin") {
        router.push("/adminDashboard");
      } else {
        router.push("/notes");
      }
      // alert("Login successful!");
      // router.push("/notes"); // redirect to notes page
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-gray-100 p-8 rounded-md shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-700 p-3 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-700 p-3 rounded bg-gray-700 text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded font-semibold transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
