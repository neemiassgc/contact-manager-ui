"use client";

import * as SubframeCore from "@subframe/core";
import { IconButton } from "@/subframe/components/IconButton";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";

export default function DeleteWithConfirmation(props: {onConfirm: () => void}) {
  return (
    <SubframeCore.DropdownMenu.Root>
      <SubframeCore.DropdownMenu.Trigger asChild={true}>
        <IconButton
          variant="destructive-secondary"
          size="large"
          icon="FeatherTrash"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        />
      </SubframeCore.DropdownMenu.Trigger>
      <SubframeCore.DropdownMenu.Portal>
        <SubframeCore.DropdownMenu.Content
          side="bottom"
          align="end"
          sideOffset={4}
          asChild={true}
        >
          <DropdownMenu>
            <DropdownMenu.DropdownItem onClick={props.onConfirm} icon="FeatherCheck">
              Confirm
            </DropdownMenu.DropdownItem>
          </DropdownMenu>
        </SubframeCore.DropdownMenu.Content>
      </SubframeCore.DropdownMenu.Portal>
    </SubframeCore.DropdownMenu.Root>
  )
}