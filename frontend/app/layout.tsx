import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Chatbot } from "./_components/chatbot/chatbot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fit.AI",
  description: "Fit.AI",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${interTight.variable} ${anton.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <Suspense>
            <Chatbot />
          </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
