import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { auth } from "@/auth";
import SessionProviderWrapper from "@/wrapper/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home | CineTickets - Your Gateway to the Big Screen",
  description:
    "Book movie tickets instantly and enjoy the best cinema experience!",
    icons: {
      icon: "/cineticket.svg"
    }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <SessionProviderWrapper session={session}>
          <AppProvider>
            <Navbar />
            {children}
            <Footer />
          </AppProvider>
        </SessionProviderWrapper>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
