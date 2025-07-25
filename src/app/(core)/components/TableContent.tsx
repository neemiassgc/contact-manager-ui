import { Table } from "@/subframe/components/Table";
import ContactRow from "./ContactRow";
import type { ContactWithId } from "./types";
import SubframeCore, { IconName } from "@subframe/core";

export default function TableContent(props: {
  reloadContacts: (loading: boolean) => void,
  content: ContactWithId[],
  grouped: boolean
}) {

  return (
    <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-x-auto">
      <Table
        header={
          <Table.HeaderRow>
            <Table.HeaderCell className="flex items-center"><SimpleIcon name="FeatherUser"/> Name</Table.HeaderCell>
            <Table.HeaderCell className="flex items-center"><SimpleIcon name="FeatherPhone"/> Phone</Table.HeaderCell>
            <Table.HeaderCell className="flex items-center"><SimpleIcon name="FeatherMail"/> Email</Table.HeaderCell>
            <Table.HeaderCell className="flex items-center"><SimpleIcon name="FeatherBuilding"/> Company</Table.HeaderCell>
            <Table.HeaderCell className="flex items-center"><SimpleIcon name="FeatherBriefcase"/> Role</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.HeaderRow>
        }
      >
        {
          groupByAlphabeticalOrder(props.content).map((group, index) => {
            return (
              <>
                {
                  props.grouped &&
                   <Table.Row key={index}>
                    <Table.Cell>
                      {group[0].name[0]}
                    </Table.Cell>
                  </Table.Row>
                }
                {
                  group.map((contact, index) =>
                    <ContactRow
                      reloadContacts={props.reloadContacts}
                      key={index}
                      contact={{
                        id: contact.id,
                        name: contact.name,
                        phone: Object.values(contact.phoneNumbers)[0],
                        email: isNotEmpty(contact.emails) ? Object.values(contact.emails)[0] : "",
                        company: contact.company ?? "",
                        role: contact.role ?? ""
                      }}
                    />
                  )
                }
              </>
            )
          })
        }
      </Table>
    </div>
  )
}

function isNotEmpty(obj?: any): boolean {
  return obj && Object.keys(obj).length > 0;
}

function groupByAlphabeticalOrder(contacts: ContactWithId[]): ContactWithId[][] {
  const output: ContactWithId[][] = [];

  for (const contact of contacts) {
    if (output.length === 0) {
      output.push([contact])
      continue;
    }

    const insertionIndex = output.reduce<number>((prev, curr, index) => {
      if (prev !== -1) return prev;
      if (curr[0].name[0] === contact.name[0]) return index;
      return prev;
    }, -1);

    if (insertionIndex === -1) output.push([contact]);
    else output[insertionIndex].push(contact);
  }

  return output;
}

function SimpleIcon({ name }: { name: IconName }) {
  return <SubframeCore.Icon className="text-body font-body text-default-font mr-2" name={name}/> 
}