import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AI Movie Insight",
  description: "Get detailed insights about your favorite movies using AI. Powered by the OMDb API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Particle background sits behind everything */}
        <div style={{position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none'}}>
          {/* dynamically imported client component */}
          {/* Importing with next/dynamic could be used, but a direct client component import works too */}
          {/* Use a relative import to the component we added */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
        </div>
        <div style={{position: 'relative', zIndex: 10}}>
          {children}
        </div>
      </body>
    </html>
  );
}
