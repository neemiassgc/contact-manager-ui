"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";
import { DrawerLayout } from "@/subframe/layouts/DrawerLayout";
import { TextField } from "@/subframe/components/TextField";
import { Badge } from "@/subframe/components/Badge";
import { IconButton } from "@/subframe/components/IconButton";
import { Button } from "@/subframe/components/Button";
import { toCamelCase } from "../lib/misc";

export default function Drawer(props: {open: boolean, close: () => void}) {
  return (
    <DrawerLayout open={props.open} onOpenChange={() => {}}>
      <div className="flex h-screen w-144 flex-col items-start gap-2 p-3 overflow-auto">
        <div className="flex w-full items-center justify-between px-4 pt-4 pb-1">
          <span className="text-body font-body text-default-font">
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
          <SimpleContactForm variant="phone"/>
          <SimpleContactForm variant="email"/>
          <ContactAddressForm/>
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
    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <TextField
        className="h-auto w-full flex-none"
        label="Contact Name"
        helpText="Name not valid"
        icon="FeatherUser"
      >
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
            {toCamelCase(props.variant)}
          </span>
        </div>
        <SubframeCore.Popover.Root>
          <SubframeCore.Popover.Trigger asChild={true}>
            <Badge iconRight="FeatherChevronDown">Mark</Badge>
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
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextField>
              </div>
            </SubframeCore.Popover.Content>
          </SubframeCore.Popover.Portal>
        </SubframeCore.Popover.Root>
      </div>
      <TextInput placeholder={props.variant} />
      <AddButton title={toCamelCase(props.variant)} onClick={() => {}} />
    </div>
  );
}

function ContactAddressForm() {
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
        <SubframeCore.Popover.Root>
          <SubframeCore.Popover.Trigger asChild={true}>
            <Badge icon="FeatherTag" iconRight="FeatherChevronDown">
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
              <div className="flex w-36 flex-none flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background shadow-lg">
                <TextField label="" helpText="" icon="FeatherTag">
                  <TextField.Input
                    placeholder=""
                    value=""
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {}}
                  />
                </TextField>
              </div>
            </SubframeCore.Popover.Content>
          </SubframeCore.Popover.Portal>
        </SubframeCore.Popover.Root>
      </div>
      <TextInput placeholder="Country"/>
      <TextInput placeholder="Address"/>
      <TextInput placeholder="State"/>
      <TextInput placeholder="City"/>
      <TextInput placeholder="Zipcode"/>
      <AddButton title="Add Address" onClick={() => {}}/>
    </div>
  )
}

function TextInput(props: {
  placeholder: string
}) {
  return (
    <TextField
      className="h-auto w-full flex-none"
      label=""
      helpText={props.placeholder + "not valid"}
    >
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