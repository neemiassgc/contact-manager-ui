"use client";

import React, { useEffect, useState } from "react";
import { TextField } from "@/subframe/components/TextField";
import { Button } from "@/subframe/components/Button";
import { useGetContacts } from "./hooks";
import { ContactWithId } from "./components/types";
import Drawer from "./components/drawer/Drawer"
import BreadcrumbsBox from "./components/BreadcrumbsBox";
import Feedback from "./components/Feedback";
import TableContent from "./components/TableContent";
import { IconButton } from "@/subframe/components/IconButton";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Page() {
  const [openContactDrawer, setOpenContactDrawer] = useState(false);
  const { data, loading, error, reload } = useGetContacts();
  const [grouped, setGrouped] = useState(false);
  const [searchExpression, setSearchExpression] = useState("");
  const user = useUser();

  useEffect(() => {
    if (!loading && !data && error) {
      if (error === "User not found") {
        saveNewUser(user!.user!.nickname as string, () => reload(true));
      }
    }
  }, [loading, data, error, user, reload])

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
              loading ? <ContentLoader message={"Loading data..."}/> :
              error && error === "User not found" ? <ContentLoader message={`Creating user...`}/> :
              error ? <ContentLoader error message={error}/> :
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

function saveNewUser(username: string, onComplete: () => void) {
  fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .finally(onComplete);
}

function ContentLoader({ message, error = false, initNumber = 23}: { message: string,error?: boolean, initNumber?: number }) {
  const [countdown, setCountdown] = useState(initNumber);

  const loadingFeedback = <Feedback message={message} error={error}/>

  if (countdown > 0) {
    setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    if (countdown <= initNumber - 3)
      return <Feedback message={`Waking up the server... ${countdown}s`} error={false}/>
  }

  return loadingFeedback;
}