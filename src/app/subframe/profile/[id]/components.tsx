"use client";

import * as SubframeCore from "@subframe/core";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { IconButton } from "@/subframe/components/IconButton";
import { Tabs } from "@/subframe/components/Tabs";
import { Button } from "@/subframe/components/Button";
import { Table } from "@/subframe/components/Table";
import { Address, Contact } from "@/app/lib/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";

export function BreadcrumbsNavigator() {
  const nextRouter = useRouter();

  const redirectToHome = () => nextRouter.push("/subframe");

  return (
    <div className="flex w-full items-center gap-4 px-4 py-4">
      <div className="flex items-center gap-1">
        <IconButton
          size="small"
          icon="FeatherChevronLeft"
          onClick={redirectToHome}
        />
        <IconButton
          disabled={true}
          size="small"
          icon="FeatherChevronRight"
        />
      </div>
      <Breadcrumbs>
        <Breadcrumbs.Item  onClick={redirectToHome}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Divider />
        <Breadcrumbs.Item active={true}>profile</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}