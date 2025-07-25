"use client";

import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import DeleteWithConfirmation from "./DeleteWithConfirmation"
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ContactTableRow } from "./types";
import NotificationContext from "./NotificationContext";
import SubframeCore from "@subframe/core";

export default function ContactRow(props: {
  contact: ContactTableRow,
  reloadContacts: (loading: boolean) => void
}) {
  const [loading, setLoading] = useState([false, false]);
  const nextRouter = useRouter();
  const showNotification = useContext(NotificationContext);

  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Avatar
            size="medium"
            image={`https://api.dicebear.com/9.x/adventurer/svg?seed=${props.contact.name}&backgroundType=gradientLinear`}
            square={true}
          >
          </Avatar>
          <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
            {props.contact.name}
          </span>
        </div>
      </Table.Cell>
      {
        Object.values(props.contact).slice(2).map((value, index) =>
          <Table.Cell key={index}>
            {
              !value ?
              <SubframeCore.Icon className="text-body font-body text-default-font text-xl" name="FeatherX"/> :
              <span className="whitespace-nowrap text-body font-body text-neutral-500">
                {value}
              </span>
            }
          </Table.Cell>
        )
      }
      <Table.Cell>
        <IconButton
          loading={loading[0]}
          variant="brand-secondary"
          icon="FeatherUser"
          onClick={() => {
            setLoading([true, false]);;
            nextRouter.push("/profile/"+props.contact.id);
          }}
        />
        <DeleteWithConfirmation loading={loading[1]} onConfirm={() => {
          setLoading([false, true]);
          fetch("/api/contacts/"+props.contact.id, {
            method: "DELETE"
          })
            .then(() => {
              showNotification("Contact deleted successfully", "success")
              props.reloadContacts(false);
            })
            .catch(error => showNotification(error.message, "error"))
            .finally(() => setLoading([false, false]))
        }}/>
      </Table.Cell>

    </Table.Row>
  )
}