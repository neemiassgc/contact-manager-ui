import { Alert } from "@/subframe/components/Alert";
import { IconButton } from "@/subframe/components/IconButton";
import { Variant } from "./types";

export default function Notification(props: {
  onDispose: () => void,
  variant?: Variant,
  title: string,
}) {
  setTimeout(props.onDispose, 5000);

  return (
    <Alert
      className="absolute bottom-0 left-0 w-fit mb-5 ml-5 z-10"
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
