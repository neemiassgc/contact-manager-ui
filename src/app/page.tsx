"use client"
import { InputAdornment, Button, Box, Avatar, OutlinedInput, Checkbox, Pagination } from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { ContactView } from "./components"
import { Contact, getData } from './net';

export default function Home() {
  return (
    <>
      <Header/>
      <main className="mt-16 w-full p-1">
        <Box className="w-5/12 mx-auto">
          <ContactActionHeader/>
          <ContactBoard/>
        </Box>
      </main>
    </>
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

function ContactActionHeader() {
  const [open, setOpen] = useState(false);

  const handleOpen: (value: boolean) => () => void = value => {
    return () => {
      setOpen(value);
    }
  }

  return (
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
      <Button onClick={handleOpen(true)} className="right-0" variant="contained" size="small" startIcon={<PersonAddIcon/>}>Add Contact</Button>
      <ContactView open={open} handleClose={handleOpen(false)}/>
    </Box>
  )
}

function ContactBoard() {
  const [indexSet, setIndexSet] = useState([false, false, false, false]);
  const [page, setPage] = useState(1);

  const handlePagination: (event: React.ChangeEvent<unknown>, value: number) => void = (_, value) => {
    setPage(value);
  }

  const handleClick: (index: any) => void = index => {
    const newSet = [...indexSet];
    newSet[index] = !newSet[index];
    setIndexSet(newSet);
  }

  return (
    <>
      <Box className="w-full bg-white rounded-lg border-2">
        {generateList(getPaginatedData(3, page), handleClick, indexSet)}
      </Box>
      <Box className="p-2">
        <Pagination className="w-fit mx-auto" count={3} page={page} onChange={handlePagination} size="large" />
      </Box>
    </>
  )
}

function getPaginatedData(size: number, page: number): Contact[] {
  const contacts: Contact[] = getData();
  const viewStart: number = size * page - size;
  return contacts.slice(viewStart === 0 ? 0 : viewStart, size * page);
}

function generateList(contacts: Contact[], handleClick: (event: any) => void, indexSet: boolean[]) {
  const elements = [];
  for (let i = 0; i < contacts.length; i++) {
    elements.push(
      <ListItem secondaryAction={
        <Checkbox
          edge="end"
          onChange={handleClick.bind(null, i)}
          checked={indexSet[i]}
        />
      }>
        <ListItemButton selected={indexSet[i]}>
          <ListItemAvatar>
            <Avatar>
              {contacts[i].name[0].toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={contacts[i].name} secondary={
              (() => {
                const phoneNumbers: string[] = [];
                for (const key in contacts[i].phoneNumbers)
                  phoneNumbers.push(`${key}: ${contacts[i].phoneNumbers[key]}`)
                return phoneNumbers[0]
              })()
            }/>
        </ListItemButton>
      </ListItem>
    )
  }
  return elements;
}
