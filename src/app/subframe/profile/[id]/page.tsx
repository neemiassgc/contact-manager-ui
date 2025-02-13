import PageLayout from "@/subframe/layouts/PageLayout";
import { Avatar } from "@/subframe/components/Avatar";
import * as SubframeCore from "@subframe/core";
import { ContactContent } from "./components";
import { Contact } from "@/app/lib/types";
import { authorizedFetch } from "@/app/api/contacts/misc";
import { BreadcrumbsNavigator } from "./components";

export default async function Page(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params;
  const response = await authorizedFetch(process.env.RESOURCE_SERVER+"/api/contacts/"+id)
  const contact: Contact = await response.json();

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
                {contact.name}
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
        </div>
        <ContactContent contact={contact}/>
      </div>
    </PageLayout>
  );
}