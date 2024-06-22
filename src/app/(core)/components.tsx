"use client"
import { Box } from "@mui/material";
import { text } from "../lib/colors";
import { useUser } from "@auth0/nextjs-auth0/client";
import { CircularProgress } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

export function Loading() {
  return <CircularProgress className="absolute inset-1/2" sx={{ marginLeft: "-70px", marginTop: "-70px" }} size="7rem"/>
}

function ErrorScreen({ label }: { label: string}) {
  return (
    <Box className="w-screen h-screen flex justify-center items-center">
      <Box className="text-center w-fit h-fit -mt-48">
        <ErrorIcon className="w-20 h-20" fontSize="large" sx={text("error")}/>
        <span className="w-full block" style={text("on-surface")}>{label}</span>
      </Box>
    </Box>
  )
}

export function ScreenLoading({ children }: { children: React.ReactNode }) {
  const { user, error, isLoading } = useUser();

  if ((!user && !isLoading)) window.location.assign("/api/auth/login");

  return (
    <>
      {
        error ? <ErrorScreen label={error.message}/> :
        !user || isLoading ? <Loading/> :
        <>
          <Header name={user.name as string} picture={user.picture as string}/>
          {children}
        </>
      }
    </>
  )
}