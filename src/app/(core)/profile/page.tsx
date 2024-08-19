"use client"

import {
  Avatar, Box, TextField, Tooltip, IconButton,
  Breadcrumbs, Typography, ListSubheader, List, ListItem,
  ListItemButton, ListItemAvatar, ListItemText, Divider
} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DomainIcon from '@mui/icons-material/Domain';
import ClearIcon from '@mui/icons-material/Clear';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import Link from "next/link";
import { convertNetworkErrorMessage, formatAddress, locateCountryFlag, removeProperty, toCamelCase, toKeys } from "../../lib/misc";
import { Contact, AddressType, Run, StringType, ModalType } from "../../lib/types";
import { useContext, useState } from "react";
import { getSelectedContact } from "../../lib/storage";
import { bg, text, paint, textFieldTheme } from "../../lib/colors";
import { Modal, SelectCountry, SplitButton } from "../components";
import { patcher } from "@/app/lib/net";
import { useSelectedContact } from "@/app/lib/hooks";
import AlertContext from "@/app/lib/AlertContext";

export default function Page() {
  const { contact: selectedContact, reload } = useSelectedContact();

  return (
    <Box className="w-full sm:w-9/12 md:w-10/12 xl:w-8/12 mx-auto mt-10 mb-5">
      <Breadcrumbs sx={paint(text("on-surface"))}>
        <Link href="/">Home</Link>
        <Typography>Profile</Typography>
      </Breadcrumbs>
      {
        !selectedContact ? "Waiting...." :
        <>
          <Header contactName={selectedContact.name}/>
          <Body contact={selectedContact} reload={reload}/>
        </> 
      }
    </Box>
  )
}

function Header(props: {contactName?: string}) {
  const [editing, setEditing] = useState(false);

  return (
    <Box className="w-full flex flex-col justify-center items-center">
      <Avatar
        sx={{
          width: 100, height: 100, fontSize: 50,
          ...paint(bg("primary"), text("on-primary"))
        }}
        src="/flag.svg"
      >{props?.contactName ? props.contactName[0] : ""}</Avatar>
      <Box className="ml-5 mt-1">
        <span style={paint(text("on-surface"))}>{props?.contactName}</span>
        <Tooltip title="Edit Contact Name" arrow>
          <IconButton onClick={() => setEditing(true)}>
            <EditNoteRoundedIcon sx={paint(text("on-surface"))} fontSize="medium"/>
          </IconButton>
        </Tooltip>
      </Box>
      <Modal
        isLoading={false}
        open={editing}
        title="Edit the name of the contact"
        handleClose={() => setEditing(false)}
        handleAccept={()=>{}}
      >
         <TextField
          {...textFieldTheme}
          className="w-full"
          label="New name"
          placeholder="New name"
          size="small"
          variant="outlined"
        />
      </Modal>
    </Box>
  )
}

function Body(props: { contact: Contact, reload: (newContact: Contact) => void }) {
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
            reload={props.reload}
          />
          <PhoneNumberPromptModal
            isLoading={false}
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
            reload={props.reload}
          />
          <EmailPromptModal
            isLoading={false}
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
          reload={props.reload}
        />
        <AddressPromptModal
          isLoading={false}
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
  content: StringType | AddressType,
  reload: (newContact: Contact) => void
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const showAlert = useContext(AlertContext);

  const deleteItem = () => {
    setLoading(true);
    patcher(
      (getSelectedContact() as Contact).id,
      {
        [toCamelCase(props.cardTitle)]: removeProperty(props.content, selectedItem)
      }
    )
    .then(contact => {
      showAlert(`'${selectedItem}' was successfully deleted!`);
      props.reload(contact)
    })
    .catch(reason => showAlert(convertNetworkErrorMessage(reason.message), "error"))
    .finally(() => setOpen(false))
  }

  return (
    <>
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
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => {
                        setOpen(true);
                        setLoading(false);
                        setSelectedItem(key);
                      }}>
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
                    index !== list.length - 1 && <Divider key={index} variant="middle"/> 
                  }
                </>
              )
            })
          }
        </List>
      </Box>
      <Modal
        mini
        isLoading={loading}
        open={open}
        title={"Delete '"+selectedItem+"'?"}
        handleClose={() => setOpen(false)}
        handleAccept={deleteItem}
      />
    </>
  )
}

function AddressPromptModal(props: ModalType) {
  const fieldNames: string[] = ["street", "country", "city", "state", "zipcode"];
  return (
    <Modal {...props}>
      <Box className="flex flex-col gap-2 w-full p-1 h-full">
        <>
          {
            fieldNames.map((fieldName: string, index: number) =>
              <TextField {...textFieldTheme}  key={index} variant="outlined" size="small" label={fieldName} placeholder={fieldName}/>)
          }
        </>
      </Box>
    </Modal>
  )
}

function PhoneNumberPromptModal(props: ModalType) {
  return (
    <Modal {...props}>
      <Box className="flex gap-2 mb-1 flex-wrap">
        <TextField
          {...textFieldTheme}
          label="phone label"
          placeholder="phone label"
          size="small"
          variant="outlined"
          className="basis-full sm:basis-3/12 flex-auto"
        />
        <SelectCountry
          className="basis-24"
          onChange={() => {}}
          styles={textFieldTheme}
        />
        <TextField
          {...textFieldTheme}
          className="basis-1/2 flex-grow"
          label="phone"
          placeholder="phone"
          size="small"
          variant="outlined"
        />
      </Box>
    </Modal>
  )
}

function EmailPromptModal(props: ModalType) {

  const fieldNames: string[] = ["label", "value"];
  
  return (
    <Modal {...props}>
      <Box className="flex flex-col gap-2 w-full p-1 h-full">
        {
          fieldNames.map((value, key) => 
            <TextField key={key} {...textFieldTheme} variant="outlined" size="small" label={value} placeholder={value}/>
          )
        }
      </Box>
    </Modal>
  )
}