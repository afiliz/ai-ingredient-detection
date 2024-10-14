import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Ingredient Analyzer",
  description: "Analyzes ingredients in an uploaded image",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
