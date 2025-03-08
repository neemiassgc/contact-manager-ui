"use client";

import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import DeleteWithConfirmation from "./DeleteWithConfirmation"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ContactTableRow } from "./drawer/types";

export default function ContactRow(props: {
  contact: ContactTableRow,
  reloadContacts: () => void
}) {
  const [editLoading, setEditLoading] = useState(false);
  const nextRouter = useRouter();

  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Avatar
            size="small"
            image={`https://api.dicebear.com/9.x/shapes/svg?seed=${props.contact.name}&backgroundType=gradientLinear`}
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
            nextRouter.push("/profile/"+props.contact.id);
          }}
        />
        <DeleteWithConfirmation onConfirm={()=>{}}/>
      </Table.Cell>

    </Table.Row>
  )
}