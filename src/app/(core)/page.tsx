"use client";

import React, { useState } from "react";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import * as SubframeCore from "@subframe/core";
import { useFetch } from "./hooks";
import { Contact, Variant } from "./components/drawer/types";
import { useRouter } from "next/navigation";
import DeleteWithConfirmation from "./components/DeleteWithConfirmation"
import { Alert } from "@/subframe/components/Alert";
import Drawer from "./components/drawer/Drawer"
import BreadcrumbsBox from "./components/BreadcrumbsBox";
import Feedback from "./components/Feedback";
import { useUser } from "@auth0/nextjs-auth0/client";

function Page() {
  const [openContactDrawer, setOpenContactDrawer] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    variant: "success" as Variant
  });
  const { data, loading, error, reload } = useFetch("/api/contacts");
  const { user } = useUser();

  return (
    <>
      { alert.open &&
        <LocalAlert
          title={alert.title}
          variant={alert.variant}
          onDispose={() => setAlert({...alert, open: false})}
        />
      }
      <div className="container max-w-none flex h-full w-full flex-col items-start">
        <BreadcrumbsBox/>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-8 overflow-auto">
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <span className="w-full text-heading-3 font-heading-3 text-default-font">
              Contacts for {user!.name}
            </span>
            <div className="flex w-full items-center gap-2">
              <div className="flex grow shrink-0 basis-0 flex-wrap items-center gap-4">
                <div className="flex grow shrink-0 basis-0 items-center gap-1">
                  <TextField
                    variant="filled"
                    label=""
                    helpText=""
                    icon="FeatherSearch"
                  >
                    <TextField.Input
                      placeholder="Search..."
                      value=""
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {}}
                    />
                  </TextField>
                </div>
                <div className="flex items-center gap-2">
                  <SubframeCore.DropdownMenu.Root>
                    <SubframeCore.DropdownMenu.Trigger asChild={true}>
                      <Button
                        variant="neutral-secondary"
                        iconRight="FeatherChevronDown"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                      >
                        Sort by
                      </Button>
                    </SubframeCore.DropdownMenu.Trigger>
                    <SubframeCore.DropdownMenu.Portal>
                      <SubframeCore.DropdownMenu.Content
                        side="bottom"
                        align="end"
                        sideOffset={4}
                        asChild={true}
                      >
                        <DropdownMenu>
                          <DropdownMenu.DropdownItem icon={null}>Name</DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>Phone</DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>Email</DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>Birth</DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>Address</DropdownMenu.DropdownItem>
                        </DropdownMenu>
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Portal>
                  </SubframeCore.DropdownMenu.Root>
                  <Button
                    icon="FeatherPlus"
                    onClick={() => setOpenContactDrawer(true)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            {
              loading || error ? <Feedback message={error ? error : "loading..."} error={!!error}/> :
              <TableContent content={data as (Contact & { id: string })[] }/>
            }
            <div className="flex w-full items-center justify-center gap-4">
              <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                Showing 1 – 4 of 8
              </span>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="neutral-secondary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Prev
                </Button>
                <Button
                  variant="neutral-secondary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
          <span className="w-full font-['Montserrat'] text-[14px] font-[500] leading-[20px] text-subtext-color text-center">
            © 2025 Created by <span className="underline">Neemias Santos</span>
          </span>
        </div>
      </div>
      {
        openContactDrawer &&
        <Drawer
          showAlert={(title: string, variant: Variant) => setAlert({title, variant, open: true})}
          close={() => setOpenContactDrawer(false)}
        />
      }
    </>
  );
}

function TableContent(props: {content: (Contact & { id: string })[] }) {
  return (
    <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-x-auto">
      <Table
        header={
          <Table.HeaderRow>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Birth</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.HeaderRow>
        }
      >
        {
          props.content.map((contact, index) =>
            <ContactRow
              key={index}
              id={contact.id}
              name={contact.name}
              phone={Object.values(contact.phoneNumbers)[0]}
              email={isNotEmpty(contact.emails) ? Object.values(contact.emails)[0] : ""}
              birth="09/08/1991"
              address={isNotEmpty(contact.addresses) ? Object.values(contact!.addresses)[0].city : ""}
            />
          )
        }
      </Table>
    </div>
  )
}

function ContactRow(props: {
  id: string,
  name: string,
  phone: string,
  email: string,
  birth: string,
  address: string
}) {
  const [editLoading, setEditLoading] = useState(false);
  const nextRouter = useRouter();

  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            image={`https://api.dicebear.com/9.x/shapes/svg?seed=${props.name}&backgroundType=gradientLinear`}
            square={true}
          >
          </Avatar>
          <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
            {props.name}
          </span>
        </div>
      </Table.Cell>
      {
        Object.values(props).slice(2).map((value, index) =>
          <Table.Cell key={index}>
            <span className="whitespace-nowrap text-body font-body text-neutral-500">
              {value}
            </span>
          </Table.Cell>
        )
      }
      <Table.Cell>
        <IconButton
          loading={editLoading}
          variant="brand-secondary"
          icon="FeatherUser"
          onClick={() => {
            setEditLoading(true);
            nextRouter.push("/profile/"+props.id);
          }}
        />
        <DeleteWithConfirmation onConfirm={()=>{}}/>
      </Table.Cell>

    </Table.Row>
  )
}

function LocalAlert(props: {
  onDispose: () => void,
  variant?: Variant,
  title: string,
}) {
  setTimeout(props.onDispose, 2000);

  return (
    <Alert
      variant={props.variant}
      title={props.title}
      actions={
        <IconButton
          size="medium"
          icon="FeatherX"
          onClick={props.onDispose}
        />
      }
    />
  )
}

function isNotEmpty(obj?: any): boolean {
  return obj && Object.keys(obj).length > 0;
}

export default Page;