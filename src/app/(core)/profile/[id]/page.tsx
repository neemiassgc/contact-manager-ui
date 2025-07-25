
import { DataFieldHorizontal } from "@/subframe/components/DataFieldHorizontal";
import { authorizedFetch } from "@/app/api/contacts/misc";
import {  ContactWithId } from "../../components/types";
import BreadcrumbsNavigator from "./components/BreadcrumbsNavigator";
import TopRow from "./components/TopRow";
import InformationSection from "./components/InformationSection";
import AddressSection from "./components/AddressSection";
import SubframeCore from "@subframe/core";

export default async function Page(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params;
  const response = await authorizedFetch(process.env.RESOURCE_SERVER+"/api/contacts/"+id)
  const contact: ContactWithId = await response.json();
  
  return (
    <div className="flex h-full w-full flex-col items-start bg-default-background overflow-auto">
      <div className="flex w-full flex-wrap items-start justify-between border-b border-solid border-neutral-border px-6 py-6">
        <div className="flex items-center gap-2 self-stretch">
          <BreadcrumbsNavigator username={contact.name}/>
        </div>
      </div>
      <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-12 bg-default-background px-12 py-12 overflow-visible">
        <div className="flex w-full flex-col items-start gap-6">
          <TopRow contact={contact}/>
          <div className="flex w-full flex-wrap items-start gap-2">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <DataFieldHorizontal icon="FeatherCalendar" label="Added on">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  {formatToLegibleDate(contact.addedOn)}                  
                </span>
              </DataFieldHorizontal>
              <DataFieldHorizontal icon="FeatherCake" label="Birthday">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  {contact.birthday ? formatToLegibleDate(contact.birthday) : <IconX/>}
                </span>
              </DataFieldHorizontal>
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <DataFieldHorizontal icon="FeatherBuilding" label="Company">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  {contact.company ?? <IconX/>}
                </span>
              </DataFieldHorizontal>
              <DataFieldHorizontal icon="FeatherBriefcase" label="Role">
                <span className="whitespace-nowrap text-body font-body text-default-font">
                  {contact.role ?? <IconX/>}
                </span>
              </DataFieldHorizontal>
            </div>
          </div>
        </div>
        <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-border" />
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-6 pb-6">
          <InformationSection iconName="FeatherPhone" title="Phone Numbers" content={contact.phoneNumbers} />
          <InformationSection iconName="FeatherMail" title="Email Addresses" content={contact.emails} />
          <AddressSection content={contact.addresses}/>
        </div>
      </div>
    </div>
  );
}

function formatToLegibleDate(ISO8601Date: string): string {
  return new Date(ISO8601Date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

function IconX() {
  return <SubframeCore.Icon className="text-body font-body text-default-font text-xl" name="FeatherX"/>;
}