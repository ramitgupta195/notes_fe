"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login(email, password);
        const role = response.user.role;
        router.push(role === "admin" ? "/adminDashboard" : "/notes");
      } else {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        const response = await signup(email, password, confirmPassword);
        alert("Signup successful! Redirecting to your dashboard...");
        const role = response.user.role;
        router.push(role === "admin" ? "/adminDashboard" : "/notes");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-purple-900 to-blue-900 px-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white p-6 transform transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <p className="text-center text-sm text-white/80">
            {isLogin ? "Login to your account" : "Sign up to get started"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/20 placeholder-white text-white backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/40 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/20 placeholder-white text-white backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/40 outline-none"
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/20 placeholder-white text-white backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/40 outline-none"
              />
            )}
            <button
              type="submit"
              className="w-full bg-white font-semibold rounded-lg py-2 hover:opacity-90 transition"
              style={{
                
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-white/80 mt-4 text-sm">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              className="underline hover:opacity-80 "
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
