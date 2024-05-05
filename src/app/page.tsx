"use client"
import { InputAdornment, Button, Box, Avatar, OutlinedInput, Checkbox, Pagination } from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

export default function Home() {
  return (
    <>
      <Header/>
      <main className="mt-36 w-full p-1">
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
        {generateList(getData(3, page), handleClick, indexSet)}
      </Box>
      <Box className="p-2">
        <Pagination className="w-fit mx-auto" count={4} page={page} onChange={handlePagination} size="large" />
      </Box>
    </>
  )
}

function getData(size: number, page: number): string[] {
  const names: string[] = ["Tom", "Jerry", "Mickey", "Rose", "Gary", "Tyrel", "Gulia", "Roger", "Anna", "Steven", "Bob", "Richard"];
  const viewStart: number = size * page - size;
  return names.slice(viewStart === 0 ? 0 : viewStart, size * page);
}

function generateList(contactNames: string[], handleClick: (event: any) => void, indexSet: boolean[]) {
  const elements = [];
  for (let i = 0; i < contactNames.length; i++) {
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
              {contactNames[i][0].toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={contactNames[i]} secondary={
              "+8187271092831"
            }/>
        </ListItemButton>
      </ListItem>
    )
  }
  return elements;
}
