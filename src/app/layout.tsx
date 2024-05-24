import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Avatar, Box, Typography } from "@mui/material";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { paint, bg, border, text } from "./colors";

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
        <Header/>
        {children}
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="w-full text-right p-3 flex justify-between items-center border-b"
      style={paint(bg("surface-container"), text("on-surface"), border("outline-variant"))}
    >
      <Box className="ml-5">
        <ContactPhoneIcon fontSize="large"/>
        <span className="ml-2 align-middle text-md">Contact Manager</span>
      </Box>
      <Box className="flex items-center mr-10">
        <Box className="flex items-center gap-2">
          <Avatar sx={paint(bg("primary"), text("on-primary"))}>R</Avatar>
          <Typography>Ronald</Typography>
        </Box>
      </Box>
    </header>
  )
}