// app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/ui/navbar"; // adjust path

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MyApp",
  description: "MyApp Description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar will appear on every page */}
        <Navbar />

        {/* Page content */}
        <main className="">{children}</main>
      </body>
    </html>
  );
}
