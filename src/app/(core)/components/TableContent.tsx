import { Table } from "@/subframe/components/Table";
import ContactRow from "./ContactRow";
import type { Contact } from "./drawer/types";

export default function TableContent(props: {
  reloadContacts: () => void,
  content: (Contact & { id: string })[]
}) {
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
          props.content.map((contact, index) =>
            <ContactRow
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
      </Table>
    </div>
  )
}

function isNotEmpty(obj?: any): boolean {
  return obj && Object.keys(obj).length > 0;
}