"use client"
import {
  Avatar, Badge, Box, Button, ButtonGroup,
  ClickAwayListener, Divider, FormControl, Grow, IconButton, InputLabel, MenuItem,
  MenuList, Paper, Popper, Skeleton, Tooltip, Typography, Select,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert
} from "@mui/material";
import { bg, border, ColorRole, paint, text } from "../lib/colors";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/AddToPhotos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ErrorIcon from '@mui/icons-material/Error';
import { useUser } from "@auth0/nextjs-auth0/client";
import { CircularProgress } from "@mui/material";
import { getFlagEmoji, iterator } from "../lib/misc";
import { clearLocalContacts, removeAllUnseenContactNames } from "../lib/storage";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { CountryCode, ModalType, Run, Severity, ShowAlertFunc } from "../lib/types";
import { getCountryCodes } from "../lib/net";
import AlertContext from "../lib/AlertContext";
import Link from "next/link";

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
      <Box className="w-fit mr-1 sm:mr-10 gap-4">
        <Box className="flex items-center gap-2">
          <Avatar className="w-12 h-12" sx={paint(bg("primary"), text("on-primary"))} src={picture}/>
          <Typography>{name}</Typography>
          <Divider className="mx-2" orientation="vertical" flexItem/>
          <LogoutButton/>
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
        <div className="w-screen min-h-screen flex flex-col gap-6">
          <Header name={user.name as string} picture={user.picture as string}/>
          <div className="flex-grow">{children}</div>
          <Footer/>
        </div>
      }
    </>
  )
}

export function Footer({home = false}: {home?: boolean}) {
  return (
    <div
      style={paint(text("on-surface"), border("outline-variant"))}
      className="py-3 w-full border-t h-fit">
      <Typography className="text-center">{"Created by "}
        <Link href="https://github.com/neemiassgc" className="text-blue-900">neemiassgc</Link>
      </Typography>
    </div>
  );
}

export function NotifiablePage({ children }: { children: React.ReactNode }) {
  const [snack, setSnack] = useState<{ open: boolean, severity: Severity, msg: string}>({
    open: false, severity: "success", msg: "success"
  });

  const hideAlert = () => setSnack({ ...snack, open: false });

  const showAlert: ShowAlertFunc = (msg, severity = "success") => setSnack({ open: true, severity, msg });

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right"} }
        open={snack.open}
        autoHideDuration={5000}
        onClose={hideAlert}
      >
        <Alert onClose={hideAlert} className="w-full" variant="filled" severity={snack.severity}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  )
}

export function BadgedAvatar({ badged, letter }: { badged: boolean, letter: string }) {
   return (
    <Badge invisible={!badged} color='secondary' badgeContent=" " variant='dot'>
      <Avatar
        src="https://api.dicebear.com/9.x/fun-emoji/svg"
        sx={
          badged
          ? paint(bg("tertiary"), text("on-tertiary"))
          : paint(bg("secondary"), text("on-secondary"))
        }
      >
        {letter}
      </Avatar>
    </Badge>
  )
}

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    clearLocalContacts();
    removeAllUnseenContactNames();
    window.location.assign("/api/auth/logout");
  }

  return (
    <Tooltip title="Logout" arrow>
      <IconButton
        onClick={handleClick}
        sx={{
          ...paint(bg("primary"), text("on-primary")),
          ":hover": {
            ...paint(bg("primary-container"), text("on-primary-container"))
          }
        }}
        size="medium"
        disabled={loading}
      >
        <LogoutIcon fontSize="small"/>
      {
        loading &&
        <CircularProgress
          thickness={4}
          size={41}
          color="success"
          sx={{
            position: 'absolute',
            top: -2,
            left: -2,
            zIndex: 1,
          }}
        />
        }
      </IconButton>
    </Tooltip>
  )
}

export function CustomDivider({variant = "middle"}: { variant?: "inset" | "middle" | "fullWidth"}) {
  return <Divider variant={variant} sx={bg("outline-variant")}/>;
}

export function SplitButton({ options }: { options: { title: string, onClick: Run }[] }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ButtonGroup ref={anchorRef} className="mb-3">
        <DefaultButton onClick={() => setOpen(true)} title="New">
          <AddIcon/>
        </DefaultButton>
      </ButtonGroup>
      <Popper
        className="z-10"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper sx={paint(bg("surface-container-lowest"), text("on-surface"))}>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {
                    options.map(option => (
                      <MenuItem
                        key={option.title}
                        onClick={() => { setOpen(false); option.onClick()}}
                      >
                        {option.title}
                      </MenuItem>
                    ))
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export function DefaultButton({ title, onClick, colorVariant = "primary", children, className}: {
  title: string,
  onClick: Run,
  colorVariant?: "primary" | "secondary" | "tertiary"
  children: ReactElement,
  className?: string
}) {
  const styles = paint(bg(colorVariant), text(("on-"+colorVariant) as ColorRole));
  return (
    <Button
      onClick={onClick}
      variant="contained"
      className={"w-fit "+className}
      size="medium"
      sx={{
        ...styles, "&:hover": styles,
        borderRadius: 2
      }}
      startIcon={children}
    >
      {title}
    </Button>
  )
}

export function SelectCountry({disabled = false, variant = "dial_code", ...props}: {
  value: string,
  onChange: (value: string) => void,
  className?: string,
  styles: any,
  disabled?: boolean,
  variant?: "dial_code" | "name"
}) {
  const [data, setData] = useState<CountryCode[]>([]);

  useEffect(() => {
    getCountryCodes()
      .then(setData)
  }, [])

  return (
    <FormControl {...props.styles} className={props.className} size="small">
      <InputLabel id="input-label">country</InputLabel>
      <Select
        disabled={disabled}
        sx={text("tertiary")}
        labelId="input-label"
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
        label="country"
        renderValue={_ => props.value}
      >
        {
          data.sort((a, b) => a.name.localeCompare(b.name)).map((countryCode, key) =>
            <MenuItem sx={text("tertiary")} key={key} value={countryCode[variant]}>
              {countryCode.name} {getFlagEmoji(countryCode.code)} {countryCode.dial_code}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  )
}

export function Modal({ mini = false, acceptButtonDisabled = false, ...props }:
  ModalType & { children?: ReactNode, mini?: boolean, acceptButtonDisabled?: boolean }) {
  return props.open && (
    <Dialog open={true} maxWidth="xl">
      <DialogTitle sx={paint(bg("surface-container-low"), text("on-surface"))}>
        <Typography sx={{color: "inherit"}} className="text-center">
          {
            props.isLoading ? "Loading..." : props.title
          }
        </Typography>
      </DialogTitle>
      <CustomDivider/>
      {
        !mini &&
        <>
          <DialogContent className="w-96" sx={paint(bg("surface-container-low"), text("on-surface"))}>
            {props.children}
          </DialogContent>
          <CustomDivider/>
        </>
      }
      <DialogActions sx={paint(bg("surface-container-low"), text("on-surface"))}>
        <Box className="w-full flex justify-center gap-3 overflow-hidden">
            <>
              <IconButton disabled={acceptButtonDisabled || props.isLoading} sx={paint(text("primary"))} onClick={props.handleAccept} size="small">
                <CheckCircleIcon fontSize="large"/>
               { 
                props.isLoading &&
                <CircularProgress
                  thickness={4}
                  size={36}
                  color="success"
                  sx={{
                    position: 'absolute',
                    top: 5,
                    left: 5,
                    zIndex: 1,
                  }}
                />}
              </IconButton>
              <IconButton disabled={props.isLoading} sx={paint(text("error"))} onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
            </>
        </Box>
      </DialogActions>
    </Dialog>
  )
}