import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";

export default function BreadcrumbsBox() {
  return (
    <div className="flex w-full items-center gap-4 px-4 py-4">
      <Breadcrumbs>
        <div className="flex items-center gap-2">
          <Breadcrumbs.Divider />
          <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        </div>
      </Breadcrumbs>
    </div>
  )
}