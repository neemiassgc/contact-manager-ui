
import { DataFieldHorizontal } from "@/subframe/components/DataFieldHorizontal";
import { authorizedFetch } from "@/app/api/contacts/misc";
import { Contact } from "../../components/drawer/types";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import BreadcrumbsNavigator from "./components/BreadcrumbsNavigator";
import TopRow from "./components/TopRow";

export default async function Page(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params;
  const response = await authorizedFetch(process.env.RESOURCE_SERVER+"/api/contacts/"+id)
  const contact: Contact = await response.json();

  return (
    <div className="flex h-full w-full flex-col items-start bg-default-background overflow-auto">
      <div className="flex w-full flex-wrap items-start justify-between border-b border-solid border-neutral-border px-6 py-6">
        <div className="flex items-center gap-2 self-stretch">
          <BreadcrumbsNavigator username={contact.name}/>
        </div>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-12 bg-default-background px-12 py-12 overflow-visible">
        <div className="flex w-full flex-col items-start gap-6">
          <TopRow contactName={contact.name}/>
          <div className="flex w-full flex-wrap items-start gap-2">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <DataFieldHorizontal icon="FeatherCalendar" label="Added on">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  March 22, 2024
                </span>
              </DataFieldHorizontal>
              <DataFieldHorizontal icon="FeatherCake" label="Birthday">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  July 15, 1995
                </span>
              </DataFieldHorizontal>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <DataFieldHorizontal icon="FeatherBuilding" label="Company">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  TechCorp Solutions
                </span>
              </DataFieldHorizontal>
              <DataFieldHorizontal icon="FeatherBriefcase" label="Role">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  Product Manager
                </span>
              </DataFieldHorizontal>
            </div>
          </div>
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-6 pb-6">
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Phone Numbers
            </span>
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background">
              <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
                <IconWithBackground icon="FeatherPhone" />
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-body font-body text-default-font">
                    +1 (555) 123-4567
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Mobile
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-4 px-4 py-4">
                <IconWithBackground icon="FeatherPhone" />
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-body font-body text-default-font">
                    +1 (555) 987-6543
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Work
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Email Addresses
            </span>
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background">
              <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
                <IconWithBackground icon="FeatherMail" />
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-body font-body text-default-font">
                    sarah.wilson@techcorp.com
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Work
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-4 px-4 py-4">
                <IconWithBackground icon="FeatherMail" />
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-body font-body text-default-font">
                    sarah.w@gmail.com
                  </span>
                  <span className="text-caption font-caption text-subtext-color">
                    Personal
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-heading-3 font-heading-3 text-default-font">
              Addresses
            </span>
            <div className="flex w-full flex-col items-start rounded-md border border-solid border-neutral-border bg-default-background">
              <div className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
                <IconWithBackground icon="FeatherMapPin" />
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Office
                  </span>
                  <span className="text-body font-body text-default-font">
                    123 Tech Street, Suite 400
                  </span>
                  <span className="text-body font-body text-default-font">
                    San Francisco, CA 94105
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center gap-4 px-4 py-4">
                <IconWithBackground icon="FeatherMapPin" />
                <div className="flex grow shrink-0 basis-0 flex-col items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Home
                  </span>
                  <span className="text-body font-body text-default-font">
                    456 Park Avenue
                  </span>
                  <span className="text-body font-body text-default-font">
                    San Francisco, CA 94110
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}