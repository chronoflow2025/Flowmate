import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowMate - AI-Powered Productivity Assistant",
  description: "Optimize your day with AI-generated schedules based on focus patterns and habits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
