"use client";

import React from "react";
import * as SubframeCore from "@subframe/core";
import { SidebarRailWithIcons } from "../components/SidebarRailWithIcons";
import { Tooltip } from "../components/Tooltip";
import { IconButton } from "../components/IconButton";
import { Avatar } from "../components/Avatar";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex h-screen w-full items-start",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <SidebarRailWithIcons
        header={
          <div className="flex flex-col items-center justify-center gap-2 px-1 py-1">
            <img
              className="h-6 w-6 flex-none object-cover"
              src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
            />
          </div>
        }
        footer={
          <div className="flex flex-col items-center justify-end gap-4 px-1 py-1">
            <SubframeCore.Tooltip.Provider>
              <SubframeCore.Tooltip.Root>
                <SubframeCore.Tooltip.Trigger asChild={true}>
                  <IconButton
                    variant="neutral-secondary"
                    icon="FeatherLogOut"
                  />
                </SubframeCore.Tooltip.Trigger>
                <SubframeCore.Tooltip.Portal>
                  <SubframeCore.Tooltip.Content
                    side="right"
                    align="center"
                    sideOffset={4}
                    asChild={true}
                  >
                    <Tooltip>Log out</Tooltip>
                  </SubframeCore.Tooltip.Content>
                </SubframeCore.Tooltip.Portal>
              </SubframeCore.Tooltip.Root>
            </SubframeCore.Tooltip.Provider>
            <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif">
              A
            </Avatar>
          </div>
        }
      >
        <SidebarRailWithIcons.NavItem icon="FeatherHome" selected={true}>
          Home
        </SidebarRailWithIcons.NavItem>
      </SidebarRailWithIcons>
      {children ? (
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2 self-stretch overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});
