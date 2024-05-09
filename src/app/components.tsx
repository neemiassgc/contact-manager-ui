import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton,
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
  type Panel = "panel1" | "panel2" | "panel3" | null;

  const [expanded, setExpanded] = useState<Panel>(null)

  const handleExpansion = (value: Panel) => (_: any, expandable: boolean) => {
    setExpanded(expandable ? value : null);
  }

  return <>
    <Accordion expanded={expanded === "panel1"} onChange={handleExpansion("panel1")}>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <PhoneIcon className="mr-2"/> Phone
      </AccordionSummary>
      <AccordionDetails>
        <Box className="w-full flex gap-2 flex-wrap">
         {
            toKeys(contact.phoneNumbers).map((prop, index) => {
                return <ContentBox key={index} label={prop} content={contact.phoneNumbers[prop]}/>
            })
          }
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion expanded={expanded === "panel2"} onChange={handleExpansion("panel2")}>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <EmailIcon className="mr-2"/> Email
      </AccordionSummary>
      <AccordionDetails>
        <Box className="w-full flex gap-2 flex-wrap">
          {
            toKeys(contact.emails).map((prop, index) => {
                return <ContentBox key={index} label={prop} content={contact.emails[prop]}/>
            })
          }
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion expanded={expanded === "panel3"} onChange={handleExpansion("panel3")}>
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
      <Box className="flex gap-2 flex-wrap">
        {
          addressKeys.map((key, index) => {
              return toKeys(addresses[key]).map(prop => {
                  return <ContentBox hidden={index !== alignment} key={index} label={prop} content={addresses[key][prop]}/>
              })
          })
        }
      </Box>
    </Box>
  )
}

function ContentBox({ label, content, hidden = false }: {label: string, content: string, hidden?: boolean}) {
  const classes: string[] = [
    "w-fit", "flex", "flex-col", "gap-0", "justify-center",
    "border", "rounded-lg", "p-2", "hover:shadow-lg", hidden ? "hidden" : "block"
  ]
  return <Box className={classes.join(" ")}>
    <span className="text-start">{label}</span>
    <Box className="flex gap-0">
      <span className="text-center h-fit my-auto">{content}</span>
      <IconButton size="small"><DeleteIcon/></IconButton>
    </Box>
  </Box>
}

function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}