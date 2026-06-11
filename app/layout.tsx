import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// SF Pro Rounded is Apple-only; Nunito is the canonical open-source stand-in for
// the rounded geometric display face. Body + code fall back to the OS stack so
// the page reads "native", per the design system.
const display = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

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
    <html lang="de" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
