"use client"

import {
  Avatar, Box, InputAdornment, TextField, Tooltip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toKeys } from "../utils";
import { Contact, AddressType } from "../types";
import { useState } from "react";
import { getSelectedContact } from "../storage";

export default function Page() {
  const selectedContact: Contact = getSelectedContact();

  return (
    <Box className="w-1/2">
      <Header contactName={selectedContact.name}/>
      <Body contact={selectedContact}/>
    </Box>
  )
}

function Header(props: {contactName: string}) {
  const [editing, setEditing] = useState(false);

  const handleEditing = (value: boolean) => () => setEditing(value);

  return <Box className="w-full flex flex-col justify-center items-center">
      <Avatar className="w-20 h-20 text-5xl">{props.contactName[0]}</Avatar>
      <Box>
        {
          editing ? 
          <TextField
            onBlur={handleEditing(false)}
            className="mt-2"
            variant="outlined" label="Contact name" size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">
                <IconButton size="small" onClick={handleEditing(false)}><CheckCircleIcon/></IconButton>
              </InputAdornment>
            }}
          /> :
          <>
            <span>{props.contactName}</span>
            <Tooltip title="Edit Contact Name" arrow>
              <IconButton onClick={handleEditing(true)}>
                <EditNoteRoundedIcon fontSize="medium"/>
              </IconButton>
            </Tooltip>
          </>
        }
      </Box>
  </Box>
}

function Body({ contact }: {contact: Contact}) {
  type Panel = "panel1" | "panel2" | "panel3" | null;

  const [expanded, setExpanded] = useState<Panel>(null)
  const [creating, setCreating] = useState([false, false, false]);

  const handleExpansion = (value: Panel) => (_: any, expandable: boolean) => {
    setExpanded(expandable ? value : null);
  }

  const handleCreating = (value: boolean, index: number) => () => {
    setCreating(prev => {
      const copy: boolean[] = [...prev];
      copy[index] = value;
      return copy
    })
  }

  return <>
    <Accordion expanded={expanded === "panel1"} onChange={handleExpansion("panel1")}>
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
          {
            creating[0] ?
              <CreationForm handleClose={handleCreating(false, 0)} label="phone"/> :
              <CreationPlaceholder onClick={handleCreating(true, 0)} label="Add new phone"/>
          }
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion expanded={expanded === "panel2"} onChange={handleExpansion("panel2")}>
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
          {
            creating[1] ?
              <CreationForm handleClose={handleCreating(false, 1)} label="email"/> :
              <CreationPlaceholder onClick={handleCreating(true, 1)} label="Add new email"/>
          }
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion expanded={expanded === "panel3"} onChange={handleExpansion("panel3")}>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
        <HomeIcon className="mr-2"/> Address
      </AccordionSummary>
      <AccordionDetails>
        {
          creating[2] ?
            <AddressCreationBoard addressFields={toKeys(contact.addresses[toKeys(contact.addresses)[0]])}/> :
            <AddressBoard handleAddButton={handleCreating(true, 2)} addresses={contact.addresses}/>
        }
      </AccordionDetails>
    </Accordion>
  </>
}

function AddressCreationBoard(props: {addressFields: string[]}) {
  return <Box className="w-full">
    <Box className="flex justify-center flex-wrap gap-2">
      {
        props.addressFields.map((field, index) => {
          return <TextField key={index} size="small" className="w-fit"
            placeholder={field} label={field}

          />
        })
      }
    </Box>
    <Box className="flex justify-center">
      <IconButton className="" size="medium"><ArrowBackIcon fontSize="large"/></IconButton>
      <IconButton className="" size="medium"><CheckCircleIcon fontSize="large"/></IconButton>
    </Box>
  </Box>
}

function CreationForm(props: {label: "phone" | "email", handleClose: () => void}) {
  const [clicked, setClicked] = useState(false);

  const actionButton = (clickAction: () => void) => {
    return <InputAdornment position="end">
        <IconButton onClick={clickAction}><CheckCircleIcon/></IconButton>
    </InputAdornment>
  }

  return <Box className="w-fit h-fit my-auto">
    {
      clicked ?
        <TextField focused color="secondary" size="small" placeholder={"type your "+props.label} variant="outlined" label={props.label}
          InputProps={{
            endAdornment: actionButton(props.handleClose)
          }}
        /> :
        <TextField focused color="primary" size="small" variant="outlined" label="label" placeholder="label"
          InputProps={{
            endAdornment: actionButton(() => setClicked(true))
          }}
        />
    }
  </Box>
}

function AddressBoard(props: { addresses: AddressType, handleAddButton: () => void}) {
  const [alignment, setAlignment] = useState(0);

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
            <IconButton onClick={props.handleAddButton}><AddBoxRoundedIcon className="text-2xl"/></IconButton>
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