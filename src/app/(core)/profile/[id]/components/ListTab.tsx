import { Button } from "@/subframe/components/Button"
import { IconButton } from "@/subframe/components/IconButton"
import SubframeCore from "@subframe/core"
import DeleteWithConfirmation from "../../../components/DeleteWithConfirmation"

export default function ListTab(props: {
  content: {[prop: string]: string},
  onAddButtonClick: () => void,
  onDeleteWithConfirmation: () => void,
  variant: "email" | "phone"
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm w-3/5">
      <div className="flex w-full items-center justify-end">
        <Button
          icon="FeatherPlus"
          onClick={props.onAddButtonClick}
        >
          {props.variant}
        </Button>
      </div>
      <div className="flex w-full flex-col items-start">
        {
          Object.keys(props.content).map((objKey, index) => (
            <div key={index} className="flex w-full items-center gap-4 border-b border-solid border-neutral-border px-4 py-4">
              <SubframeCore.Icon
                className="text-body font-body text-default-font"
                name={props.variant === "email" ? "FeatherAtSign" : "FeatherPhoneCall"}
              />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="line-clamp-1 w-full text-body font-body text-default-font">
                  {props.content[objKey]}
                </span>
                <span className="line-clamp-1 w-full text-caption font-caption text-subtext-color">
                  {objKey}
                </span>
              </div>
              <IconButton
                variant="brand-secondary"
                size="large"
                icon="FeatherEdit"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
              />
              <DeleteWithConfirmation onConfirm={props.onDeleteWithConfirmation} />
            </div>
          ))
        }
      </div>
    </div>
  )
}