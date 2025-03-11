"use client";

import { Avatar } from "@/subframe/components/Avatar";
import { Button } from "@/subframe/components/Button";

export default function TopRow(props: { contactName: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar
          size="x-large"
          image={`https://api.dicebear.com/9.x/adventurer/svg?seed=${props.contactName}&backgroundType=gradientLinear`}
        >
          SW
        </Avatar>
        <span className="text-heading-2 font-heading-2 text-default-font">
          {props.contactName}  
        </span>
      </div>
      <Button
        icon="FeatherEdit2"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
      >
        Edit Contact
      </Button>
    </div>
  );
}