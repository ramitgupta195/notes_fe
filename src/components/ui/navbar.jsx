"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { logout } from "@/lib/api";

export default function GlassNavbar() {
  const router = useRouter();
  const pathName = usePathname();

  const [active, setActive] = useState("notes");
  const [accountOpen, setAccountOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [ready, setReady] = useState(false); // new: wait until role is loaded

  // Always call hooks first
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    setReady(true); // signal that we can safely render
  }, []);

  const handleClick = async (tab) => {
    if (tab.id === "account") {
      setAccountOpen((prev) => !prev);
      setActive(tab.id);
    } else {
      setActive(tab.id);
      router.push(tab.path);
      setAccountOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // Hide navbar on login page or if role isn't loaded yet
  if (pathName === "/" || !ready) return null;

  // Tabs setup after role is known
  const tabs = [
    { id: "notes", label: "Notes", path: "/notes" },
    role === "admin" && { id: "users", label: "Users", path: "/users" },
    { id: "account", label: "Account", path: "/profile" },
  ].filter(Boolean);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex gap-6 bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20 shadow-2xl relative">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative">
            <button
              onClick={() => handleClick(tab)}
              onMouseEnter={() => setActive(tab.id)}
              className="relative px-4 py-2 font-medium text-white"
            >
              {active === tab.id && (
                <>
                  <motion.div
                    layoutId="droplet"
                    className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg pointer-events-none"
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 20,
                    }}
                  />
                  <motion.div
                    key={tab.id + "-glow"}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    initial={{ scale: 0.9, opacity: 0.4 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 2,
                      ease: "easeOut",
                    }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
                    }}
                  />
                </>
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>

            {tab.id === "account" && accountOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg flex flex-col min-w-[160px] z-20"
              >
                <button
                  onClick={() => {
                    router.push("/profile");
                    setAccountOpen(false);
                  }}
                  className="px-4 py-2 text-white hover:bg-white/20 rounded-t-xl text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-400 hover:bg-red-500/30 rounded-b-xl text-left"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
