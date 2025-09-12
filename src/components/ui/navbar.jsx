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
    console.log("User role from localStorage:", storedRole);
    setRole(storedRole);
  }, []);
  const pathName = usePathname();
  const handleNavigation = (path) => router.push(path);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("role"); // remove role on logout
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

        {role === "admin" && (
          <MenubarMenu>
            <MenubarTrigger>Users</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => handleNavigation("/users/create")}>
                Create User
              </MenubarItem>
              <MenubarItem onClick={() => handleNavigation("/users")}>
                All Users
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        )}

        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarItem data-variant="destructive" onClick={handleLogout}>
              Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
