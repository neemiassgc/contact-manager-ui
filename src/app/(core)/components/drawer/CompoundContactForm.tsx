import SubframeCore from "@subframe/core";
import TextInput from "./TextInput";
import RemoveButton from "./RemoveButton";
import AddButton from "./AddButton";
import FieldMarker from "./FieldMarker";
import { StringField } from "../types";
import { editAt } from "./tools";

export default function CompoundContactForm(props: {
  variant: "phone" | "email",
  onAddButtonClick: () => void,
  onRemoveButtonClick: () => void,
  objects: StringField[],
  setObjects: (object: StringField[]) => void,
  disabled: boolean,
  buttonCollapse?: boolean,
  children?: React.ReactNode
}) {
  if (props.buttonCollapse)
    return props.children;

  return (
    <div className="flex w-full flex-col items-end justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full items-end justify-between">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-caption-bold font-caption-bold text-default-font"
            name={props.variant === "phone" ? "FeatherPhone" : "FeatherAtSign"}
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            {capitalize(props.variant)}
          </span>
        </div>
      </div>
      {
        props.objects.map((obj, index) =>(
          <div key={index} className="flex w-full items-center justify-end gap-1 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
            <FieldMarker
              disabled={props.disabled}
              error={obj.marker.error}
              value={obj.marker.value}
              onChange={value =>
                props.setObjects(editAt(props.objects, index, {
                  field: {...obj.field},
                  marker: {value}
                }))
              }
            />
            <TextInput
              error={obj.field.error}
              disabled={props.disabled}
              placeholder={props.variant}
              value={obj.field.value}
              onChange={value =>
                props.setObjects(editAt(props.objects, index, {
                  field: {value},
                  marker: {...obj.marker}
                }))
            }
            />
            {
              (props.variant === "phone" && index + 1 === 1) ? null : <RemoveButton onClick={props.onRemoveButtonClick}/>
            }
          </div>
        ))
      }
      <AddButton disabled={props.disabled} title={capitalize(props.variant)} onClick={props.onAddButtonClick}/>
    </div>
  );
}

function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}