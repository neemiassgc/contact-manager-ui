"use client";

import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { IconButton } from "@/subframe/components/IconButton";
import { useRouter } from "next/navigation";

export default function BreadcrumbsNavigator(props: { username: string }) {
  const nextRouter = useRouter();

  const redirectToHome = () => nextRouter.push("/");

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
        <Breadcrumbs.Item active={true}>{props.username}</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}