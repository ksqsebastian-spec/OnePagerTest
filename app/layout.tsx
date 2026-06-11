import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seehafer",
  description: "Moin. Wie kann ich dir helfen?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
