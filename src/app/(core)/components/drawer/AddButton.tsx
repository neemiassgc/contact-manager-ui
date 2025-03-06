import { Button } from "@/subframe/components/Button";
import { IconName } from "@subframe/core";

export default function AddButton(props: {
  title: string,
  onClick: () => void,
  iconRight?: string,
  variant?: "neutral-primary" | "neutral-secondary",
  disabled?: boolean
}) {
  return (
    <Button
      disabled={props.disabled}
      className="h-8 w-full flex-none"
      variant={props.variant ?? "neutral-primary"}
      icon="FeatherPlus"
      iconRight={props.iconRight as IconName}
      onClick={props.onClick}>
      {props.title}
    </Button>
  )
}