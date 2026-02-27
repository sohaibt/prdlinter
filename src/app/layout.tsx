import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRD Linter — AI-Powered PRD Analysis",
  description:
    "Analyze your Product Requirement Documents for common PM anti-patterns using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
