import { Table } from "@/subframe/components/Table";
import ContactRow from "./ContactRow";
import type { ContactWithId, Variant } from "./drawer/types";

export default function TableContent(props: {
  reloadContacts: (loading: boolean) => void,
  showNotification: (title: string, variant: Variant) => void,
  content: ContactWithId[],
  grouped: boolean
}) {

  console.log(groupByAlphabeticalOrder(props.content))
  return (
    <div className="flex w-full flex-col items-start gap-6 overflow-hidden overflow-x-auto">
      <Table
        header={
          <Table.HeaderRow>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Birth</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.HeaderRow>
        }
      >
        {
          groupByAlphabeticalOrder(props.content).map((group, index) => {
            console.log(group)
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
                      showNotification={props.showNotification}
                      reloadContacts={props.reloadContacts}
                      key={index}
                      contact={{
                        id: contact.id,
                        name: contact.name,
                        phone: Object.values(contact.phoneNumbers)[0],
                        email: isNotEmpty(contact.emails) ? Object.values(contact.emails)[0] : "",
                        birth: "09/08/1991",
                        address: isNotEmpty(contact.addresses) ? Object.values(contact.addresses)[0].city : ""
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