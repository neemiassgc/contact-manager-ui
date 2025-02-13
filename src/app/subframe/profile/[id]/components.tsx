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
}