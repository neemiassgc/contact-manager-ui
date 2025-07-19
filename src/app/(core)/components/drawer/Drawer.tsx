"use client";

import React, { useContext, useState } from "react";
import { DrawerLayout } from "@/subframe/layouts/DrawerLayout";
import { IconButton } from "@/subframe/components/IconButton";
import { Button } from "@/subframe/components/Button";
import { AddressField, StringField, Contact, Base, MappedContact, DrawerType } from "../types";
import AddButton from "./AddButton";
import ContactAddressForm from "./ContactAddressForm";
import SimpleContactForm from "./SimpleContactForm";
import ContactNameForm from "./ContactFormName";
import NotificationContext from "../NotificationContext";
import { IconName } from "@subframe/core";
import { useAIFetch } from "../../hooks";

export default function Drawer({initialize = {
  name: {value: ""},
  phoneNumbers: [{ marker: { value: ""}, field: { value: "" }}],
  emails: [],
  addresses: []
},
...props
}: {
  close: () => void,
  mainActionButton: {
    title: DrawerType,
    iconName: IconName,
    httpMethod: "post" | "put",
    url: string,
    onSuccess: () => void
  },
  initialize?: MappedContact 
}) {
  const [contactName, setContactName] = useState<Base>(initialize.name);
  const [phones, setPhones] = useState<StringField[]>(initialize.phoneNumbers);
  const [emails, setEmails] = useState<StringField[]>(initialize.emails);
  const [addresses, setAddresses] = useState<AddressField[]>(initialize.addresses);
  const [loading, setLoading] = useState(false);

  const { loading: AILoading, error: AIError, fetch: AIFetch} = useAIFetch(
    data => {
      setContactName({value: data.name});
      setPhones(data.phoneNumbers.map((it: any) => {
        return {
          marker: {
            value: it.marker,
          },
          field: {
            value: "+"+it.value
          }
        }
      }))
      setEmails(data.emails.map((it: any) => {
        return {
          marker: {
            value: it.marker,
          },
          field: {
            value: it.value
          }
        }
      }))
      setAddresses(data.addresses.map((it: any) => {
        return {
          marker: {
            value: it.marker,
          },
          field: {
            value: {
              street: it.street,
              zipcode: it.zipcode,
              country: it.country,
              state: it.state,
              city: it.city,
            }
          }
        }
      }));
    }
  );

  const showNotification = useContext(NotificationContext);

  const pushField = (array: StringField[]) => [
    ...array,
    {
      marker: {
        value: ""
      },
      field: {
        value: ""
      }
    }
  ]

  function pushAddressField(array: AddressField[]): AddressField[] {
    return [
      ...array,
      {
        marker: {
          value: ""
        },
        field: {
          value: {
            street: "",
            zipcode: "",
            country: "",
            state: "",
            city: "",
            address: ""
          }
        }
      }
    ]
  }

  function treatFieldErrors(fieldErrors: {fieldViolations: {[prop: string]: string[]}}): void {
    const phonesCopy = fullStringFieldCopy(phones);
    const emailsCopy = fullStringFieldCopy(emails);
    const addressesCopy = fullAddressFieldCopy(addresses);
    const contactNameCopy = {...contactName};

    
    for (const key of Object.keys(fieldErrors.fieldViolations)) {
      if (key === "name") {
        contactNameCopy.error = fieldErrors.fieldViolations[key][0];
        continue;
      }

      const parts = key.split("[");
      const field = parts[0];

      if (field === "phoneNumbers") {
        const marker = parts[1].slice(0, -1);
        for (let i = 0; i < phones.length; i++) {
          if (phones[i].marker.value === marker) {
            phonesCopy[i].field.error = fieldErrors.fieldViolations[key][0];
            continue;
          }
        }
      }

      if (field === "emails") {
        const marker = parts[1].slice(0, -1);
        for (let i = 0; i < emails.length; i++) {
          if (emails[i].marker.value === marker) {
            emailsCopy[i].field.error = fieldErrors.fieldViolations[key][0];
            continue;
          }
        }
      }

      if (field === "addresses") {
        const dividedLine = parts[1].split(".");
        const addressField = dividedLine[1];
        const marker = dividedLine[0].slice(0, -1);
        for (let i = 0; i < addresses.length; i++) {
          if (addresses[i].marker.value === marker) {
            addressesCopy[i].field.error = {
              ...addressesCopy[i].field.error,
              [addressField]: fieldErrors.fieldViolations[key][0]
            }
          }
        }
      }
    }

    setPhones(phonesCopy);
    setEmails(emailsCopy);
    setContactName(contactNameCopy);
    setAddresses(addressesCopy);
  }

  return (
    <DrawerLayout className="z-10" open={true} onOpenChange={() => {}}>
      <div className="flex h-screen w-144 flex-col items-start gap-2 p-3 overflow-auto">
        <div className="flex w-full items-center justify-between px-4 pt-4 pb-1">
          <span className="text-heading-2 font-heading-2 text-default-font">
            {props.mainActionButton.title === "Create" ? "New Contact" : "Edit Contact: "+contactName.value}
          </span>
          <AIButton loading={AILoading} onClick={AIFetch} visible={props.mainActionButton.title === "Create"}/>
          <IconButton
            variant="destructive-primary"
            icon="FeatherX"
            onClick={props.close}
          />
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center bg-neutral-border" />
        <div className="flex w-full flex-col items-center justify-center gap-6 px-4 py-4">
          <ContactNameForm
            title="Contact name"
            disabled={loading || AILoading}
            value={contactName.value}
            error={contactName.error}
            onChange={setContactName}
          />
          <SimpleContactForm
            disabled={loading || AILoading}
            objects={phones}
            setObjects={setPhones}
            onAddButtonClick={() => setPhones(pushField(phones))}
            onRemoveButtonClick={() => setPhones(phones.slice(0, phones.length - 1))}
            variant="phone"
          />
          {
            emails.length === 0 ?
            <AddButton
              disabled={loading || AILoading}
              title={"Add Email"}
              iconRight="FeatherAtSign"
              variant="neutral-secondary"
              onClick={() => setEmails(pushField(emails))}
            /> :
            <SimpleContactForm
              disabled={loading || AILoading}
              objects={emails}
              setObjects={setEmails}
              onAddButtonClick={() => setEmails(pushField(emails))}
              onRemoveButtonClick={() => setEmails(emails.slice(0, emails.length - 1))}
              variant="email"
            />
          }
          {
             addresses.length === 0 ?
             <AddButton
              disabled={loading || AILoading}
               title={"Add Address"}
               iconRight="FeatherMapPin"
               variant="neutral-secondary"
               onClick={() => setAddresses(pushAddressField(addresses))}
             /> :
            <ContactAddressForm
              disabled={loading || AILoading}
              addresses={addresses}
              setAddresses={setAddresses}
              onAddButtonClick={() => setAddresses(pushAddressField(addresses))}
              onRemoveButtonClick={() => setAddresses(addresses.slice(0, addresses.length - 1))}
            />
          }
          <Button
            loading={loading}
            disabled={loading || AILoading}
            size="large"
            icon={props.mainActionButton.iconName}
            onClick={async () => {
              setLoading(true);

              const validatedPhoneMarkers = validateMarkers(phones);
              const validatedEmailMarkers = validateMarkers(emails);
              const validatedAddressMarkers = validateMarkers(addresses);
              
              if (concat(validatedPhoneMarkers, validatedEmailMarkers, validatedAddressMarkers)
                  .some(it => it.marker.error && it.marker.error.length > 0)
              ) {
                setPhones(validatedPhoneMarkers as StringField[]);
                setEmails(validatedEmailMarkers as StringField[]);
                setAddresses(validatedAddressMarkers as AddressField[]);
                setLoading(false);
                return;
              }

              try {
                const request = await fetch(props.mainActionButton.url, {
                  method: props.mainActionButton.httpMethod,
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(buildContactJson(contactName.value, phones, emails, addresses))
                });

                if (!request.ok) {
                    if (isJsonContent(request.headers)) {
                      const response = await request.json();
                      if (isFieldViolationError(response)) {
                        const fieldErrors: {fieldViolations: {[prop: string]: string[]}} = response;
                        treatFieldErrors(fieldErrors);
                        return
                      }
                    }
                    showNotification(await request.text(), "error");
                  }   
                if (request.ok) {
                  props.close();
                  showNotification("Contact created successfully", "success");
                  props.mainActionButton.onSuccess();
                }
              }
              catch(error) {
                showNotification(error+"", "error");
              }
              finally {
                setLoading(false);
              }
            }}
          >
            {props.mainActionButton.title}
          </Button>
        </div>
      </div>
    </DrawerLayout>
  );
}

function buildContactJson(
  contactName: string,
  phones: StringField[],
  emails: StringField[],
  addresses: AddressField[]
): Contact {
  return {
    name: contactName,
    phoneNumbers: phones.reduce((prev, curr) => ({
      ...prev,
      [curr.marker.value]: curr.field.value }), {}),
    emails: emails.reduce((prev, curr) => ({
      ...prev,
      [curr.marker.value]: curr.field.value }), {}),
    addresses: addresses.reduce((prev, curr) => ({
      ...prev,
      [curr.marker.value]: {
        street: curr.field.value.street,
        zipcode: curr.field.value.zipcode,
        country: curr.field.value.country,
        state: curr.field.value.state,
        city: curr.field.value.city
      }
    }), {})
  }
}

function validateMarkers(fields: StringField[] | AddressField[]) {
  return fields.map(it => {
    let error: string = "";
    if (it.marker.value.length === 0) error = "marker cannot be empty";
    if (it.marker.value.length <= 3) error = "marker is too short";
    if (it.marker.value.length > 25) error = "marker is too long";
    return {
      field: { ...it.field },
      marker: {
        ...it.marker,
        error
      }
    }
  })
}

function concat<T>(...arrays: T[][]): T[] {
  return arrays.reduce((prev, curr) => [...prev, ...curr], [])
}

function isJsonContent(headers: Headers): boolean {
  return headers.has("content-type") &&
  (headers.get("content-type") as string).includes("application/json");
}

function isFieldViolationError(jsonObject: any): boolean {
  return "fieldViolations" in jsonObject;
}

function fullStringFieldCopy(array: StringField[]): StringField[] {
  return array.map(it => ({
    marker: {
      ...it.marker
    },
    field: {
      ...it.field
    }
  }))
}

function fullAddressFieldCopy(array: AddressField[]): AddressField[] {
  return array.map(it => ({
    marker: {
      ...it.marker
    },
    field: {
      ...it.field,
      value: {
        ...it.field.value
      }
    }
  }))
}

function AIButton(props: { loading: boolean, onClick: () => void, visible: boolean }) {
  const [disabled, setDisabled] = useState(false);

  if (!props.visible) return null;
  return <Button
    variant="brand-secondary"
    icon="FeatherSparkles"
    loading={props.loading}
    disabled={props.loading || disabled}
    onClick={() => {
      setDisabled(true);
      props.onClick();
    }}
  >
    Generate with AI
  </Button>
}