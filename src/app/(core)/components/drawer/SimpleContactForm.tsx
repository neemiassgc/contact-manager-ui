import { TextField } from "@/subframe/components/TextField"
import SubframeCore, { IconName } from "@subframe/core"
import { Base } from "../types"
import RemoveButton from "./RemoveButton"
import AddButton from "./AddButton"

export default function SimpleContactForm(props: {
  value: string,
  error?: string,
  iconName: IconName,
  onChange: (obj: Base) => void,
  title: string,
  onRemoval?: () => void,
  disabled: boolean,
  onButtonCollapse?: () => void,
}) {
  if (props.onButtonCollapse)
    return (
      <AddButton
        disabled={props.disabled}
        title={"Add "+props.title}
        iconRight={props.iconName}
        variant="neutral-secondary"
        onClick={props.onButtonCollapse}
      />
  )

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full flex-col items-start">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-body font-body text-default-font"
            name={props.iconName}
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            {props.title}
          </span>
        </div>
      </div>
      <TextField
        className="h-auto w-full flex-none"
        helpText={props.error}
        error={!!props.error}
        disabled= {props.disabled}
      >
        <TextField.Input
          placeholder={props.title}
          value={props.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange({value: event.target.value})}
        />
      </TextField>
      {
        props.onRemoval && <RemoveButton onClick={props.onRemoval}/>
      }
    </div>
  )
}