import type { Metadata } from "next";
import {Open_Sans } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "@/context/AuthContext";

const openSans= Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable}  bg-blue-50 text-slate-950 antialiased`}
      >
        <AuthContextProvider>

        {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
