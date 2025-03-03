"use client";

import React, { useState } from "react";
import { DrawerLayout } from "@/subframe/layouts/DrawerLayout";
import { IconButton } from "@/subframe/components/IconButton";
import { Button } from "@/subframe/components/Button";
import { AddressField, StringField, Contact, Variant, Props } from "./types";
import AddButton from "./AddButton";
import ContactAddressForm from "./ContactAddressForm";
import SimpleContactForm from "./SimpleContactForm";
import ContactNameForm from "./ContactFormName";

export default function Comp(props: {
  close: () => void,
  showAlert: (title: string, variant: Variant) => void
}) {
  const [contactName, setContactName] = useState<Props>({value: ""});
  const [phones, setPhones] = useState<StringField[]>([{ marker: { value: ""}, field: { value: "" }}]);
  const [emails, setEmails] = useState<StringField[]>([]);
  const [addresses, setAddresses] = useState<AddressField[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <DrawerLayout open={true} onOpenChange={() => {}}>
      <div className="flex h-screen w-144 flex-col items-start gap-2 p-3 overflow-auto">
        <div className="flex w-full items-center justify-between px-4 pt-4 pb-1">
          <span className="text-heading-2 font-heading-2 text-default-font">
            Create a new contact
          </span>
          <IconButton
            variant="destructive-primary"
            icon="FeatherX"
            onClick={props.close}
          />
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center bg-neutral-border" />
        <div className="flex w-full flex-col items-center justify-center gap-6 px-4 py-4">
          <ContactNameForm
            disabled={loading}
            value={contactName.value}
            error={contactName.error}
            onChange={setContactName}
          />
          <SimpleContactForm
            disabled={loading}
            objects={phones}
            setObjects={setPhones}
            onAddButtonClick={() => setPhones(pushField(phones))}
            onRemoveButtonClick={() => setPhones(phones.slice(0, phones.length - 1))}
            variant="phone"
          />
          {
            emails.length === 0 ?
            <AddButton
              title={"Add Email"}
              iconRight="FeatherAtSign"
              variant="neutral-secondary"
              onClick={() => setEmails(pushField(emails))}
            /> :
            <SimpleContactForm
              disabled={loading}
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
               title={"Add Address"}
               iconRight="FeatherMapPin"
               variant="neutral-secondary"
               onClick={() => setAddresses(pushAddressField(addresses))}
             /> :
            <ContactAddressForm
              disabled={loading}
              addresses={addresses}
              setAddresses={setAddresses}
              onAddButtonClick={() => setAddresses(pushAddressField(addresses))}
              onRemoveButtonClick={() => setAddresses(addresses.slice(0, addresses.length - 1))}
            />
          }
          <Button
            loading={loading}
            size="large"
            icon="FeatherUserPlus"
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
                const request = await fetch("/api/contacts", {
                  method: "post",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(buildContactJson(contactName.value, phones, emails, addresses))
                });

                if (!request.ok) {
                    if (
                      request.headers.has("content-type") &&
                      isApplicationJson(request.headers.get("content-type") as string)
                    ) {
                      const response:  {fieldViolations: {[prop: string]: string[]}} = await request.json();
                      if ("fieldViolations" in response) {
                        const phonesCopy = [...phones];
                        const emailsCopy = [...emails];
                        const addressesCopy = [...addresses];
                        const contactNameCopy = {...contactName};

                        
                        for (const key of Object.keys(response.fieldViolations)) {
                          if (key === "name") {
                            contactNameCopy.error = response.fieldViolations[key][0];
                            return;
                          }

                          const parts = key.split("[");
                          const field = parts[0];
                          const marker = parts[1].slice(0, -1);

                          if (field === "phoneNumbers") {
                            for (let i = 0; i < phones.length; i++) {
                              if (phones[i].marker.value === marker)
                                phonesCopy[i].marker.error = response.fieldViolations[key][0];
                            }
                          }
                          if (field === "emails") {
                            for (let i = 0; i < emails.length; i++) {
                              if (emails[i].marker.value === marker)
                                phonesCopy[i].marker.error = response.fieldViolations[key][0];
                            }
                          }
                        }

                        setPhones(phonesCopy);
                        setEmails(emailsCopy);
                        setContactName(contactNameCopy);
                        // setAddresses(addressesCopy);
                      }
                      props.showAlert(await request.json(), "error");
                    }
                    props.showAlert(await request.text(), "error");
                  }   
              }
              catch(error) {
                props.showAlert(error+"", "error");
              }
              finally {
                setLoading(false);
              }
            }}
          >
            Create
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
    if (it.marker.value.length > 14) error = "marker is too long";
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

function isApplicationJson(contentType: string): boolean {
  return contentType.includes("application/json");
}