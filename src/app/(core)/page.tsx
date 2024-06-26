"use client"
import { InputAdornment, Button, Box, Avatar, Pagination, IconButton, Dialog, DialogTitle, Typography, DialogActions, DialogContent, TextField, Divider, CircularProgress } from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DataArrayIcon from '@mui/icons-material/DataArray';
import { setSelectedContact } from '../lib/storage';
import { Contact } from "../lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react';
import { paint, bg, border, text } from '../lib/colors';
import { filterByName, getPaginatedData, isUserNotFound } from '../lib/misc';
import { useAllContacts } from '../lib/hooks';
import { ErrorScreen, Loading } from './components';
import { createNewUser } from '../lib/net';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user } = useUser();
  const { data, error, isLoading, reload } = useAllContacts();

  useEffect(() => {
    if (error) {
      if (isUserNotFound(error))
        createNewUser((user as UserProfile).name as string)
          .then(() => reload())
    }
  }, [error, user, reload])

  return (
    <>
      <main className="mt-16 w-full p-1">
        {
          (error && isUserNotFound(error)) || isLoading ? <Loading/>
          : error ? <ErrorScreen label={error.message}/> : <ContactListBoard contacts={data as Contact[]}/>
        }
      </main>
    </>
  );
}

function ContactListBoard({ contacts }: { contacts: Contact[] }) {
  const [searchText, setSearchText] = useState("");
  
  const filteredContacts: Contact[] = filterByName(contacts, searchText);

  const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }

  return (
    <Box className="p-5 w-full sm:p-0 sm:w-8/12 md:w-7/12 lg:w-5/12 mx-auto">
      <ContactListHeader textFieldOnChange={handleSearchText} textFieldValue={searchText}/>
      {
        filteredContacts.length > 0 ?
        <PageableContactList contacts={filteredContacts}/> :
        <>
          <Divider/>
          <Box className="w-full text-center mt-3" sx={{...text("on-surface"), opacity: 0.7}}>
            <DataArrayIcon fontSize="large"/>
            <span className="text-2xl align-middle ml-2">Nothing</span>
          </Box>
        </>
      }
    </Box>
  )
}

function ContactListHeader(props: {textFieldValue: string, textFieldOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Box className="w-full flex mb-3 justify-center flex-wrap-reverse gap-3 sm:gap-0 sm:justify-between">
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              '& fieldset': {border: "none"},
            },
            ...paint(bg("tertiary"), text("on-tertiary")),
            borderRadius: 2
          }}
          size="small"
          placeholder="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={paint(text("on-tertiary"))}/>
              </InputAdornment>
            ),
          }}
          inputProps={{
            sx: {
              "&::placeholder": {
                ...paint(text("on-tertiary")),
                opacity: 1
              },
              ...paint(text("on-tertiary"))
            }
          }}
          onChange={props.textFieldOnChange}
          value={props.textFieldValue}
        />
        <Button
          onClick={() => setOpenModal(true)}
          variant="contained"
          className="w-fit"
          size="medium"
          sx={{
            ...paint(bg("primary"), text("on-primary")),
            "&:hover": paint(bg("primary-container"), text("on-primary-container")),
            borderRadius: 2
          }}
          startIcon={<PersonAddIcon/>}>Add Contact</Button>
      </Box>
      <CreationModal open={openModal} handleClose={() => setOpenModal(false)} handleYes={()=>{}}/>
    </>
  )
}

function PageableContactList({ contacts }: { contacts: Contact[] }) {
  const [page, setPage] = useState(1);

  const handlePagination: (event: React.ChangeEvent<unknown>, value: number) => void = (_, value) => {
    setPage(value);
  }
  
  const countPerPage: number = 6;
  const paginationCount: number = Math.floor(contacts.length / countPerPage);

  return (
    <>
      <ContactList data={getPaginatedData(countPerPage, page, contacts)}/>
      {
        contacts.length > countPerPage &&
        <Box className="p-2">
          <Pagination
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": paint(bg("primary"), text("on-primary")),
              "& .MuiPaginationItem-root.Mui-selected:hover": paint(bg("primary-container"), text("on-primary-container")),
              "& .MuiPaginationItem-root:hover": paint(bg("secondary-container"), text("on-secondary-container")),
              "& .MuiPaginationItem-root": paint(text("on-surface"))
            }}
            className="w-fit mx-auto"
            count={contacts.length % countPerPage === 0 ? paginationCount : paginationCount + 1}
            page={page}
            onChange={handlePagination}
            size="large" />
        </Box>
      }
    </>
  )
}

function ContactList({ data }: { data: Contact[] }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [contactName, setContactName] = useState("");

  return (
    <>
      <Box className="w-full rounded-xl border" sx={paint(bg("surface"), text("on-surface"), border("outline-variant"))}>
        {
          data.map((contact, index) => {
            return <ListItem key={index} secondaryAction={
              <IconButton onClick={() => {
                setOpenModal(true)
                setContactName(contact.name);
              }}>
                <DeleteForeverIcon sx={text("on-surface")}/>
              </IconButton>
            }>
              <ListItemButton onClick={() => {
                setSelectedContact(contact);
                router.push("/profile")
              }}>
                <ListItemAvatar>
                  <Avatar sx={paint(bg("secondary"), text("on-secondary"))}>
                    {contact.name[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText sx={text("on-surface")} primary={contact.name}/>
              </ListItemButton>
            </ListItem>
          })
        }
      </Box>
      <ConsentModal open={openModal} contactName={contactName} handleClose={() => setOpenModal(false)} handleYes={()=>{}}/>
    </>
  )
}

function ConsentModal(props: {open: boolean, contactName: string, handleClose: () => void, handleYes: () => void}) {
  return(
    <Dialog open={props.open}>
      <DialogTitle sx={paint(bg("surface"), text("on-surface"))}><Typography>Delete &apos;{props.contactName}&apos;?</Typography></DialogTitle>
      <DialogActions sx={paint(bg("surface"), text("on-surface"))}>
        <Box className="w-full flex justify-center gap-3">
          <IconButton sx={paint(text("primary"))} onClick={props.handleYes} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton sx={paint(text("error"))} onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

function CreationModal(props: {open: boolean, handleClose: () => void, handleYes: () => void}) {
  const containerSx: object = paint(bg("surface"), text("on-surface"));
  const textTertiary = paint(text("tertiary"));
  const borderTertiary = paint(border("tertiary"));
  const textFieldStyles: object = {
    sx: {
      "& label, label.Mui-focused": textTertiary,
      '& .MuiOutlinedInput-root': {
        '& fieldset': borderTertiary,
        '&:hover fieldset': borderTertiary,
        '&.Mui-focused fieldset': borderTertiary,
      },
    },
    inputProps: {
      sx: {
        "&::placeholder": textTertiary,
        ...textTertiary
      }
    }
  }

  return (
    <Dialog open={props.open}>
      <DialogTitle sx={containerSx}>
        <Typography sx={{color: "inherit"}} className="text-center">Create a new contact</Typography>
      </DialogTitle>
      <DialogContent sx={containerSx}>
        <Box className="w-full mb-2 pt-1">
          <TextField
            {...textFieldStyles}
            className="w-full"
            label="contact name" placeholder="contact name"
            size="small" variant="outlined"
          />
        </Box>
        <Box className="w-full flex gap-2">
          <TextField
            {...textFieldStyles}
            label="phone label" placeholder="phone label"
            size="small" variant="outlined"
          />
          <TextField
            {...textFieldStyles}
            label="phone" placeholder="phone"
            size="small" variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={containerSx}>
        <Box className="w-full flex justify-center gap-3">
          <IconButton sx={paint(text("primary"))} onClick={props.handleYes} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton sx={paint(text("error"))} onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}