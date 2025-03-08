"use client";

import React, { useState } from "react";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import * as SubframeCore from "@subframe/core";
import { useFetch } from "./hooks";
import { Contact, Variant } from "./components/drawer/types";
import Drawer from "./components/drawer/Drawer"
import BreadcrumbsBox from "./components/BreadcrumbsBox";
import Feedback from "./components/Feedback";
import TableContent from "./components/TableContent";
import { useUser } from "@auth0/nextjs-auth0/client";
import Notification from "./components/Notification";

export default function Page() {
  const [openContactDrawer, setOpenContactDrawer] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    title: "",
    variant: "success" as Variant
  });
  const { data, loading, error, reload } = useFetch("/api/contacts");
  const { user } = useUser();

  return (
    <>
      { notification.open &&
        <Notification
          title={notification.title}
          variant={notification.variant}
          onDispose={() => setNotification({...notification, open: false})}
        />
      }
      <div className="container max-w-none flex h-full w-full flex-col items-start">
        <BreadcrumbsBox/>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-8 overflow-auto">
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <span className="w-full text-heading-3 font-heading-3 text-default-font">
              Logged as {user!.name}
            </span>
            <div className="flex w-full items-center gap-2 sticky top-0 z-10 bg-[#ffffff]">
              <div className="flex grow shrink-0 basis-0 items-center gap-1">
                <TextField
                  disabled={loading}
                  variant="filled"
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
                      disabled={loading}
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
                  disabled={loading}
                  icon="FeatherPlus"
                  onClick={() => setOpenContactDrawer(true)}
                >
                  Add
                </Button>
              </div>
            </div>
            {
              loading || error ? <Feedback message={error ? error : "loading..."} error={!!error}/> :
              <TableContent content={data as (Contact & { id: string })[] }/>
            }
            <div className="flex w-full items-center justify-center gap-4">
              <span className="grow shrink-0 basis-0 text-body font-body text-subtext-color">
                {!loading && "Showing 1 – 4 of 8"}
              </span>
              <div className="flex items-center justify-center gap-2">
                <Button
                  disabled={loading}
                  variant="neutral-secondary"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                >
                  Prev
                </Button>
                <Button
                  disabled={loading}
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
          reloadContacts={reload}
          showAlert={(title: string, variant: Variant) => setNotification({title, variant, open: true})}
          close={() => setOpenContactDrawer(false)}
        />
      }
    </>
  );
}