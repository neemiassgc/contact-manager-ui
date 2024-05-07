import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, List, ListItem, ListSubheader,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import { Contact } from "./net";

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
        <Accordion>
          <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
            <PhoneIcon className="mr-2"/> Phone
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {
                toKeys(contact.phoneNumbers).map(item => {
                  return <>
                    <ListSubheader>{item}</ListSubheader>
                    <ListItem divider secondaryAction={<IconButton edge="end"><DeleteIcon/></IconButton>}>
                      {contact.phoneNumbers[item]}
                    </ListItem>
                  </>
                })
              }
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
            <EmailIcon className="mr-2"/> Email
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {
                toKeys(contact.emails).map(item => {
                  return <>
                    <ListSubheader>{item}</ListSubheader>
                    <ListItem divider secondaryAction={<IconButton edge="end"><DeleteIcon/></IconButton>}>
                      {contact.emails[item]}
                    </ListItem>
                  </>
                })     
              }
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
           <HomeIcon className="mr-2"/> Address
          </AccordionSummary>
          <AccordionDetails>
            {
              toKeys(contact.addresses).map(item => {
                return <>
                  <ListSubheader>{item}</ListSubheader>
                  <ListItem divider secondaryAction={<IconButton edge="end"><DeleteIcon/></IconButton>}>
                    {
                      ["street", "city", "state", "country", "zipcode"]
                        .map(value => contact.addresses[item][value])
                        .join("; ")
                    }
                  </ListItem>
                </>
              })
            }
          </AccordionDetails>
        </Accordion>
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

function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}