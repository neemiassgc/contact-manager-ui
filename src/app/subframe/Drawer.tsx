"use client";

import React, { useState } from "react";
import * as SubframeCore from "@subframe/core";
import { DrawerLayout } from "@/subframe/layouts/DrawerLayout";
import { TextField } from "@/subframe/components/TextField";
import { Badge } from "@/subframe/components/Badge";
import { IconButton } from "@/subframe/components/IconButton";
import { Button } from "@/subframe/components/Button";
import { initArray } from "../lib/misc";
import { Address, Contact, IndexedAddress, IndexedString, Variant } from "../lib/types";

type Markers = { markers: string[] }
type StringField = Markers & { values: string[] }
type AddressField = Markers & { values: string[][] }

export default function Drawer(props: {
  open: boolean,
  close: () => void,
  showAlert: (title: string, variant: Variant) => void
}) {
  const [contactName, setContactName] = useState("");
  const [amountOfInputs, setAmountOfInputs] = useState([1, 1, 1]);
  const [phone, setPhone] = useState<StringField>({markers: [""], values: [""]});
  const [email, setEmail] = useState<StringField>({markers: [""], values: [""]});
  const [address, setAddress] = useState<AddressField>({markers: [""], values: [["", "", "", "", ""]]});

  const immutablePush = (array: string[], value: string) => [...array, value];
  const immutablePop = (array: string[]) => array.slice(0, array.length - 1);

  return (
    <DrawerLayout open={props.open} onOpenChange={() => {}}>
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
          <ContactNameForm value={contactName} onChange={setContactName}/>
          <SimpleContactForm
            setMarkers={newMarkers => setPhone({...phone, markers: newMarkers })}
            setValues={newValues => setPhone({...phone, values: newValues })}
            markers={phone.markers} 
            values={phone.values} 
            entries={amountOfInputs[0]}
            onAddButtonClick={() => {
              setAmountOfInputs(editAt(amountOfInputs, 0, amountOfInputs[0] + 1))
              setPhone({
                markers: immutablePush(phone.markers, ""),
                values: immutablePush(phone.values, "")
              })
            }}
            onRemoveButtonClick={() => {
              setAmountOfInputs(editAt(amountOfInputs, 0, amountOfInputs[0] - 1))
              setPhone({
                markers: immutablePop(phone.markers),
                values: immutablePop(phone.values)
              })
            }}
            variant="phone"
          />
          <SimpleContactForm
            setMarkers={newMarkers => setEmail({...email, markers: newMarkers })}
            setValues={newValues => setEmail({...email, values: newValues })}
            markers={email.markers} 
            values={email.values} 
            entries={amountOfInputs[1]}
            onAddButtonClick={() => {
              setAmountOfInputs(editAt(amountOfInputs, 1, amountOfInputs[1] + 1))
              setEmail({
                markers: immutablePush(phone.markers, ""),
                values: immutablePush(phone.values, "")
              })
            }}
            onRemoveButtonClick={() => {
              setAmountOfInputs(editAt(amountOfInputs, 1, amountOfInputs[1] - 1))
              setEmail({
                markers: immutablePop(phone.markers),
                values: immutablePop(phone.values)
              })
            }}
            variant="email"
          />
          <ContactAddressForm
            setMarkers={newMarkers => setAddress({...address, markers: newMarkers })}
            setValues={newValues => setAddress({...address, values: newValues })}
            markers={address.markers} 
            values={address.values} 
            entries={amountOfInputs[2]}
            onAddButtonClick={() => {
              setAmountOfInputs(editAt(amountOfInputs, 2, amountOfInputs[2] + 1))
              setAddress({
                markers: immutablePush(address.markers, ""),
                values: [...address.values, ["", "", "", "", ""]]
              })
            }}
            onRemoveButtonClick={() => {
              setAmountOfInputs(editAt(amountOfInputs, 2, amountOfInputs[2] - 1))
              setAddress({
                markers: immutablePop(phone.markers),
                values: address.values.slice(0, address.values.length - 1)
              })
            }}
          />
          <Button
            size="large"
            icon="FeatherUserPlus"
            onClick={() => console.log(buildContactJson(contactName, phone, email, address))}
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
  onChange: (value: string) => void
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
      <TextField className="h-auto w-full flex-none" label="" helpText="">
        <TextField.Input
          placeholder="Contact Name"
          value={props.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
        />
      </TextField>
    </div>
  )
}

function SimpleContactForm(props: {
  variant: "phone" | "email",
  entries?: number,
  onAddButtonClick: () => void,
  onRemoveButtonClick: () => void,
  setMarkers: (markers: string[]) => void,
  setValues: (values: string[]) => void,
  values: string[],
  markers: string[]
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
        initArray(props.entries ?? 1).map((_, index) =>(
          <div key={index} className="flex w-full items-center justify-end gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <FieldMarker
              value={props.markers[index]}
              onChange={value =>
                props.setMarkers(editAt(props.markers, index, value))
              }
            />
            <TextInput
              placeholder={props.variant}
              value={props.values[index]}
              onChange={value => props.setValues(editAt(props.values, index, value))}
            />
            {
              index + 1 > 1 && <RemoveButton onClick={props.onRemoveButtonClick}/>
            }
          </div>
        ))
      }
      <AddButton title={capitalize(props.variant)} onClick={props.onAddButtonClick}/>
    </div>
  );
}

function ContactAddressForm(props: {
  entries?: number,
  onAddButtonClick: () => void,
  onRemoveButtonClick: () => void,
  setMarkers: (markers: string[]) => void,
  setValues: (values: string[][]) => void,
  values: string[][],
  markers: string[]
}) {

  const fieldInput = (placeholder: string, markIndex: number, index: number) => (
    <TextField
      className="h-auto w-full flex-none"
    >
      <TextField.Input
        placeholder={placeholder}
        value={props.values[markIndex][index]}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          props.setValues(editAt(props.values, markIndex, editAt(props.values[markIndex], index, event.target.value)))
        }
      />
    </TextField>
  )

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
        initArray(props.entries ?? 1).map((_, index) => (
          <div key={index} className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <FieldMarker
                value={props.markers[index]}
                onChange={value => props.setMarkers(editAt(props.markers, index, value))}
              />
              {
                index + 1 > 1 && <RemoveButton onClick={props.onRemoveButtonClick}/>
              }
            </div>
            {fieldInput("Zipcode", index, 0)}
            {fieldInput("Country", index, 1)}
            {fieldInput("State", index, 2)}
            {fieldInput("City", index, 3)}
            {fieldInput("Address", index, 4)}
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
  onChange: (value: string) => void
}) {
  return (
    <TextField className="h-auto grow shrink-0 basis-0" label="" helpText="">
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
  onClick: () => void
}) {
  return (
    <Button
      className="h-8 w-full flex-none"
      variant="neutral-primary"
      icon="FeatherPlus"
      onClick={props.onClick}
      >
        {props.title}
    </Button>
  )
}

function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

function FieldMarker(props: {
  value: string,
  onChange: (value: string) => void
}) {
  const [marker, setMarker] = useState("mark");

  return (
    <SubframeCore.Popover.Root>
      <SubframeCore.Popover.Trigger asChild={true}>
        <Badge variant="neutral" iconRight="FeatherChevronDown">
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
            <TextField label="" helpText="" icon="FeatherTag">
              <TextField.Input
                placeholder="Type here"
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
  phones: StringField,
  emails: StringField,
  addresses: AddressField
): Contact {

  return {
    name: contactName,
    phoneNumbers: initArray(phones.markers.length).reduce((prev, curr) => ({
      ...prev,
      [phones.markers[curr]]: phones.values[curr]
    }), {}),
    emails: initArray(emails.markers.length).reduce((prev, curr) => ({
      ...prev,
      [emails.markers[curr]]: emails.values[curr]
    }), {}),
    addresses: initArray(addresses.markers.length).reduce((prev, curr) => ({
      ...prev,
      [addresses.markers[curr]]: {
        zipcode: addresses.values[curr][0],
        country: addresses.values[curr][1],
        state: addresses.values[curr][2],
        city: addresses.values[curr][3],
        address: addresses.values[curr][4]
      }
    }), {})
  }
}