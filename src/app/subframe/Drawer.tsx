"use client";

import React, { useState } from "react";
import * as SubframeCore from "@subframe/core";
import { DrawerLayout } from "@/subframe/layouts/DrawerLayout";
import { TextField } from "@/subframe/components/TextField";
import { Badge } from "@/subframe/components/Badge";
import { IconButton } from "@/subframe/components/IconButton";
import { Button } from "@/subframe/components/Button";
import { initArray } from "../lib/misc";
import { Variant } from "../lib/types";

export default function Drawer(props: {
  open: boolean,
  close: () => void,
  showAlert: (title: string, variant: Variant) => void
}) {
  const [phoneEntries, setPhoneEntries] = useState(1);
  const [emailEntries, setEmailEntries] = useState(1);
  const [addressEntries, setAddressEntries] = useState(1);

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
          <ContactNameForm/>
          <SimpleContactForm
            entries={phoneEntries}
            onAddButtonClick={() => setPhoneEntries(phoneEntries + 1)}
            onRemoveButtonClick={() => setPhoneEntries(phoneEntries - 1)}
            variant="phone"
          />
          <SimpleContactForm
            entries={emailEntries}
            onAddButtonClick={() => setEmailEntries(emailEntries + 1)}
            onRemoveButtonClick={() => setEmailEntries(emailEntries - 1)}
            variant="email"
          />
          <ContactAddressForm
            entries={addressEntries}
            onAddButtonClick={() => setAddressEntries(addressEntries + 1)}
            onRemoveButtonClick={() => setAddressEntries(addressEntries - 1)}
          />
          <Button
            size="large"
            icon="FeatherUserPlus"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
          >
            Create
          </Button>
        </div>
      </div>
    </DrawerLayout>
  );
}

function ContactNameForm() {
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
          value=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
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
            <FieldMarker/>
            <TextInput placeholder={props.variant} />
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
  onRemoveButtonClick: () => void
}) {

  const fieldInput = (placeholder: string) => (
    <TextField
      className="h-auto w-full flex-none"
      label=""
    >
      <TextField.Input
        placeholder={placeholder}
        value=""
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
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
              <FieldMarker/>
              {
                index + 1 > 1 && <RemoveButton onClick={props.onRemoveButtonClick}/>
              }
            </div>
            {fieldInput("Zipcode")}
            {fieldInput("Country")}
            {fieldInput("State")}
            {fieldInput("City")}
            {fieldInput("Address")}
          </div>
        ))
      }
      <AddButton title="Add Address" onClick={props.onAddButtonClick} />
    </div>
  )
}

function TextInput(props: {
  placeholder: string
}) {
  return (
    <TextField className="h-auto grow shrink-0 basis-0" label="" helpText="">
      <TextField.Input
        placeholder={props.placeholder}
        value=""
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
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

function FieldMarker() {
  return (
    <SubframeCore.Popover.Root>
      <SubframeCore.Popover.Trigger asChild={true}>
        <Badge variant="neutral" iconRight="FeatherChevronDown">
          Mark
        </Badge>
      </SubframeCore.Popover.Trigger>
      <SubframeCore.Popover.Portal>
        <SubframeCore.Popover.Content
          side="bottom"
          align="center"
          sideOffset={4}
          asChild={true}
        >
          <div className="flex w-36 flex-none items-start rounded-md border border-solid border-neutral-border bg-default-background shadow-lg">
            <TextField label="" helpText="" icon="FeatherTag">
              <TextField.Input
                placeholder=""
                value=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
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

function insertAt<T>(array: T[], index: number, value: T): T[] {
  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index)
  ]
};