"use client"
import { InputAdornment, Button, Box, Avatar, OutlinedInput, Pagination, IconButton, Dialog, DialogTitle, Typography, DialogActions, DialogContent, TextField } from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getLocalContacts, setSelectedContact } from './storage';
import { Contact } from "./types"
import { useRouter } from "next/navigation"
import { useState } from 'react';

export default function Home() {
  return (
    <>
      <main className="mt-16 w-full p-1">
        <Box className="w-5/12 mx-auto">
          <ContactActionHeader/>
          <ContactBoard/>
        </Box>
      </main>
    </>
  );
}

function ContactActionHeader() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Box className="w-full flex mb-3 justify-between">
        <OutlinedInput
          size="small"
          className="bg-white"
          placeholder="search"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
        <Button onClick={() => setOpenModal(true)} variant="contained" size="small" startIcon={<PersonAddIcon/>}>Add Contact</Button>
      </Box>
      <CreationModal open={openModal} handleClose={() => setOpenModal(false)} handleYes={()=>{}}/>
    </>
  )
}

function ContactBoard() {
  const [page, setPage] = useState(1);

  const handlePagination: (event: React.ChangeEvent<unknown>, value: number) => void = (_, value) => {
    setPage(value);
  }

  const countPerPage: number = 7;
  const contacts: Contact[] = getLocalContacts();
  const paginationCount: number = Math.floor(contacts.length / countPerPage);

  return (
    <>
      <ContentList data={getPaginatedData(countPerPage, page, contacts)}/>
      <Box className="p-2">
        <Pagination
          className="w-fit mx-auto"
          count={contacts.length % countPerPage === 0 ? paginationCount : paginationCount + 1}
          page={page}
          onChange={handlePagination}
          size="large" />
      </Box>
    </>
  )
}

function getPaginatedData(size: number, page: number, contacts: Contact[]): Contact[] {
  const viewStart: number = size * page - size;
  return contacts.slice(viewStart === 0 ? 0 : viewStart, size * page);
}

function ContentList({ data }: { data: Contact[] }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [contactName, setContactName] = useState("");

  return (
    <>
      <Box className="w-full bg-white rounded-lg border-2">
        {
          data.map((contact, index) => {
            return <ListItem key={index} secondaryAction={
              <IconButton onClick={() => {
                setOpenModal(true)
                setContactName(contact.name);
              }}>
                <DeleteForeverIcon/>
              </IconButton>
            }>
              <ListItemButton onClick={() => {
                setSelectedContact(contact);
                router.push("/profile")
              }}>
                <ListItemAvatar>
                  <Avatar>
                    {contact.name[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={contact.name}/>
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
      <DialogTitle><Typography>Delete &apos;{props.contactName}&apos;?</Typography></DialogTitle>
      <DialogActions>
        <Box className="w-full flex justify-center gap-3">
          <IconButton onClick={props.handleYes} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

function CreationModal(props: {open: boolean, handleClose: () => void, handleYes: () => void}) {
  return (
    <Dialog open={props.open}>
      <DialogTitle><Typography className="text-center">Create a new contact</Typography></DialogTitle>
      <DialogContent>
        <Box className="w-full mb-2 pt-1">
          <TextField
            className="w-full"
            label="contact name" placeholder="contact name"
            size="small" variant="outlined"
          />
        </Box>
        <Box className="w-full flex gap-2">
          <TextField
            label="phone label" placeholder="phone label"
            size="small" variant="outlined"
          />
          <TextField
            label="phone" placeholder="phone"
            size="small" variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box className="w-full flex justify-center gap-3">
          <IconButton onClick={props.handleYes} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}