import { IconButton } from "@/subframe/components/IconButton";

export default function RemoveButton(props: {onClick: () => void}) {
  return (
    <IconButton
      variant="destructive-tertiary"
      icon="FeatherX"
      onClick={props.onClick}
    />
  )
}