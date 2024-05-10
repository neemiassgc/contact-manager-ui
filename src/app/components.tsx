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
  Tooltip,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { Contact, Address, AddressType } from "./net";
import { useState } from "react";

export function ContactView({open, contact, handleClose}: {open: boolean, contact: Contact, handleClose: () => void}) {
  return (
    <Dialog open={open} fullWidth={true} maxWidth="md">
      <DialogTitle>
        <Box className="w-full flex flex-col justify-center items-center">
          <Avatar className="w-20 h-20 text-5xl">{contact.name[0]}</Avatar>
          <Box>
            <span>{contact.name}</span>
            <Tooltip title="Edit Contact Name" arrow>
              <IconButton>
                <EditNoteRoundedIcon fontSize="medium"/>
              </IconButton>
            </Tooltip>
          </Box>
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
        <Box className="w-full justify-start flex gap-2 flex-wrap">
         {
            toKeys(contact.phoneNumbers).map((prop, index) => {
                return <ContentBox key={index} label={prop} content={contact.phoneNumbers[prop]} deleteHandle={() => null}/>
            })
          }
          <CreationPlaceholder label="Add new phone"/>
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
          <CreationPlaceholder label="Add new email"/>
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
            <IconButton><AddBoxRoundedIcon className="text-2xl"/></IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box className="flex gap-2 flex-wrap justify-start">
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

function CreationPlaceholder(props: {label: string}) {
  return <Box className="p-5 border-4 border-dotted rounded-lg hover:cursor-pointer">
      <AddBoxRoundedIcon className="mr-2 text-gray-400"/>
      <span className="text-gray-600">{props.label.toLocaleLowerCase()}</span>
  </Box>
}

function toKeys(input: object): string[] {
  const keys: string[] = [];
  for (const key in input) keys.push(key);
  return keys;
}