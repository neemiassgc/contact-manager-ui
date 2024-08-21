"use client"
import {
  InputAdornment, Box, Pagination,
  IconButton, TextField, Divider,
} from '@mui/material';
import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DataArrayIcon from '@mui/icons-material/DataArray';
import {
  addUnseenContactName, clearLocalContacts, getAllUnseenContactNames,
  removeUnseenContactName, setSelectedContact
} from '../lib/storage';
import { Contact, Run, ShortContact, ViolationError } from "../lib/types"
import { useRouter } from "next/navigation"
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { paint, bg, border, text, textFieldTheme } from '../lib/colors';
import { convertNetworkErrorMessage, filterByName, formatPhoneValue, getPaginatedData, isNotUndefined, isUserNotFound, isViolationError } from '../lib/misc';
import { useAllContacts } from '../lib/hooks';
import { BadgedAvatar, ContactBoardLoading, CustomDivider, DefaultButton, ErrorScreen, Modal, SelectCountry } from './components';
import { createNewContact, createNewUser, deleteContact } from '../lib/net';
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import AlertContext from '../lib/AlertContext';

export default function Home() {
  const { user } = useUser();
  const { data, error, isLoading, reload } = useAllContacts();

  useEffect(() => {
    if (error) {
      if (isUserNotFound(error))
        createNewUser((user as UserProfile).name as string)
          .then(() => reload())
    }
  }, [error, user, reload]);

  return (
    <>
      <main className="mt-16 w-full p-1">
        {
          (error && isUserNotFound(error)) || isLoading ? <ContactBoardLoading/>
          : error ? <ErrorScreen label={error.message}/> :
          <ContactListBoard reloadContacts={reload} contacts={data as Contact[]}/>
        }
      </main>
    </>
  );
}

function ContactListBoard(props: { contacts: Contact[], reloadContacts: Run }) {
  const [searchText, setSearchText] = useState("");
  
  const filteredContacts: Contact[] = filterByName(props.contacts, searchText);

  const handleSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }

  return (
    <Box className="p-6 w-full sm:w-9/12 md:w-8/12 lg:w-1/2 xl:w-5/12 mx-auto border rounded-xl" sx={bg("surface-container-high")}>
      <ContactListHeader
        reloadContacts={props.reloadContacts}
        textFieldOnChange={handleSearchText}
        textFieldValue={searchText}
      />
      {
        filteredContacts.length > 0 ?
        <PageableContactList
          reloadContacts={props.reloadContacts}

          contacts={filteredContacts}
        /> :
        <>
          <CustomDivider/>
          <Box className="w-full text-center mt-3" sx={{...text("on-surface"), opacity: 0.7}}>
            <DataArrayIcon fontSize="large"/>
            <span className="text-2xl align-middle ml-2">Nothing</span>
          </Box>
        </>
      }
    </Box>
  )
}

function ContactListHeader(props: {
  textFieldValue: string,
  textFieldOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  reloadContacts: Run,
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Box className="w-full flex mb-3 justify-center flex-wrap-reverse gap-3 sm:gap-0 sm:justify-between">
        <TextField
          sx={{
            "& .MuiOutlinedInput-root": {
              '& fieldset': {border: "none"},
            },
            ...paint(bg("tertiary"), text("on-tertiary")),
            borderRadius: 2
          }}
          size="small"
          placeholder="search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={paint(text("on-tertiary"))}/>
              </InputAdornment>
            ),
          }}
          inputProps={{
            sx: {
              "&::placeholder": {
                ...paint(text("on-tertiary")),
                opacity: 1
              },
              ...paint(text("on-tertiary"))
            }
          }}
          onChange={props.textFieldOnChange}
          value={props.textFieldValue}
        />
        <DefaultButton onClick={() => setOpenModal(true)} title="Add Contact">
          <PersonAddIcon/>
        </DefaultButton>
      </Box>
      <ContactCreationModal
        reloadContacts={props.reloadContacts}
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </>
  )
}

function PageableContactList(props: { contacts: Contact[], reloadContacts: Run }) {
  const [page, setPage] = useState(1);

  const handlePagination: (event: React.ChangeEvent<unknown>, value: number) => void = (_, value) => {
    setPage(value);
  }
  
  const countPerPage: number = 6;
  const paginationCount: number = Math.floor(props.contacts.length / countPerPage);

  return (
    <>
      <ContactList
        reloadContacts={props.reloadContacts}
        data={getPaginatedData(countPerPage, page, props.contacts)}
      />
      {
        props.contacts.length > countPerPage &&
        <Box className="p-2">
          <Pagination
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": paint(bg("primary"), text("on-primary")),
              "& .MuiPaginationItem-root.Mui-selected:hover": paint(bg("primary-container"), text("on-primary-container")),
              "& .MuiPaginationItem-root:hover": paint(bg("secondary-container"), text("on-secondary-container")),
              "& .MuiPaginationItem-root": paint(text("on-surface"))
            }}
            className="w-fit mx-auto"
            count={props.contacts.length % countPerPage === 0 ? paginationCount : paginationCount + 1}
            page={page}
            onChange={handlePagination}
            size="large" />
        </Box>
      }
    </>
  )
}

function ContactList(props: { data: Contact[], reloadContacts: Run}) {
  const router = useRouter();
  const [consentModal, setConsentModal] = useState({loading: false, open: false});
  const [contactData, setContactData] = useState({ name: "", id: ""});
  const showAlert = useContext(AlertContext);

  const unseenContactNames: string[] = getAllUnseenContactNames();

  const removeContact = () => {
    setConsentModal({...consentModal, loading: true})
    deleteContact(contactData.id)
      .then(() => {
        setConsentModal({loading: false, open: false});
        clearLocalContacts();
        props.reloadContacts();
        showAlert("Contact deleted successfully!");
      })
      .catch(error => {
        showAlert(convertNetworkErrorMessage(error.message), "error");
      })
      .finally(() => setConsentModal({open: false, loading: false}));
  }

  return (
    <>
      <Box className="w-full rounded-xl border" sx={paint(bg("surface"), text("on-surface"), border("outline-variant"))}>
        {
          props.data.map((contact, index, list) => {
            return (
              <>
                <ListItem key={index} secondaryAction={
                  <IconButton onClick={() => {
                    setConsentModal({loading: false, open: true});
                    setContactData({ name: contact.name, id: contact.id });
                  }}>
                    <DeleteForeverIcon sx={text("on-surface")}/>
                  </IconButton>
                }>
                  <ListItemButton onClick={() => {
                    setSelectedContact(contact.id);
                    removeUnseenContactName(contact.name);
                    router.push("/profile")
                  }}>
                    <ListItemAvatar>
                      <BadgedAvatar
                        badged={unseenContactNames.includes(contact.name)}
                        letter={contact.name[0].toUpperCase()}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      sx={text("on-surface")}
                      primary={contact.name}
                      secondary={unseenContactNames.includes(contact.name) ? "New" : null}
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
      </Box>
      <Modal
        mini
        isLoading={consentModal.loading}
        open={consentModal.open}
        title={"Delete "+contactData.name+"?"}
        handleClose={() => setConsentModal({loading: false, open: false})}
        handleAccept={removeContact}
      />
    </>
  )
}

function ContactCreationModal(props: {
  open: boolean,
  handleClose: Run,
  reloadContacts: Run
}) {
  const [textFieldData, setTextFieldData] = useState<ShortContact & {countryCode: string}>(
    { name: "", phoneLabel: "", phoneValue: "", countryCode: "+1"}
  )
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const showAlert = useContext(AlertContext);


  const setName = (event: ChangeEvent<HTMLInputElement>) =>
    setTextFieldData({...textFieldData, name: event.target.value});
  const setPhoneLabel = (event: ChangeEvent<HTMLInputElement>) =>
    setTextFieldData({...textFieldData, phoneLabel: event.target.value});
  const setPhoneValue = (event: ChangeEvent<HTMLInputElement>) =>
    setTextFieldData({...textFieldData, phoneValue: formatPhoneValue(textFieldData.phoneValue, event.target.value)});

  const extractErrorHelperText = (fieldName: string) => {
    if (error instanceof ViolationError)
      return (JSON.parse(error.message) as ShortContact)[fieldName];
    else return "";
  }

  const addNewContact = () => {
    setError(undefined);
    setIsLoading(true);
    createNewContact({
      name: textFieldData.name,
      phoneLabel: textFieldData.phoneLabel,
      phoneValue: textFieldData.countryCode + textFieldData.phoneValue
    })
    .then(() => {
      closeAndReset();
      clearLocalContacts()
      showAlert("Successfully created!");
      addUnseenContactName(textFieldData.name);
      props.reloadContacts();
    })
    .catch(error => {
      if (isViolationError(error)) {
        setError(error);
        return;
      }
      showAlert(convertNetworkErrorMessage(error.message), "error");
      closeAndReset();
    })
    .finally(() => setIsLoading(false));
  }

  const closeAndReset = () => {
    props.handleClose();
    setError(undefined);
    setIsLoading(false);
    setTextFieldData({
      name: "",
      phoneLabel: "",
      phoneValue: "",
      countryCode: "+1",
    });
  };

  return (
    <Modal title="Create new contact" open={props.open} isLoading={isLoading} handleAccept={addNewContact} handleClose={closeAndReset}>
      <Box className="w-full flex gap-2 mb-1">
        <TextField
          disabled={isLoading}
          value={textFieldData.name}
          onChange={setName}
          error={isNotUndefined(error) && extractErrorHelperText("name").length > 0}
          helperText={extractErrorHelperText("name")[0]}
          {...textFieldTheme}
          className="w-full"
          label="contact name"
          placeholder="contact name"
          size="small"
          variant="outlined"
        />
        <TextField
          disabled={isLoading}
          value={textFieldData.phoneLabel}
          onChange={setPhoneLabel}
          error={isNotUndefined(error) && extractErrorHelperText("phoneLabel").length > 0}
          helperText={extractErrorHelperText("phoneLabel")[0]}
          {...textFieldTheme}
          label="phone label"
          placeholder="phone label"
          size="small"
          variant="outlined"
        />
      </Box>
      <Box className="w-full pt-1 flex gap-2">
        <SelectCountry
          className="basis-24"
          value={textFieldData.countryCode}
          onChange={value => setTextFieldData({...textFieldData, countryCode: value})}
          styles={textFieldTheme}
        />
        <TextField
          disabled={isLoading}
          onChange={setPhoneValue}
          value={textFieldData.phoneValue}
          error={isNotUndefined(error) && extractErrorHelperText("phoneValue").length > 0}
          helperText={extractErrorHelperText("phoneValue")[0]}
          {...textFieldTheme}
          className="flex-1"
          label="phone"
          placeholder="phone"
          size="small"
          variant="outlined"
        />
      </Box>
    </Modal>
  )
}