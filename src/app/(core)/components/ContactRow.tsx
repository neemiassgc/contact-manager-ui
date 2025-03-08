"use client";

import { Avatar } from "@/subframe/components/Avatar";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import DeleteWithConfirmation from "./DeleteWithConfirmation"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactRow(props: {
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