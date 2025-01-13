"use client"
// app/layout.tsx
import {metadata} from './metadata'; // Import from metadata.ts
import localFont from "next/font/local";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "../components/ui/toaster";
import AuthProvider from "../context/AuthProvider";
import SignOutButton from "../components/signOutButton";
import FloatingChatbot from "../components/chatBot/chatBot";
import Navbar from "@/components/navbar/Navbar";
import ClientOnly from "@/components/ClientOnly";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current pathname

  // Conditionally render Navbar based on the current path
  
  const shouldRenderNavbar = !(pathname === "/dashboard/teacher" || pathname.startsWith("/teacher"));

  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ClientOnly>
            {shouldRenderNavbar && <Navbar />}
          </ClientOnly>

          {children}
          <FloatingChatbot />
          <SignOutButton />
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
