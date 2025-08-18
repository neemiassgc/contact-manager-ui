"use client";

import React, { useState } from "react";
import * as SubframeCore from "@subframe/core";
import { SidebarRailWithIcons } from "@/subframe/components/SidebarRailWithIcons";
import { Tooltip } from "@/subframe/components/Tooltip";
import { IconButton } from "@/subframe/components/IconButton";
import { Avatar } from "@/subframe/components/Avatar";
import Image from "next/image";
import { TopbarWithLeftNav } from "../components/TopbarWithLeftNav";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

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
  const isSmallDevice = useMediaQuery("(max-width: 768px)")

  const logoImage = (
    <Image
      width={32} height={32}
      className="flex-none object-cover"
      src="/logo.svg"
      alt="project logo"
    />
  )

  return (
    <div
      className={SubframeCore.twClassNames(
        `flex h-screen w-full ${isSmallDevice ? "flex-col items-center" : "items-start"}`,
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      { isSmallDevice ?
        <TopbarWithLeftNav
          leftSlot={
            <div className="flex gap-6">
              {logoImage}
              <HomeButton/>
            </div>
          }
          rightSlot={<ProfileButtons username={otherProps.username} picture={otherProps.picture}/>}
        /> :
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
          footer={<ProfileButtons flexCol username={otherProps.username} picture={otherProps.picture}/>}
        >
          <HomeButton/>
        </SidebarRailWithIcons>
      }
      {children ? (
        <div
        className={`flex w-full grow shrink-0 basis-0 flex-col items-start overflow-y-auto bg-default-background ${isSmallDevice ? "w-full gap-4" : "gap-2 self-stretch"}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
});

function ProfileButtons(props: { username: string, picture: string, flexCol?: boolean }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className={`flex ${props.flexCol ? "flex-col" : ""} justify-end gap-4 px-1 py-1`}>
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
            <Avatar image={props.picture}>
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
              <Tooltip>{props.username}</Tooltip>
            </SubframeCore.Tooltip.Content>
          </SubframeCore.Tooltip.Portal>
        </SubframeCore.Tooltip.Root>
      </SubframeCore.Tooltip.Provider>
    </div>
  )
}

function HomeButton() {
  const nextRouter = useRouter();

  return (
    <SubframeCore.Tooltip.Provider>
      <SubframeCore.Tooltip.Root>
        <SubframeCore.Tooltip.Trigger asChild={true}>
          <div className="flex items-center gap-2">
            <IconButton
              variant="brand-secondary"
              icon="FeatherHome"
              onClick={() => nextRouter.push("/")}
            />
          </div>
        </SubframeCore.Tooltip.Trigger>
        <SubframeCore.Tooltip.Portal>
          <SubframeCore.Tooltip.Content
            side="bottom"
            align="center"
            sideOffset={4}
            asChild={true}
          >
            <Tooltip>Home</Tooltip>
          </SubframeCore.Tooltip.Content>
        </SubframeCore.Tooltip.Portal>
      </SubframeCore.Tooltip.Root>
    </SubframeCore.Tooltip.Provider>
  )
}

export default DefaultPageLayoutRoot;
