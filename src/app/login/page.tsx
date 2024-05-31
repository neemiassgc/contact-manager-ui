"use client"

import { Box, Typography } from "@mui/material";
import { border, text } from "../lib/colors";
import Image from "next/image";
import GoogleLogo from "./google.svg";
import KeycloakLogo from "./keycloak.svg"
import { redirect } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  if (localStorage.getItem("flag")) router.push("/")

  return (
    <Box className="w-9/12 sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 mx-auto my-auto mt-48 flex flex-col gap-2" sx={text("on-surface")}>
      <Typography className="mb-3" align="center" variant="h5">Login</Typography>
      <OptionBlock alt="Google logo" logoSrc={GoogleLogo} label="Google" onClick={() => {}}/>
      <OptionBlock alt="Keycloak logo" logoSrc={KeycloakLogo} label="Keycloak" onClick={() => redirect()}/>
    </Box>
  )
}

function OptionBlock(props: {alt: string, logoSrc: any, label: string, onClick: () => void}) {
  const sx: object = {
    ...border("outline-variant"),
    "&:hover": {
      ...border("tertiary")
    }
  }

  return (
    <Box onClick={props.onClick} sx={sx} className="border-2 rounded-lg p-4 flex gap-4 items-center hover:cursor-pointer">
      <Image width={50} height={50} alt={props.alt} src={props.logoSrc}/>
      <Typography variant="h4">{props.label}</Typography>
    </Box>
  )
}