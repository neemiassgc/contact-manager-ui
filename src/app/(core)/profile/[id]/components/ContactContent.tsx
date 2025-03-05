"use client"

import { Contact } from "@/app/(core)/components/drawer/types";
import { Tabs } from "@/subframe/components/Tabs";
import { useState } from "react";
import ListTab from "./ListTab";
import AddressTab from "./AddressTab";

export default function ContactContent(props: { contact: Contact }) {
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