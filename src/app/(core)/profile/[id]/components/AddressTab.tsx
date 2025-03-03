import { Button } from "@/subframe/components/Button";
import { IconButton } from "@/subframe/components/IconButton";
import { Table } from "@/subframe/components/Table";
import DeleteWithConfirmation from "@/app/(core)/components/DeleteWithConfirmation";
import { Address } from "@/app/(core)/components/drawer/types";

export default function AddressTab(props: {addresses: {[prop: string]: Address}}) {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-start justify-end">
        <Button
          icon="FeatherPlus"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
        >
          Address
        </Button>
      </div>
      <div className="flex w-full flex-col items-start gap-6 overflow-auto">
        <Table
          header={
            <Table.HeaderRow>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Zipcode</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.HeaderRow>
          }
        >
          {
            Object.keys(props.addresses).map((objKey, index) => (
              <Table.Row key={objKey}>
                <Table.Cell>
                  <div className="flex flex-col items-start">
                    <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
                      {props.addresses[objKey].street}
                    </span>
                    <span className="whitespace-nowrap text-caption font-caption text-subtext-color">
                      {objKey}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].city}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].state}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].country}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="whitespace-nowrap text-body font-body text-neutral-500">
                    {props.addresses[objKey].zipcode}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex grow shrink-0 basis-0 items-center">
                    <IconButton
                      variant="brand-secondary"
                      icon="FeatherEdit"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                    />
                    <DeleteWithConfirmation onConfirm={()=>{}} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table>
      </div>
    </div>
  )
}