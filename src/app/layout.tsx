import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { bg } from "./lib/colors";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contact Manager",
  description: "Web UI to interact with an API that manages contacts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={bg("surface-container-low")}>
        {children}
      </body>
    </html>
  );
}