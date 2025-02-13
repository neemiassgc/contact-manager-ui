"use client";

import * as SubframeCore from "@subframe/core";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { IconButton } from "@/subframe/components/IconButton";
import { Tabs } from "@/subframe/components/Tabs";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Address, Contact } from "@/app/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";

export function BreadcrumbsNavigator() {
  const nextRouter = useRouter();

  const redirectToHome = () => nextRouter.push("/subframe");

  return (
    <div className="flex w-full items-center gap-4 px-4 py-4">
      <div className="flex items-center gap-1">
        <IconButton
          size="small"
          icon="FeatherChevronLeft"
          onClick={redirectToHome}
        />
        <IconButton
          disabled={true}
          size="small"
          icon="FeatherChevronRight"
        />
      </div>
      <Breadcrumbs>
        <Breadcrumbs.Item  onClick={redirectToHome}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Divider />
        <Breadcrumbs.Item active={true}>profile</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}

export function ContactContent(props: { contact: Contact }) {
  const [tabActive, setTabActive] = useState<"phone" | "email" | "address">("phone");

  const tabOptions = {
    "phone": (
      <ListTab
        content={props.contact.phoneNumbers}
        variant="phone"
        onAddButtonClick={()=>{}}
        onDeleteWithConfirmation={()=>{}}
      />),
    "email": (
      <ListTab
        content={props.contact.emails}
        variant="email"
        onAddButtonClick={()=>{}}
        onDeleteWithConfirmation={()=>{}}
      />),
    "address": <AddressTab addresses={props.contact.addresses} />
  }

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <Tabs>
        <Tabs.Item active={tabActive === "phone"} onClick={() => setTabActive("phone")} icon="FeatherPhone">
          Phone numbers
        </Tabs.Item>
        <Tabs.Item active={tabActive === "email"} onClick={() => setTabActive("email")} icon="FeatherMail">Emails</Tabs.Item>
        <Tabs.Item active={tabActive === "address"} onClick={() => setTabActive("address")} icon="FeatherMapPin">Addresses</Tabs.Item>
      </Tabs>
      <div className="flex w-full flex-col items-start">
        {tabOptions[tabActive]}
      </div>
    </div>
  )
}

function ListTab(props: {
  content: {[prop: string]: string},
  onAddButtonClick: () => void,
  onDeleteWithConfirmation: () => void,
  variant: "email" | "phone"
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm w-3/5">
      <div className="flex w-full items-center justify-end">
        <Button
          icon="FeatherPlus"
          onClick={props.onAddButtonClick}
        >
          {props.variant}
        </Button>
      </div>
      <div className="flex w-full flex-col items-start">
        {
          Object.keys(props.content).map((objKey, index) => (
            <div key={index} className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name={props.variant === "email" ? "FeatherAtSign" : "FeatherPhoneCall"}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body font-body text-default-font">
                  {props.content[objKey]}
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-subtext-color">
                  {objKey}
                </span>
              </div>
              <IconButton
                variant="brand-secondary"
                size="large"
                icon="FeatherEdit"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <DeleteWithConfirmation onConfirm={props.onDeleteWithConfirmation} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

function AddressTab(props: {addresses: {[prop: string]: Address}}) {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-start justify-end">
        <Button
          icon="FeatherPlus"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          Address
        </Button>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-auto">
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Zipcode</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.HeaderRow>
          }
        >
          {
            Object.keys(props.addresses).map((objKey, index) => (
              <Table.Row key={objKey}>
                <Table.Cell>
                  <div className="flex flex-col items-start">
                    <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                      {props.addresses[objKey].street}
                    </span>
                    <span className="whitespace-nowrap text-caption font-caption text-subtext-color">
                      {objKey}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].city}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].state}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].country}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].zipcode}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex grow shrink-0 basis-0 items-center">
                    <IconButton
                      variant="brand-secondary"
                      icon="FeatherEdit"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                    />
                    <DeleteWithConfirmation onConfirm={()=>{}} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table>
      </div>
    </div>
  )
}
}