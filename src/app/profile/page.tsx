"use client"

import {
  Avatar, Box, TextField, Tooltip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, ToggleButtonGroup,
  ToggleButton,
  Breadcrumbs,
  Typography,
  DialogContent,
  DialogTitle,
  Dialog
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { toKeys } from "../utils";
import { Contact, AddressType } from "../types";
import { useState } from "react";
import { getSelectedContact } from "../storage";
import Link from "next/link";

export default function Page() {
  const selectedContact: Contact = getSelectedContact();

  return (
    <Box className="w-1/2 mx-auto mt-10">
      <Breadcrumbs>
        <Link href="/">Home</Link>
        <Typography>Profile</Typography>
      </Breadcrumbs>
      <Header contactName={selectedContact.name}/>
      <Body contact={selectedContact}/>
    </Box>
  )
}

function Header(props: {contactName: string}) {
  const [editing, setEditing] = useState(false);

  return <Box className="w-full flex flex-col justify-center items-center">
    <Avatar sx={{width: 100, height: 100, fontSize: 50}}>{props.contactName[0]}</Avatar>
    <Box className="ml-5 mt-1">
      <span>{props.contactName}</span>
      <Tooltip title="Edit Contact Name" arrow>
        <IconButton onClick={() => setEditing(true)}>
          <EditNoteRoundedIcon fontSize="medium"/>
        </IconButton>
      </Tooltip>
    </Box>
    <PromptModal
      open={editing}
      title="Edit the name of the contact"
      handleClose={() => setEditing(false)}
      handleSave={()=>{}}
    />
  </Box>
}

function Body({ contact }: {contact: Contact}) {
  const [creatingPhone, setCreatingPhone] = useState(false);
  const [creatingEmail, setCreatingEmail] = useState(false);

  return <>
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <PhoneIcon className="mr-2"/> Phone
      </AccordionSummary>
      <AccordionDetails>
        <Box className="w-full justify-start flex gap-2 flex-wrap">
          {
            toKeys(contact.phoneNumbers).map((prop, index) => {
                return <ContentBox key={index} label={prop} content={contact.phoneNumbers[prop]} deleteHandle={() => null}/>
            })
          }
          <CreationPlaceholder onClick={() => setCreatingPhone(true)} label="Add new phone"/>
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <EmailIcon className="mr-2"/> Email
      </AccordionSummary>
      <AccordionDetails>
        <Box className="w-full justify-start flex gap-2 flex-wrap">
          {
            toKeys(contact.emails).map((prop, index) => {
                return <ContentBox key={index} label={prop} content={contact.emails[prop]} deleteHandle={() => null}/>
            })
          }
          <CreationPlaceholder onClick={() => setCreatingEmail(true)} label="Add new email"/>
        </Box>
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
    <PromptModal open={creatingPhone} title="Create a new phone" handleClose={() => setCreatingPhone(false)} handleSave={()=>{}}/>
    <PromptModal open={creatingEmail} title="Create a new email" handleClose={() => setCreatingEmail(false)} handleSave={()=>{}}/>
  </>
}

function AddressBoard(props: { addresses: AddressType}) {
  const [alignment, setAlignment] = useState(0);
  const [creating, setCreating] = useState(false);

  function handleAlignment(_: any, value: number): void {
    setAlignment(value);
  }

  const addressKeys: string[] = toKeys(props.addresses);

  return (
    <Box className="w-full p-3 border rounded-lg">
      <Box className="w-full mb-5 flex">
        <ToggleButtonGroup className="mx-auto" value={alignment} exclusive onChange={handleAlignment} size="small">
          {
            addressKeys.map((item, index) => <ToggleButton key={index} value={index}>{item}</ToggleButton>)
          }
        </ToggleButtonGroup>
        <Box>
          <Tooltip title="Delete Address">
            <IconButton><DeleteIcon className="text-2xl"/></IconButton>
          </Tooltip>
          <Tooltip title="Create New Address">
            <IconButton onClick={() => setCreating(true)}><AddBoxRoundedIcon className="text-2xl"/></IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box className="flex gap-2 flex-wrap justify-start">
        {
          addressKeys.map((key, index) => {
              return toKeys(props.addresses[key]).map(prop => {
                  return <ContentBox hidden={index !== alignment} key={index} label={prop} content={props.addresses[key][prop]}/>
              })
          })
        }
      </Box>
      <PromptModal
        open={creating}
        title="Create a new address"
        fieldNames={toKeys(props.addresses[addressKeys[0]])}
        handleClose={() => setCreating(false)}
        handleSave={()=>{}}
      />
    </Box>
  )
}

function ContentBox(props: {label: string, content: string, hidden?: boolean, deleteHandle?: () => void}) {
  const classes: string[] = [
    "w-fit", "flex", "flex-col", "gap-0", "justify-center",
    "border", "rounded-lg", "p-2", "hover:shadow-lg", props.hidden ? "hidden" : "block"
  ]
  return <Box className={classes.join(" ")}>
    <span className="text-start text-sm">{props.label}</span>
    <Box className="flex gap-0">
      <span className="text-center h-fit my-auto">{props.content}</span>
      {
      props.deleteHandle &&
       <Tooltip title={"Delete "+props.label}>
        <IconButton onClick={props.deleteHandle} size="small"><DeleteIcon/></IconButton> 
       </Tooltip>
      }
    </Box>
  </Box>
}

function CreationPlaceholder(props: {label: string, onClick: () => void}) {
  return <Box onClick={props.onClick} className="p-5 border-4 border-dotted rounded-lg hover:cursor-pointer">
      <AddBoxRoundedIcon className="mr-2 text-gray-400"/>
      <span className="text-gray-600">{props.label.toLocaleLowerCase()}</span>
  </Box>
}

function PromptModal(props: {open: boolean, title: string, fieldNames?: string[], handleClose: () => void, handleSave: () => void}) {
  return (
    <Dialog open={props.open}>
      <DialogTitle><Typography className="font-bold text-center">{props.title}</Typography></DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-2 w-full p-1 h-full">
          <TextField variant="outlined" size="small" label="label" placeholder="label"/>
          {
            !props.fieldNames ? <TextField variant="outlined" size="small" label="value" placeholder="value"/> :
            <>
              {
                props.fieldNames.map((fieldName: string, index: number) =>
                  <TextField key={index} variant="outlined" size="small" label={fieldName} placeholder="label"/>)
              }
            </>
          }
        </Box>
        <Box className="w-full flex justify-center mt-2">
          <IconButton onClick={props.handleSave} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}