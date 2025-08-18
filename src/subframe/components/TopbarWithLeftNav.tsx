"use client";
/*
 * Documentation:
 * Topbar with left nav — https://app.subframe.com/69a6eea5bd3f/library?component=Topbar+with+left+nav_3cac908f-e20b-4c42-a91e-8736a54e8799
 * Icon Button — https://app.subframe.com/69a6eea5bd3f/library?component=Icon+Button_af9405b1-8c54-4e01-9786-5aad308224f6
 * Avatar — https://app.subframe.com/69a6eea5bd3f/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeUtils from "../utils";
import * as SubframeCore from "@subframe/core";

interface NavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  icon?: SubframeCore.IconName;
  children?: React.ReactNode;
  className?: string;
}

const NavItem = React.forwardRef<HTMLDivElement, NavItemProps>(function NavItem(
  {
    selected = false,
    icon = null,
    children,
    className,
    ...otherProps
  }: NavItemProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "group/0d6214aa flex cursor-pointer items-center justify-center gap-2 rounded-md px-2 py-1 hover:bg-neutral-50 active:bg-neutral-100",
        { "bg-brand-50 hover:bg-brand-50 active:bg-brand-100": selected },
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <SubframeCore.Icon
        className={SubframeUtils.twClassNames(
          "text-body font-body text-default-font",
          { "text-brand-700": selected }
        )}
        name={icon}
      />
      {children ? (
        <span
          className={SubframeUtils.twClassNames(
            "text-body-bold font-body-bold text-default-font",
            { "text-brand-700": selected }
          )}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface TopbarWithLeftNavRootProps extends React.HTMLAttributes<HTMLElement> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

const TopbarWithLeftNavRoot = React.forwardRef<
  HTMLElement,
  TopbarWithLeftNavRootProps
>(function TopbarWithLeftNavRoot(
  { leftSlot, rightSlot, className, ...otherProps }: TopbarWithLeftNavRootProps,
  ref
) {
  return (
    <nav
      className={SubframeUtils.twClassNames(
        "flex w-full items-center justify-between border-b border-solid border-neutral-border bg-default-background px-4 py-4",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      {leftSlot ? (
        <div className="flex items-center gap-6">{leftSlot}</div>
      ) : null}
      {rightSlot ? (
        <div className="flex items-center justify-end gap-2">{rightSlot}</div>
      ) : null}
    </nav>
  );
});

export const TopbarWithLeftNav = Object.assign(TopbarWithLeftNavRoot, {
  NavItem,
});
