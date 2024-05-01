"use client"
import { InputAdornment, Button, Box, Avatar, OutlinedInput, Checkbox } from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function Home() {
  return (
    <>
      <header className="bg-green-500 w-full text-right p-2">
        <span className="mr-8">Log out</span>
      </header>
      <main className="mt-36 w-full p-1">
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
  const [indexSet, setIndexSet] = useState([false, false, false, false]);

  const handleClick: (index: any) => void = index => {
    const newSet = [...indexSet];
    newSet[index] = !newSet[index];
    setIndexSet(newSet);
  }

  return (
    <Box className="w-full bg-white rounded-lg border-2">
      {generateRow(["Tom", "Jerry", "Mickey", "Rose"], handleClick, indexSet)}
    </Box>
  )
}

function generateRow(contactNames: string[], handleClick: (event: any) => void, indexSet: boolean[]) {
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
