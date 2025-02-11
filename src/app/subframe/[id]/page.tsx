import { PageLayout } from "@/subframe/layouts/PageLayout";
import { IconButton } from "@/subframe/components/IconButton";
import { Breadcrumbs } from "@/subframe/components/Breadcrumbs";
import { Avatar } from "@/subframe/components/Avatar";
import * as SubframeCore from "@subframe/core";
import { Tabs } from "@/subframe/components/Tabs";
import { Button } from "@/subframe/components/Button";

export default function Page(props: {
  params: Promise<{ id: string }>
}) {
  return (
    <PageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-6 bg-default-background py-12">
        <BreadcrumbsNavigator/>
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <Avatar
              size="x-large"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
            >
              A
            </Avatar>
            <div className="flex flex-col items-center justify-center">
              <span className="w-full text-heading-2 font-heading-2 text-default-font">
                Jane Smith
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name="FeatherCake"
              />
              <span className="text-body font-body text-default-font">
                09/07/1991
              </span>
            </div>
          </div>
          <Tabs>
            <Tabs.Item active={true} icon="FeatherPhone">
              Phone numbers
            </Tabs.Item>
            <Tabs.Item icon="FeatherMail">Emails</Tabs.Item>
            <Tabs.Item icon="FeatherMapPin">Addresses</Tabs.Item>
          </Tabs>
        </div>
        <div className="flex flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm w-3/5">
          <div className="flex w-full items-center justify-end">
            <Button
              icon="FeatherPlus"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
            >
              Phone
            </Button>
          </div>
          <div className="flex w-full flex-col items-start">
            <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
              <IconButton
                variant="neutral-primary"
                size="small"
                icon="FeatherComponent"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-default-font">
                  (15) 98273-17983
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-subtext-color">
                  Home
                </span>
              </div>
              <IconButton
                variant="brand-secondary"
                size="large"
                icon="FeatherEdit"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <IconButton
                variant="destructive-secondary"
                size="large"
                icon="FeatherTrash"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            </div>
            <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
              <IconButton
                variant="neutral-primary"
                size="small"
                icon="FeatherComponent"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-default-font">
                  (15) 98273-17983
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-subtext-color">
                  Home
                </span>
              </div>
              <IconButton
                variant="brand-secondary"
                size="large"
                icon="FeatherEdit"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <IconButton
                variant="destructive-secondary"
                size="large"
                icon="FeatherTrash"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            </div>
            <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
              <IconButton
                variant="neutral-primary"
                size="small"
                icon="FeatherComponent"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-default-font">
                  (15) 98273-17983
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-subtext-color">
                  Home
                </span>
              </div>
              <IconButton
                variant="brand-secondary"
                size="large"
                icon="FeatherEdit"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <IconButton
                variant="destructive-secondary"
                size="large"
                icon="FeatherTrash"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            </div>
            <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
              <IconButton
                variant="neutral-primary"
                size="small"
                icon="FeatherComponent"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body-bold font-body-bold text-default-font">
                  (15) 98273-17983
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-subtext-color">
                  Home
                </span>
              </div>
              <IconButton
                variant="brand-secondary"
                size="large"
                icon="FeatherEdit"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <IconButton
                variant="destructive-secondary"
                size="large"
                icon="FeatherTrash"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function BreadcrumbsNavigator() {
  return (
    <div className="flex w-full items-center gap-4 px-4 py-4">
      <div className="flex items-center gap-1">
        <IconButton
          size="small"
          icon="FeatherChevronLeft"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        />
        <IconButton
          disabled={true}
          size="small"
          icon="FeatherChevronRight"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        />
      </div>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Divider />
        <Breadcrumbs.Item active={true}>profile</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  )
}