import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Avatar, Box, Button } from "@mui/material";
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
    <header className="bg-white w-full text-right p-3 flex justify-between border-b-2">
      <Box className="ml-5 border p-2 rounded-lg">
        <ContactPhoneIcon className="text-4xl"/>
        <span className="ml-2 align-middle text-lg">Contact Manager</span>
      </Box>
      <Box className="flex items-center mr-8 gap-x-6">
        <Box className="align-center flex items-center gap-x-2">
          <Avatar className="">R</Avatar>
          <span className='align-middle'>Ronald</span>
        </Box>
        <Button
          variant="outlined" size="small" color="secondary"
          endIcon={<LogoutIcon/>}
        >Log out</Button>
      </Box>
    </header>
  )
}