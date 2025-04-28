"use client";

import Drawer from "@/app/(core)/components/drawer/Drawer";
import { Contact, ContactWithId, MappedContact } from "@/app/(core)/components/types";
import { Avatar } from "@/subframe/components/Avatar";
import { Button } from "@/subframe/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopRow(props: { contact: ContactWithId }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar
          size="x-large"
          image={`https://api.dicebear.com/9.x/adventurer/svg?seed=${props.contact.name}&backgroundType=gradientLinear`}
        >
          SW
        </Avatar>
        <span className="text-heading-2 font-heading-2 text-default-font">
          {props.contact.name}  
        </span>
      </div>
      <Button
        icon="FeatherEdit2"
        onClick={() => setOpenDrawer(true)}
      >
        Edit Contact
      </Button>
      {
        openDrawer &&
        <Drawer
          close={() => setOpenDrawer(false)}
          mainActionButton={{
            url: "/api/contacts/" + props.contact.id,
            title: "Edit",
            iconName: "FeatherEdit",
            httpMethod: "put",
            onSuccess: () => router.refresh()
          }}
          initialize={transformContact(props.contact)}
        />
      }
    </div>
  );
}

function transformContact(contact: Contact): MappedContact {
  return {
    name: { value: contact.name },
    phoneNumbers: Object.keys(contact.phoneNumbers).map(key => ({
      marker: { value: key },
      field: { value: contact.phoneNumbers[key] }
    })),
    emails: Object.keys(contact.emails).map(key => ({
      marker: { value: key },
      field: { value: contact.emails[key] }
    })),
    addresses: Object.keys(contact.addresses).map(key => ({
      marker: { value: key },
      field: {
        value: {
          city: contact.addresses[key]["city"],
          country: contact.addresses[key]["country"],
          street: contact.addresses[key]["street"],
          zipcode: contact.addresses[key]["zipcode"],
          state: contact.addresses[key]["state"]
        }
      }
    }))
  }
}