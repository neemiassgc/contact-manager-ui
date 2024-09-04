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
import { getSelectedContact, setSelectedContact } from "../../lib/storage";
import { bg, text, paint, textFieldTheme } from "../../lib/colors";
import { CustomDivider, Footer, Loading, Modal, SelectCountry, SplitButton } from "../components";
import { patcher } from "@/app/lib/net";
import { useContactModifier, useSelectedContact } from "@/app/lib/hooks";
import AlertContext from "@/app/lib/AlertContext";

export default function Page() {
  const { contact: selectedContact, reload } = useSelectedContact();

  if (!selectedContact) return <Loading/>

  return (
    <>
      <Box className="w-full sm:w-9/12 md:w-10/12 xl:w-8/12 mx-auto mt-10 mb-5">
        <Breadcrumbs sx={paint(text("on-surface"))}>
          <Link href="/">Home</Link>
          <Typography>Profile</Typography>
        </Breadcrumbs>
        <Header contact={selectedContact} reload={reload}/>
        <Body contact={selectedContact} reload={reload}/>
      </Box>
      <Footer/>
    </>
  )
}

function Header(props: {contact: Contact, reload: (contact: Contact) => void}) {
  const [open, setOpen] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showAlert = useContext(AlertContext);

  const updateContactName = () => {
    setIsLoading(true);
    patcher(props.contact.id, { name: textFieldValue})
      .then(updatedContact => {
        showAlert("Contact name was updated successfully!");
        props.reload(updatedContact);
      })
      .catch(reason => showAlert(convertNetworkErrorMessage(reason.message), "error"))
      .finally(() => {
        setOpen(false)
        setTextFieldValue("");
      })
  }

  return (
    <Box className="w-full flex flex-col justify-center items-center">
      <Avatar
        sx={{
          width: 100, height: 100, fontSize: 50,
          ...paint(bg("primary"), text("on-primary"))
        }}
        src="/flag.svg"
      >{props.contact.name[0]}</Avatar>
      <Box className="ml-5 mt-1">
        <span style={paint(text("on-surface"))}>{props.contact.name}</span>
        <Tooltip title="Edit Contact Name" arrow>
          <IconButton onClick={() => {
            setOpen(true);
            setIsLoading(false);
          }}>
            <EditNoteRoundedIcon sx={paint(text("on-surface"))} fontSize="medium"/>
          </IconButton>
        </Tooltip>
      </Box>
      <Modal
        isLoading={isLoading}
        open={open}
        title="Edit the name of the contact"
        handleClose={() => setOpen(false)}
        handleAccept={updateContactName}
      >
         <TextField
          {...textFieldTheme}
          value={textFieldValue}
          disabled={isLoading}
          onChange={event => setTextFieldValue(event.target.value)}
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
          {
            modal.phoneModal &&
            <PhoneNumberPromptModal
              contact={props.contact}
              reload={props.reload}
              open={true}
              onClose={closeModal("phoneModal")}
            />
          }
        </Box>
        <Box className="flex-1 rounded-xl border">
          <ListCard
            titleIcon={<AlternateEmailIcon className="mr-2"/>}
            cardTitle="Emails"
            content={props.contact.emails}
            reload={props.reload}
          />
          {
            modal.emailModal &&
            <EmailPromptModal
              contact={props.contact}
              reload={props.reload}
              open={true}
              onClose={closeModal("emailModal")}
            />
          }
        </Box>
      </Box>
      <Box className="w-full md:w-5/6 mx-auto mt-10 rounded-xl border">
        <ListCard
          titleIcon={<DomainIcon className="mr-2"/>}
          cardTitle="Addresses"
          content={props.contact.addresses}
          reload={props.reload}
        />
        {
          modal.addressModal &&
          <AddressPromptModal
            reload={props.reload}
            contact={props.contact}
            open={true}
            onClose={closeModal("addressModal")}
          />
        }
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
  const [selectedItem, setSelectedItem] = useState("");
  const {isLoading, modify, stopLoading} = useContactModifier(props.reload, () => setOpen(false));

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
                      props.cardTitle === "Phone Numbers" && list.length === 1 ? null :
                      <IconButton onClick={() => {
                        setOpen(true);
                        stopLoading();
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
        isLoading={isLoading}
        open={open}
        title={"Delete '"+selectedItem+"'?"}
        handleClose={() => setOpen(false)}
        handleAccept={
          modify((getSelectedContact() as Contact).id, {
            [toCamelCase(props.cardTitle)]: removeProperty(props.content, selectedItem)
          }, `'${selectedItem}' was successfully deleted!`)
        }
      />
    </>
  )
}

function AddressPromptModal(props: {open: boolean, onClose: Run, contact: Contact, reload: (newContact: Contact) => void}) {
  const [fields, setFields] = useState<StringType>({
    label: "", street: "", country: "", city: "", state: "", zipcode: ""
  })
  const {isLoading, modify} = useContactModifier(props.reload, props.onClose);

  return (
    <Modal
      title="Create New Address"
      isLoading={isLoading}
      open={props.open}
      handleClose={props.onClose}
      handleAccept={
        modify(props.contact.id, {
          addresses: {
            ...props.contact.addresses,
            [fields.label]: {...fields, label: undefined}
          }
        }, "Address added successfully!")
      }
    >
      <Box className="flex flex-col gap-3 w-full p-1 h-full">
        <TextField
          {...textFieldTheme} 
          disabled={isLoading}
          variant="outlined"
          size="small"
          label={"Label"}
          placeholder={"Label"}
          value={fields["Label"]}
          onChange={event => setFields({...fields, "label": event.target.value})}
        />
        <CustomDivider variant="fullWidth"/>
        {
          fields.country === "" ?
          <SelectCountry
            variant="name"
            value={fields.country}
            className="basis-24"
            onChange={value => setFields({...fields, country: value})}
            styles={textFieldTheme}
          /> : fields.country === "Brazil" ?
          <BrazilAddressForm fields={fields} setFields={setFields} isLoading={isLoading}/> :
          <DefaultAddressForm fields={fields} setFields={setFields} isLoading={isLoading}/>
        }
      </Box>
    </Modal>
  )
}

function BrazilAddressForm(props: { fields: StringType, setFields: (fields: StringType) => void, isLoading: boolean}) {
  const [township, setTownship] = useState<StringType>({ cidade: "", bairro: ""});

  const fieldNames: StringType = {
    "País": "country", "CEP": "zipcode", "Endereço": "street",
    "Estado": "state", "Cidade": "city", "Bairro": "city"
  };
  return toKeys(fieldNames).map((fieldName, index) =>
    <TextField
      {...textFieldTheme} 
      disabled={fieldName === "País"}
      key={index}
      variant="outlined"
      size="small"
      label={fieldName}
      placeholder={fieldName}
      value={["Cidade", "Bairro"].includes(fieldName) ? township[fieldName.toLowerCase()] : props.fields[fieldNames[fieldName]]}
      onChange={event => {
        if (["Cidade", "Bairro"].includes(fieldName)) {
          setTownship({...township, [fieldName.toLowerCase()]: event.target.value});
          props.setFields({...props.fields, "city": `${township.cidade}; ${township.bairro}`})
          return;
        }
        props.setFields({...props.fields, [fieldNames[fieldName]]: event.target.value})
      }}
    />)
}

function DefaultAddressForm(props: { fields: StringType, setFields: (fields: StringType) => void, isLoading: boolean}) {
  const fieldNames: string[] = [ "Country", "Street", "City", "State", "Zipcode"];

  return fieldNames.map((fieldName: string, index: number) =>
    <TextField
      {...textFieldTheme} 
      disabled={props.isLoading || fieldName === "Country"}
      key={index}
      variant="outlined"
      size="small"
      label={fieldName}
      placeholder={fieldName}
      value={props.fields[fieldName.toLowerCase()]}
      onChange={event => props.setFields({...props.fields, [fieldName]: event.target.value})}
    />)
}

function PhoneNumberPromptModal(props: {open: boolean, onClose: Run, contact: Contact, reload: (newContact: Contact) => void}) {
  const [fields, setFields] = useState(
    { phoneLabel: "", phoneValue: "", countryCode: "" }
  )
  const {isLoading, modify} = useContactModifier(props.reload, props.onClose);

  return (
    <Modal title="Create New Phone Number"
      isLoading={isLoading}
      open={props.open}
      handleClose={props.onClose}
      handleAccept={
        modify(props.contact.id, {
          phoneNumbers: {
            ...props.contact.phoneNumbers,
            [fields.phoneLabel]: fields.countryCode + fields.phoneValue
          }
        }, "Phone number added successfully!")
      }
    >
      <Box className="flex gap-2 mb-1 flex-wrap">
        <TextField
          {...textFieldTheme}
          value={fields.phoneLabel}
          onChange={event => setFields({...fields, phoneLabel: event.target.value})}
          label="phone label"
          placeholder="phone label"
          size="small"
          variant="outlined"
          className="basis-full sm:basis-3/12 flex-auto"
          disabled={isLoading}
        />
        <SelectCountry
          disabled={isLoading}
          value={fields.countryCode}
          className="basis-24"
          onChange={value => setFields({...fields, countryCode: value})}
          styles={textFieldTheme}
        />
        <TextField
          {...textFieldTheme}
          value={fields.phoneValue}
          onChange={event => setFields({...fields, phoneValue: event.target.value})}
          className="basis-1/2 flex-grow"
          label="phone"
          placeholder="phone"
          size="small"
          variant="outlined"
          disabled={isLoading}
        />
      </Box>
    </Modal>
  )
}

function EmailPromptModal(props: {open: boolean, onClose: Run, contact: Contact, reload: (newContact: Contact) => void}) {
  const [email, setEmail] = useState<StringType>({label: "", value: ""});
  const {isLoading, modify} = useContactModifier(props.reload, props.onClose);

  const fieldNames: string[] = ["label", "value"];
  return (
    <Modal
      handleAccept={
        modify(props.contact.id, {
          emails: {
            ...props.contact.emails,
            [email.label]: email.value
          }
        }, "Email added successfully!")
      }
      handleClose={props.onClose}
      title="Create New Email"
      open={props.open}
      isLoading={isLoading}>
      <Box className="flex flex-col gap-2 w-full p-1 h-full">
        {
          fieldNames.map((field, key) => 
            <TextField
              {...textFieldTheme}
              disabled={isLoading}
              key={key}
              variant="outlined"
              size="small"
              label={field}
              placeholder={field}
              value={email[field]}
              onChange={event => setEmail({...email, [field]: event.target.value})}
            />
          )
        }
      </Box>
    </Modal>
  )
}