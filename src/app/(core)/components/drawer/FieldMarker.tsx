import { Badge } from "@/subframe/components/Badge";
import { TextField } from "@/subframe/components/TextField";
import SubframeCore from "@subframe/core";

export default function FieldMarker(props: {
  value: string,
  onChange: (value: string) => void,
  error: string | undefined,
  disabled: boolean
}) {
  const checkedError: boolean = props.error !== undefined && props.error.length > 0;

  return (
    <SubframeCore.Popover.Root>
      <SubframeCore.Popover.Trigger asChild={true}>
        <Badge variant={checkedError ? "error" : "neutral"} iconRight="FeatherChevronDown">
          {props.value}
        </Badge>
      </SubframeCore.Popover.Trigger>
      <SubframeCore.Popover.Portal>
        <SubframeCore.Popover.Content
          side="bottom"
          align="center"
          sideOffset={4}
          asChild={true}
        >
          <div className="flex w-36 flex-none items-start rounded-md border border-solid border-neutral-border bg-default-background shadow-lg z-20">
            <TextField icon="FeatherTag" error={checkedError} helpText={props.error} disabled={props.disabled}>
              <TextField.Input
                placeholder={checkedError ? "type here" : props.error}
                value={props.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
              />
            </TextField>
          </div>
        </SubframeCore.Popover.Content>
      </SubframeCore.Popover.Portal>
    </SubframeCore.Popover.Root>
  )
}