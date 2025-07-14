"use client";

import React, { useState } from "react";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { useFetchWithEffect } from "./hooks";
import { ContactWithId } from "./components/types";
import Drawer from "./components/drawer/Drawer"
import BreadcrumbsBox from "./components/BreadcrumbsBox";
import Feedback from "./components/Feedback";
import TableContent from "./components/TableContent";
import { IconButton } from "@/subframe/components/IconButton";

export default function Page() {
  const [openContactDrawer, setOpenContactDrawer] = useState(false);
  const { data, loading, error, reload } = useFetchWithEffect("/api/contacts");
  const [grouped, setGrouped] = useState(false);
  const [searchExpression, setSearchExpression] = useState("");

  return (
    <>
      <div className="container max-w-none flex h-full w-full flex-col items-start">
        <BreadcrumbsBox/>
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-8 overflow-auto">
          <div className="flex w-full flex-col items-start gap-6 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <span className="w-full text-heading-3 font-heading-3 text-default-font">
              Manage your Contacts
            </span>
            <div className="flex w-full items-center gap-2 sticky top-0 z-10 bg-[#ffffff]">
              <div className="flex grow shrink-0 basis-0 items-center gap-1">
                <TextField
                  disabled={loading}
                  variant="filled"
                  icon="FeatherSearch"
                >
                  <TextField.Input
                    placeholder="Search..."
                    value={searchExpression}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchExpression(event.target.value)}
                  />
                </TextField>
              </div>
              <div className="flex items-center gap-5">
                <IconButton
                  disabled={loading}
                  variant={grouped ? "brand-secondary" : "neutral-secondary"}
                  size="large"
                  icon={grouped ? "FeatherGrid3X3" : "FeatherGrid2X2"}
                  onClick={() => setGrouped(!grouped)}
                />
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
              <TableContent
                grouped={grouped}
                content={filterByExpression(data, searchExpression)}
                reloadContacts={reload}
              />
            }
          </div>
          <span className="w-full text-[14px] font-[500] leading-[20px] text-subtext-color text-center">
            © 2025 Created by <span className="underline">Neemias Santos</span>
          </span>
        </div>
      </div>
      {
        openContactDrawer &&
        <Drawer
          mainActionButton={{
            url: "/api/contacts",
            title: "Create",
            iconName: "FeatherUserPlus",
            httpMethod: "post",
            onSuccess: () => reload(true)
          }}
          close={() => setOpenContactDrawer(false)}
        />
      }
    </>
  );
}

function filterByExpression(contacts: ContactWithId[], expression: string): ContactWithId[] {
  if (expression.length === 0) return contacts;
  return contacts.filter((contact) => contact.name.toLowerCase().includes(expression.toLowerCase()));
}