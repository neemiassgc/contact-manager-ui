import { Avatar, Box, Typography } from "@mui/material";
import { bg, border, paint, text } from "../lib/colors";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header/>
      {children}
    </>
  );
}

function Header() {
  return (
    <header className="w-full text-right p-3 flex justify-between items-center border-b"
      style={paint(bg("surface-container"), text("on-surface"), border("outline-variant"))}
    >
      <Box className="ml-1 sm:ml-5">
        <ContactPhoneIcon fontSize="large"/>
        <span className="ml-2 align-middle text-md">Contact Manager</span>
      </Box>
      <Box className="flex items-center mr-1 sm:mr-10">
        <Box className="flex items-center gap-2">
          <Avatar sx={paint(bg("primary"), text("on-primary"))}>R</Avatar>
          <Typography>Ronald</Typography>
        </Box>
      </Box>
    </header>
  )
}