import SubframeCore from "@subframe/core"
import { AddressField } from "../types"
import FieldMarker from "./FieldMarker"
import { TextField } from "@/subframe/components/TextField"
import AddButton from "./AddButton"
import RemoveButton from "./RemoveButton"
import { editAt } from "./tools"

export default function ContactAddressForm(props: {
  onAddButtonClick: () => void,
  onRemoveButtonClick: () => void,
  setAddresses: (addresses: AddressField[]) => void,
  addresses: AddressField[],
  disabled: boolean,
  children: React.ReactNode,
  buttonCollapse: boolean
}) {
  if (props.buttonCollapse)
    return props.children;

  return (
    <div className="flex w-full flex-col items-end justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-end justify-between">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-caption-bold font-caption-bold text-default-font"
            name="FeatherMapPin"
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            Address
          </span>
        </div>
      </div>
      {
        props.addresses.map((address, index) => (
          <div key={index} className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <FieldMarker
                initialize={address.marker.value}
                disabled={props.disabled}
                error={address.marker.error}
                value={address.marker.value}
                onChange={value => props.setAddresses(editAt(props.addresses, index, {
                  field: {...address.field},
                  marker: {value}
                }))}
              />
              <RemoveButton onClick={props.onRemoveButtonClick}/>
            </div>
            {
              ["zipcode", "country", "state", "city", "address"].map((key, j) => (
                <TextField
                  key={j}
                  className="h-auto w-full flex-none"
                  disabled={props.disabled}
                  error={!!address.field.error}
                  helpText={address.field.error ? address.field.error[key] : null}
                >
                  <TextField.Input
                    placeholder={key}
                    value={address.field.value[key === "address" ? "street" : key]}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      props.setAddresses(editAt(props.addresses, index, {
                        marker: {...address.marker},
                        field: {
                          error: {
                            ...address.field.error,
                            [key]: undefined
                          },
                          value: {
                            ...address.field.value,
                            [key]: event.target.value
                          }
                        }
                      }))
                    }
                  />
                </TextField>
              ))
            }
          </div>
        ))
      }
      <AddButton disabled={props.disabled} title="Add Address" onClick={props.onAddButtonClick} />
    </div>
  )
}