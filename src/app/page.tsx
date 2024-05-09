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
      <Button className="right-0" variant="contained" size="small" startIcon={<PersonAddIcon/>}>Add Contact</Button>
    </Box>
  )
}

function ContactBoard() {
  const [page, setPage] = useState(1);

  const handlePagination: (event: React.ChangeEvent<unknown>, value: number) => void = (_, value) => {
    setPage(value);
  }

  const countPerPage: number = 3;
  const contacts: Contact[] = getData();
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
  const [indexSet, setIndexSet] = useState([false, false, false, false]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpen: (value: boolean) => () => void = value => () => setOpen(value);

  const handleCheckBoxClick: (index: any) => () => void = index => {
    return () => {
      const newSet = [...indexSet];
      newSet[index] = !newSet[index];
      setIndexSet(newSet);
    }
  }

  return (
    <>
      <Box className="w-full bg-white rounded-lg border-2">
        {
          data.map((contact, index) => {
            return <ListItem key={index} secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleCheckBoxClick(index)}
                  checked={indexSet[index]}
                />
              }>
              <ListItemButton selected={indexSet[index]} onClick={() => {handleOpen(true)(); setSelectedIndex(index)}}>
                <ListItemAvatar>
                  <Avatar>
                    {contact.name[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={contact.name} secondary={
                    (() => {
                      const phoneNumbers: string[] = [];
                      for (const key in contact.phoneNumbers)
                        phoneNumbers.push(`${key}: ${contact.phoneNumbers[key]}`)
                      return phoneNumbers[0]
                    })()
                  }/>
              </ListItemButton>
            </ListItem>
          })
        }
        <ContactView open={open} contact={data[selectedIndex]} handleClose={handleOpen(false)}/>
      </Box>
    </>
  )
}