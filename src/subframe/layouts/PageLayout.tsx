"use client";

import React, { useState } from "react";
import * as SubframeCore from "@subframe/core";
import { SidebarRailWithIcons } from "@/subframe/components/SidebarRailWithIcons";
import { Tooltip } from "@/subframe/components/Tooltip";
import { IconButton } from "@/subframe/components/IconButton";
import { Avatar } from "@/subframe/components/Avatar";
import Image from "next/image";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  picture: string;
  username: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  const [loading, setLoading] = useState(false);

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
            <Image
              width={32} height={32}
              className="flex-none object-cover"
              src="/logo.svg"
              alt="project logo"
            />
          </div>
        }
        footer={
          <div className="flex flex-col items-center justify-end gap-4 px-1 py-1">
            <SubframeCore.Tooltip.Provider>
              <SubframeCore.Tooltip.Root>
                <SubframeCore.Tooltip.Trigger asChild={true}>
                  <IconButton
                    variant="brand-secondary"
                    icon="FeatherLogOut"
                    loading={loading}
                    disabled={loading}
                    onClick={() => {
                      setLoading(true);
                      window.location.assign("/api/auth/logout");
                    }}
                  />
                </SubframeCore.Tooltip.Trigger>
                <SubframeCore.Tooltip.Portal>
                  <SubframeCore.Tooltip.Content
                    side="right"
                    align="center"
                    sideOffset={4}
                    asChild={true}
                  >
                    <Tooltip>{loading ? "Leaving..." : "Log Out"}</Tooltip>
                  </SubframeCore.Tooltip.Content>
                </SubframeCore.Tooltip.Portal>
              </SubframeCore.Tooltip.Root>
            </SubframeCore.Tooltip.Provider>
            <SubframeCore.Tooltip.Provider>
            <SubframeCore.Tooltip.Root>
                <SubframeCore.Tooltip.Trigger asChild={true}>
                  <Avatar image={otherProps.picture}>
                    A
                  </Avatar>
                </SubframeCore.Tooltip.Trigger>
                <SubframeCore.Tooltip.Portal>
                  <SubframeCore.Tooltip.Content
                    side="right"
                    align="start"
                    sideOffset={4}
                    asChild={true}
                  >
                    <Tooltip>{otherProps.username}</Tooltip>
                  </SubframeCore.Tooltip.Content>
                </SubframeCore.Tooltip.Portal>
              </SubframeCore.Tooltip.Root>
            </SubframeCore.Tooltip.Provider>
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

export default DefaultPageLayoutRoot;
