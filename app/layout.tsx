import type { Metadata } from "next";
import "./globals.css"; // Your Tailwind styles

export const metadata: Metadata = {
  title: "FeastFlow",
  description: "Delicious, healthy, and convenient school lunches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}