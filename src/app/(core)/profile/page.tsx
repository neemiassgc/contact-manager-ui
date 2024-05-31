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
import { toKeys } from "../../lib/utils";
import { Contact, AddressType } from "../../lib/types";
import { useState } from "react";
import { getSelectedContact } from "../../lib/storage";
import { bg, text, paint, border, color} from "../../lib/colors";
import Link from "next/link";

export default function Page() {
  const selectedContact: Contact = getSelectedContact();

  return (
    <Box className="w-11/12 md:w-1/2 mx-auto mt-10 mb-5">
      <Breadcrumbs sx={paint(text("on-surface"))}>
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
    <Avatar
      sx={{
        width: 100, height: 100, fontSize: 50,
        ...paint(bg("primary"), text("on-primary"))
      }}
    >{props.contactName[0]}</Avatar>
    <Box className="ml-5 mt-1">
      <span style={paint(text("on-surface"))}>{props.contactName}</span>
      <Tooltip title="Edit Contact Name" arrow>
        <IconButton onClick={() => setEditing(true)}>
          <EditNoteRoundedIcon sx={paint(text("on-surface"))} fontSize="medium"/>
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
  const [expanded, setExpanded] = useState([true, true, true])

  const handleExpanded = (index: number) => (_:any, value: boolean) => {
    const copy: boolean[] = [...expanded];
    copy[index] = value;
    setExpanded(copy);
  }

  const sx: object = {
    border: 1,
    boxShadow: 0,
    borderLeft: 3,
    ...paint(bg("surface"), text("on-surface"), border("outline-variant")),
    borderLeftColor: color("tertiary")
  };

  return <>
    <Accordion sx={sx} expanded={expanded[0]} onChange={handleExpanded(0)}>
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
          <CreationPlaceholder onClick={() => setCreatingPhone(true)}/>
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion sx={sx} expanded={expanded[1]} onChange={handleExpanded(1)}>
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
          <CreationPlaceholder onClick={() => setCreatingEmail(true)}/>
        </Box>
      </AccordionDetails>
    </Accordion>
    <Accordion sx={sx} expanded={expanded[2]} onChange={handleExpanded(2)}>
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
    if (value !== null) setAlignment(value);
  }

  const addressKeys: string[] = toKeys(props.addresses);

  return (
    <Box className="w-full p-3 border rounded-lg" sx={border("outline-variant")}>
      <Box className="w-full mb-5 flex justify-evenly">
        <Tooltip title="Delete Address">
          <IconButton sx={text("secondary")}><DeleteIcon sx={{fontSize: 27}}/></IconButton>
        </Tooltip>
        <ToggleButtonGroup 
          sx={{
            ...paint(bg("secondary-container"), text("on-secondary-container")),
            "& .MuiToggleButton-root.Mui-selected": {
              ...paint(bg("secondary"), text("on-secondary"))
            }
          }}
          value={alignment} exclusive
          onChange={handleAlignment} size="small"
        >
          {
            addressKeys.map((item, index) => <ToggleButton sx={{color: "inherit"}} key={index} value={index}>{item}</ToggleButton>)
          }
        </ToggleButtonGroup>
        <Tooltip title="Create New Address">
          <IconButton sx={text("secondary")} onClick={() => setCreating(true)}><AddBoxRoundedIcon sx={{fontSize: 27}}/></IconButton>
        </Tooltip>
      </Box>
        {
          addressKeys.map((label, i) => {
            return (
              <Box key={i} className={"flex gap-2 flex-wrap justify-center lg:justify-start "+(alignment !== i ? "hidden" : "")}>
                {
                  toKeys(props.addresses[label]).map((prop, j) => {
                    return <ContentBox key={j} label={prop} content={props.addresses[label][prop]}/>
                  })
                }
              </Box>
            )
          })
        }
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

function ContentBox(props: {label: string, content: string, deleteHandle?: () => void}) {
  const classes: string[] = [
    "w-fit", "flex", "flex-col", "gap-0", "justify-center",
    "border", "rounded-lg", "p-2", "hover:cursor-pointer"
  ]
  return (
  <Box className={classes.join(" ")}
    sx={paint(bg("secondary"), text("on-secondary"))}
  >
    <span style={{color: "inherit", opacity: 0.9}} className="text-center sm:text-start text-sm">{props.label}</span>
    <Box className="flex gap-0 flex-wrap justify-center sm:justify-normal">
      <span style={{color: "inherit"}} className="text-center h-fit my-auto">{props.content}</span>
      {
      props.deleteHandle &&
       <Tooltip title={"Delete "+props.label}>
        <IconButton sx={{color: "inherit"}} onClick={props.deleteHandle} size="small"><DeleteIcon/></IconButton> 
       </Tooltip>
      }
    </Box>
  </Box>
  )
}

function CreationPlaceholder(props: {onClick: () => void}) {
  return (
    <Box
      onClick={props.onClick}
      className="border-4 border-dotted rounded-lg hover:cursor-pointer flex flex-col justify-center p-3"
      sx={border("outline-variant")}
    >
      <AddBoxRoundedIcon fontSize="large" sx={text("secondary")}/>
    </Box>
  )
}

function PromptModal(props: {open: boolean, title: string, fieldNames?: string[], handleClose: () => void, handleSave: () => void}) {
  const textTertiary = text("tertiary");
  const borderTertiary = border("tertiary");
  const textFieldStyles: object = {
    sx: {
      "& label, label.Mui-focused": textTertiary,
      '& .MuiOutlinedInput-root': {
        '& fieldset': borderTertiary,
        '&:hover fieldset': borderTertiary,
        '&.Mui-focused fieldset': borderTertiary,
      },
    },
    inputProps: {
      sx: {
        "&::placeholder": textTertiary,
        ...textTertiary
      }
    }
  }
  return (
    <Dialog open={props.open}>
      <DialogTitle sx={paint(bg("surface"), text("on-surface"))}><Typography className="font-bold text-center">{props.title}</Typography></DialogTitle>
      <DialogContent sx={paint(bg("surface"), text("on-surface"))}>
        <Box className="flex flex-col gap-2 w-full p-1 h-full">
          <TextField {...textFieldStyles} variant="outlined" size="small" label="label" placeholder="label"/>
          {
            !props.fieldNames ? <TextField {...textFieldStyles} variant="outlined" size="small" label="value" placeholder="value"/> :
            <>
              {
                props.fieldNames.map((fieldName: string, index: number) =>
                  <TextField {...textFieldStyles}  key={index} variant="outlined" size="small" label={fieldName} placeholder="label"/>)
              }
            </>
          }
        </Box>
        <Box className="w-full flex justify-center mt-2">
          <IconButton sx={text("primary")} onClick={props.handleSave} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton sx={text("error")} onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}