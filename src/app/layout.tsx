import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Avatar, Box, Button, Chip, IconButton, Typography } from "@mui/material";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LogoutIcon from '@mui/icons-material/Logout';

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
      <body className={inter.className}>
        <Header/>
        {children}
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-white w-full text-right p-3 flex justify-between items-center border-b-2">
      <Box className="ml-5">
        <ContactPhoneIcon fontSize="large"/>
        <span className="ml-2 align-middle text-md">Contact Manager</span>
      </Box>
      <Box className="flex items-center mr-10">
        <Box className="flex items-center gap-2">
          <Avatar>R</Avatar>
          <Typography>Ronald</Typography>
        </Box>
      </Box>
    </header>
  )
}