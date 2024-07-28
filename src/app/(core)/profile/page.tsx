"use client"

import {
  Avatar, Box, TextField, Tooltip, IconButton,
  Breadcrumbs, Typography, DialogContent, DialogTitle, Dialog,
  ListSubheader, List, ListItem, ListItemButton, ListItemAvatar,
  ListItemText, Divider, DialogActions
} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DomainIcon from '@mui/icons-material/Domain';
import ClearIcon from '@mui/icons-material/Clear';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { formatAddress, locateCountryFlag, toKeys } from "../../lib/misc";
import { Contact, AddressType, Run, StringType } from "../../lib/types";
import { useState } from "react";
import { getSelectedContact } from "../../lib/storage";
import { bg, text, paint, border } from "../../lib/colors";
import Link from "next/link";
import { SplitButton } from "../components";

export default function Page() {
  const selectedContact: Contact = getSelectedContact() as Contact;

  return (
    <Box className="w-full sm:w-9/12 md:w-10/12 xl:w-8/12 mx-auto mt-10 mb-5">
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

  return (
    <Box className="w-full flex flex-col justify-center items-center">
      <Avatar
        sx={{
          width: 100, height: 100, fontSize: 50,
          ...paint(bg("primary"), text("on-primary"))
        }}
        src="/flag.svg"
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
        handleAccept={()=>{}}
      />
    </Box>
  )
}

function Body(props: { contact: Contact }) {
  const [modal, setModal] = useState({ phoneModal: false, emailModal: false, addressModal: false })

  const openModal: (prop: string) => Run = prop =>
    () => setModal({ ...modal, ...{ [prop]: true } })

  const closeModal: (prop: string) => Run = prop =>
    () => setModal({ ...modal, ...{ [prop]: false } })

  return (
    <Box className="w-full mt-5">
      <SplitButton
        options={[
          {
            title: "Add new phone number",
            onClick: openModal("phoneModal")
          },
          {
            title: "Add new email",
            onClick: openModal("emailModal")
          },
          {
            title: "Add new address",
            onClick: openModal("addressModal")
          }
        ]}
      />
      <Box className="w-full flex flex-col md:flex-row justify-center gap-10 md:gap-5 lg:gap-10 xl:gap-20">
        <Box className="flex-1">
          <ListCard
            titleIcon={<PhoneIcon className="mr-2"/>}
            cardTitle="Phone Numbers"
            content={props.contact.phoneNumbers}
          />
          <PromptModal
            open={modal.phoneModal}
            title={"Create New Phone Number"}
            handleAccept={() => {}}
            handleClose={closeModal("phoneModal")}
          />
        </Box>
        <Box className="flex-1 rounded-xl border">
          <ListCard
            titleIcon={<AlternateEmailIcon className="mr-2"/>}
            cardTitle="Emails"
            content={props.contact.emails}
          />
          <PromptModal
            open={modal.emailModal}
            title={"Create New Email"}
            handleAccept={() => {}}
            handleClose={closeModal("emailModal")}
          />
        </Box>
      </Box>
      <Box className="w-full md:w-5/6 mx-auto mt-10 rounded-xl border">
        <ListCard
          titleIcon={<DomainIcon className="mr-2"/>}
          cardTitle="Addresses"
          content={props.contact.addresses}
        />
        <AddressPromptModal
          open={modal.addressModal}
          title={"Create New Address"}
          handleAccept={() => {}}
          handleClose={closeModal("addressModal")}
        />
      </Box>
    </Box>
  )
}

function ListCard(props: {
  titleIcon: React.ReactElement,
  cardTitle: string,
  content: StringType | AddressType
}) {
  return (
    <Box className="w-full p-9 rounded-2xl" sx={paint(bg("surface-container-high"))}>
      <List
        className="rounded-b-xl border-b-2"
        sx={paint(bg("surface"), text("on-surface"), bg("surface-container-high"))}
        subheader={
        <ListSubheader
          component="div" className="rounded-t-xl text-center"
          sx={paint(bg("secondary"), text("on-secondary"))}>
          <Box className="flex-shrink mr-2">
            {props.titleIcon}
            <span>{props.cardTitle}</span>
          </Box>
        </ListSubheader>
      }>
        {
          toKeys(props.content).map((key, index, list) => {
            return (
              <>
                <ListItem disableGutters
                  className="border-x-2"
                  sx={bg("surface")}
                  key={key}
                  secondaryAction={
                    <IconButton>
                      <ClearIcon sx={text("on-surface")}/>
                    </IconButton>
                  }
                >
                  <ListItemButton>
                    {
                      typeof props.content[key] === "object" &&
                      <ListItemAvatar>
                        <Avatar src={locateCountryFlag(props.content[key].country)}>
                          {props.content[key].country[0]}
                        </Avatar>
                      </ListItemAvatar>
                    }
                    <ListItemText
                      primary={
                        typeof props.content[key] === "object" ? formatAddress(props.content[key]) : props.content[key]
                      }
                      secondary={key}
                    />
                  </ListItemButton>
                </ListItem>
                {
                  index !== list.length - 1 && <Divider variant="middle"/> 
                }
              </>
            )
          })
        }
      </List>
    </Box>
  )
}

type PromptModalType = { open: boolean, title: string, handleClose: Run, handleAccept: Run }

function AddressPromptModal(props: PromptModalType) {
  return <PromptModal {...props} fieldNames={["street", "country", "city", "state", "zipcode"]} />
}

function PromptModal(props: PromptModalType & { fieldNames?: string[] }) {
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
      <DialogTitle sx={paint(bg("surface-container-high"), text("on-surface"))}><Typography className="text-center">{props.title}</Typography></DialogTitle>
      <Divider variant="middle" sx={bg("outline-variant")}/>
      <DialogContent sx={paint(bg("surface-container-low"), text("on-surface"))}>
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
      </DialogContent>
      <Divider variant="middle" sx={bg("outline-variant")}/>
      <DialogActions sx={paint(bg("surface-container-low"), text("on-surface"))}>
        <Box className="w-full flex justify-center mt-2">
          <IconButton sx={text("primary")} onClick={props.handleAccept} size="small"><CheckCircleIcon fontSize="large"/></IconButton>
          <IconButton sx={text("error")} onClick={props.handleClose} size="small"><HighlightOffIcon fontSize="large"/></IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}