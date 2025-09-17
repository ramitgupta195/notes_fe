"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { logout } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const pathName = usePathname();
  const handleNavigation = (path) => router.push(path);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("role");
      router.push("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  if (pathName === "/") return null; // Hide Navbar on login page

  return (
    <div className="flex items-center justify-between bg-background px-4 py-2 shadow-sm border-b">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        MyApp
      </div>

      <Menubar>
        {/* Notes */}
        <MenubarMenu>
          <MenubarTrigger>Notes</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleNavigation("/notes/create")}>
              Create Note
            </MenubarItem>
            <MenubarItem onClick={() => handleNavigation("/notes")}>
              All Notes
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        {/* Users (Admin only) */}
        {role === "admin" && (
          <MenubarMenu>
            <MenubarTrigger>Users</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => handleNavigation("/users")}>
                All Users
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        )}

        {/* Account */}
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => handleNavigation("/profile")}>
              Profile
            </MenubarItem>
            <MenubarItem
              data-variant="destructive"
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
