"use client"
import { InputAdornment, Button, Box, Avatar, OutlinedInput, Pagination } from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { getLocalContacts } from './storage';
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

  return (
    <>
      <Box className="w-full bg-white rounded-lg border-2">
        {
          data.map((contact, index) => {
            return <ListItem key={index}>
              <ListItemButton onClick={() => router.push("/profile")}>
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
    </>
  )
}