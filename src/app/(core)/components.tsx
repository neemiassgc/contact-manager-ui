"use client"
import { Avatar, Box, Button, Skeleton, Typography } from "@mui/material";
import { bg, border, paint, text } from "../lib/colors";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useUser } from "@auth0/nextjs-auth0/client";
import { CircularProgress } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import { iterator } from "../lib/misc";
import { clearLocalContacts, removeAllUnseenContactNames } from "../lib/storage";

export function Loading({ color = "primary" }: { color?: "warning" | "primary" }) {
  return <CircularProgress color={color} className="absolute inset-1/2" sx={{ marginLeft: "-70px", marginTop: "-70px" }} size="7rem"/>
}

export function ContactBoardLoading() {
  return (
    <Box className="p-5 w-full sm:p-0 sm:w-8/12 md:w-7/12 lg:w-5/12 mx-auto">
      <Box className="w-full flex mb-5 justify-center flex-wrap-reverse gap-3 sm:gap-0 sm:justify-between">
        <Skeleton variant="rounded" animation="wave" width={255} height={40}/>
        <Box className="relative">
          <Button
            variant="contained"
            disabled
            startIcon={<PersonAddIcon/>}
          >
            Add Contact
          </Button>
          <CircularProgress
            size={28}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-14px',
              marginLeft: '-14px',
            }}
            variant="indeterminate"/>
        </Box>
      </Box>
      <Box className="w-full flex flex-col gap-3">
        {
          iterator(6).map((_, i)=> {
            return <Skeleton className="" key={i} variant="rounded" animation="wave" height={53}/>
          })
        }
      </Box>
    </Box>
  )
}

export function ErrorScreen({ label }: { label: string }) {
  return (
    <Box className="w-screen h-screen flex justify-center items-center">
      <Box className="text-center w-fit h-fit -mt-48">
        <ErrorIcon className="w-20 h-20" fontSize="large" sx={text("error")}/>
        <span className="w-full block" style={text("on-surface")}>
          {
            label === "fetch failed"
            ? "It wasn't possible to connect to the server!" : label
          }
        </span>
      </Box>
    </Box>
  )
}

export function Header({ name, picture }: { name: string, picture: string}) {
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
          <Avatar sx={paint(bg("primary"), text("on-primary"))} src={picture}/>
          <Typography>{name}</Typography>
        </Box>
      </Box>
    </header>
  )
}

export function ScreenLoading({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useUser();

  if ((!user && !isLoading)) {
    window.location.assign("/api/auth/login");
    removeAllUnseenContactNames();
    clearLocalContacts();
    return <Loading color="warning"/>
  }

  return (
    <>
      {
        error ? <ErrorScreen label={error.name}/> :
        !user || isLoading ? <Loading/> :
        <>
          <Header name={user.name as string} picture={user.picture as string}/>
          {children}
        </>
      }
    </>
  )
}