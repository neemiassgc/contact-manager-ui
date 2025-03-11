"use client";
/*
 * Documentation:
 * Data Field Horizontal — https://app.subframe.com/69a6eea5bd3f/library?component=Data+Field+Horizontal_9873e9ab-e456-4834-a93a-1eaa4c1ee170
 */

import React from "react";
import * as SubframeCore from "@subframe/core";

interface DataFieldHorizontalRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const DataFieldHorizontalRoot = React.forwardRef<
  HTMLElement,
  DataFieldHorizontalRootProps
>(function DataFieldHorizontalRoot(
  {
    icon = "FeatherBadgeInfo",
    label,
    children,
    className,
    ...otherProps
  }: DataFieldHorizontalRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full items-center gap-2",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex w-32 flex-none items-center gap-2">
        <SubframeCore.Icon
          className="text-body font-body text-subtext-color"
          name={icon}
        />
        {label ? (
          <span className="line-clamp-1 grow shrink-0 basis-0 text-body font-body text-subtext-color">
            {label}
          </span>
        ) : null}
      </div>
      {children ? (
        <div className="flex min-h-[32px] grow shrink-0 basis-0 items-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DataFieldHorizontal = DataFieldHorizontalRoot;
