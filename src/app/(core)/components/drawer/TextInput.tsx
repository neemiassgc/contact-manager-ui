import { TextField } from "@/subframe/components/TextField"

export default function TextInput(props: {
  placeholder: string,
  value: string,
  onChange: (value: string) => void,
  disabled: boolean,
  error?: string,
}) {
  return (
    <TextField className="h-auto grow shrink-0 basis-0"
      helpText={props.error}
      error={!!props.error}
      disabled={props.disabled}>
      <TextField.Input
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
      />
    </TextField>
  )
}