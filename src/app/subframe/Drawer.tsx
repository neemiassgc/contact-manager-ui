"use client";

import React, { useState } from "react";
import * as SubframeCore from "@subframe/core";
import { DrawerLayout } from "@/subframe/layouts/DrawerLayout";
import { TextField } from "@/subframe/components/TextField";
import { Badge } from "@/subframe/components/Badge";
import { IconButton } from "@/subframe/components/IconButton";
import { Button } from "@/subframe/components/Button";
import { Address, Contact, Variant } from "../lib/types";
import { isApplicationJson } from "../lib/misc";

type Props = {
  value: string,
  error?: string | undefined
}

type Marker = { marker: Props }

type StringField = Marker & { field: Props }

type AddressField = Marker & { field: { value: Address, error?: string | undefined } }

export default function Drawer(props: {
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

function ContactNameForm(props: {
  value: string,
  error?: string,
  onChange: (obj: Props) => void,
  disabled: boolean
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full flex-col items-start">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-body font-body text-default-font"
            name="FeatherContact"
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            Contact Name
          </span>
        </div>
      </div>
      <TextField
        className="h-auto w-full flex-none"
        helpText={props.error}
        error={!!props.error}
        disabled= {props.disabled}
      >
        <TextField.Input
          placeholder="Contact Name"
          value={props.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange({value: event.target.value})}
        />
      </TextField>
    </div>
  )
}

function SimpleContactForm(props: {
  variant: "phone" | "email",
  onAddButtonClick: () => void,
  onRemoveButtonClick: () => void,
  objects: StringField[],
  setObjects: (object: StringField[]) => void,
  disabled: boolean
}) {
  return (
    <div className="flex w-full flex-col items-end justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-end justify-between">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-caption-bold font-caption-bold text-default-font"
            name={props.variant === "phone" ? "FeatherPhone" : "FeatherAtSign"}
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            {capitalize(props.variant)}
          </span>
        </div>
      </div>
      {
        props.objects.map((obj, index) =>(
          <div key={index} className="flex w-full items-center justify-end gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <FieldMarker
              disabled={props.disabled}
              error={obj.marker.error}
              value={obj.marker.value}
              onChange={value =>
                props.setObjects(editAt(props.objects, index, {
                  field: {...obj.field},
                  marker: {value}
                }))
              }
            />
            <TextInput
              disabled={props.disabled}
              placeholder={props.variant}
              value={obj.field.value}
              onChange={value =>
                props.setObjects(editAt(props.objects, index, {
                  field: {...obj.field, value},
                  marker: {...obj.marker}
                }))
            }
            />
            {
              (props.variant === "phone" && index + 1 === 1) ? null : <RemoveButton onClick={props.onRemoveButtonClick}/>
            }
          </div>
        ))
      }
      <AddButton title={capitalize(props.variant)} onClick={props.onAddButtonClick}/>
    </div>
  );
}

function ContactAddressForm(props: {
  onAddButtonClick: () => void,
  onRemoveButtonClick: () => void,
  setAddresses: (addresses: AddressField[]) => void,
  addresses: AddressField[],
  disabled: boolean
}) {

  return (
    <div className="flex w-full flex-col items-end justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-end justify-between">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-caption-bold font-caption-bold text-default-font"
            name="FeatherMapPin"
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            Address
          </span>
        </div>
      </div>
      {
        props.addresses.map((address, index) => (
          <div key={index} className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <FieldMarker
                disabled={props.disabled}
                error={address.marker.error}
                value={address.marker.value}
                onChange={value => props.setAddresses(editAt(props.addresses, index, {
                  field: {...address.field},
                  marker: {value}
                }))}
              />
              <RemoveButton onClick={props.onRemoveButtonClick}/>
            </div>
            {
              ["zipcode", "country", "state", "city", "address"].map((key, j) => (
                <TextField
                  key={j}
                  className="h-auto w-full flex-none"
                  disabled={props.disabled}
                >
                  <TextField.Input
                    placeholder={key}
                    value={address.field.value[key]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      props.setAddresses(editAt(props.addresses, index, {
                        marker: {...address.marker},
                        field: {
                          ...address.field,
                          value: {
                            ...address.field.value,
                            [key]: event.target.value
                          }
                        }
                      }))
                    }
                  />
                </TextField>
              ))
            }
          </div>
        ))
      }
      <AddButton title="Add Address" onClick={props.onAddButtonClick} />
    </div>
  )
}

function TextInput(props: {
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
  disabled: boolean
}) {
  return (
    <TextField className="h-auto grow shrink-0 basis-0" helpText="" disabled={props.disabled}>
      <TextField.Input
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
      />
    </TextField>
  )
}

function AddButton(props: {
  title: string,
  onClick: () => void,
  iconRight?: string,
  variant?: "neutral-primary" | "neutral-secondary"
}) {
  return (
    <Button
      className="h-8 w-full flex-none"
      variant={props.variant ?? "neutral-primary"}
      icon="FeatherPlus"
      iconRight={props.iconRight as SubframeCore.IconName}
      onClick={props.onClick}>
      {props.title}
    </Button>
  )
}

function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

function FieldMarker(props: {
  value: string,
  onChange: (value: string) => void,
  error: string | undefined,
  disabled: boolean
}) {
  const [marker, setMarker] = useState("mark");

  const checkedError: boolean = props.error !== undefined && props.error.length > 0;

  return (
    <SubframeCore.Popover.Root>
      <SubframeCore.Popover.Trigger asChild={true}>
        <Badge variant={checkedError ? "error" : "neutral"} iconRight="FeatherChevronDown">
          {marker}
        </Badge>
      </SubframeCore.Popover.Trigger>
      <SubframeCore.Popover.Portal>
        <SubframeCore.Popover.Content
          onInteractOutside={() => setMarker(props.value)}
          side="bottom"
          align="center"
          sideOffset={4}
          asChild={true}
        >
          <div className="flex w-36 flex-none items-start rounded-md border border-solid border-neutral-border bg-default-background shadow-lg">
            <TextField icon="FeatherTag" error={checkedError} helpText={props.error} disabled={props.disabled}>
              <TextField.Input
                placeholder={checkedError ? "type here" : props.error}
                value={props.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
              />
            </TextField>
          </div>
        </SubframeCore.Popover.Content>
      </SubframeCore.Popover.Portal>
    </SubframeCore.Popover.Root>
  )
}

function RemoveButton(props: {onClick: () => void}) {
  return (
    <IconButton
      variant="destructive-tertiary"
      icon="FeatherX"
      onClick={props.onClick}
    />
  )
}

function editAt<T>(array: T[], index: number, value: T): T[] {
  const newArray: T[] = array.slice(0);
  newArray[index] = value;
  return newArray;
};

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