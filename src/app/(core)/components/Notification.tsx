import { Alert } from "@/subframe/components/Alert";
import { IconButton } from "@/subframe/components/IconButton";
import { Variant } from "./drawer/types";

export default function Notification(props: {
  onDispose: () => void,
  variant?: Variant,
  title: string,
}) {
  setTimeout(props.onDispose, 2000);

  return (
    <Alert
      variant={props.variant}
      title={props.title}
      actions={
        <IconButton
          size="medium"
          icon="FeatherX"
          onClick={props.onDispose}
        />
      }
    />
  )
}
