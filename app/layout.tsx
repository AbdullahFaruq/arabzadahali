import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arabzada — Fine Handmade Carpets",
  description: "Discover the world's finest handmade Persian, Moroccan, Turkish and modern rugs. Authenticity guaranteed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} h-full`}>
        <body className="min-h-full bg-stone-950 antialiased">
          <StoreProvider>
            <Navbar />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
