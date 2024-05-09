import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, InputAdornment, List, ListItem, ListSubheader,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import { Contact, Address, AddressType } from "./net";
import { useState } from "react";
import EditNoteIcon from '@mui/icons-material/EditNote';

export function ContactView({open, contact, handleClose}: {open: boolean, contact: Contact, handleClose: () => void}) {
  return (
    <Dialog open={open} fullWidth={true} maxWidth="md">
      <DialogTitle>
        <Box className="w-full flex flex-col justify-center items-center">
          <Avatar className="w-20 h-20 text-5xl">{contact.name[0]}</Avatar>
          <span>{contact.name}</span>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogBody contact={contact}/>
      </DialogContent>
      <DialogActions>
      <Button
          variant="outlined" size="large" color="secondary"
          startIcon={<CancelIcon/>}
          onClick={handleClose}
        >Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function DialogBody({ contact }: {contact: Contact}) {
  return <>
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <PhoneIcon className="mr-2"/> Phone
      </AccordionSummary>
      <AccordionDetails>
        <List dense className="border rounded-lg">
          {
            (() => {
              const keys: string[] = toKeys(contact.phoneNumbers);
              return keys.map((item, index) => {
                return <>
                  <ListSubheader>{item}</ListSubheader>
                  <ListItem divider={index !== keys.length - 1} secondaryAction={<IconButton edge="end"><DeleteIcon/></IconButton>}>
                    {contact.phoneNumbers[item]}
                  </ListItem>
                </>
              })
            })()
          }
        </List>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <EmailIcon className="mr-2"/> Email
      </AccordionSummary>
      <AccordionDetails>
        <List dense className="border rounded-lg">
          {
            (() => {
              const keys: string[] = toKeys(contact.emails);
              return keys.map((item, index) => {
                return <>
                  <ListSubheader>{item}</ListSubheader>
                  <ListItem divider={index !== keys.length - 1} secondaryAction={<IconButton edge="end"><DeleteIcon/></IconButton>}>
                    {contact.emails[item]}
                  </ListItem>
                </>
              })  
            })()
          }
        </List>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <HomeIcon className="mr-2"/> Address
      </AccordionSummary>
      <AccordionDetails>
        <AddressBoard addresses={contact.addresses}/>
      </AccordionDetails>
    </Accordion>
  </>
}

function AddressBoard({ addresses }: { addresses: AddressType }) {
  const [alignment, setAlignment] = useState(0);

  function handleAlignment(_: any, value: number): void {
    setAlignment(value);
  }

  const addressKeys: string[] = toKeys(addresses);

  return (
    <Box className="w-full p-3 border rounded-lg">
      <Box className="w-fit mx-auto mb-3">
        <ToggleButtonGroup className="mx-auto" value={alignment} exclusive onChange={handleAlignment} size="small">
          {
            addressKeys.map((item, index) => <ToggleButton key={index} value={index}>{item}</ToggleButton>)
          }
        </ToggleButtonGroup>
      </Box>
      <Box>
        {
          addressKeys.map((key, index) => {
              return <Box key={index} className={"flex gap-2 flex-wrap w-full justify-center "+(index === alignment ? "block" : "hidden")}>
                {
                  toKeys(addresses[key]).map((prop, index) => {
                    return <TextField
                      key={index}
                      InputProps={{
                        endAdornment: (
                        <IconButton>
                          <EditNoteIcon/>
                        </IconButton>
                        ),
                        disableUnderline: true
                      }}
                      inputProps={{readOnly: true}}
                      variant="filled"
                      label={prop}
                      value={addresses[key][prop]}/>
                  })
                }
              </Box>
          })
        }
      </Box>
    </Box>
  )
}

function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}