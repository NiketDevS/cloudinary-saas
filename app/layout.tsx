import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import {
  ClerkProvider
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudMedia SaaS - Intelligent Image & Video Processing",
  description: "Compress, optimize, and crop media files seamlessly using Clerk, Prisma, and Cloudinary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
      >
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
