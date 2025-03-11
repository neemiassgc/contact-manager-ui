import { TextField } from "@/subframe/components/TextField"
import SubframeCore from "@subframe/core"
import { Props } from "../types"

export default function ContactNameForm(props: {
  value: string,
  error?: string,
  onChange: (obj: Props) => void,
  disabled: boolean
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm">
      <div className="flex w-full flex-col items-start">
        <div className="flex items-center justify-center gap-2">
          <SubframeCore.Icon
            className="text-body font-body text-default-font"
            name="FeatherContact"
          />
          <span className="text-caption-bold font-caption-bold text-default-font">
            Contact Name
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
          placeholder="Contact Name"
          value={props.value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange({value: event.target.value})}
        />
      </TextField>
    </div>
  )
}