import { IndexedString } from "@/app/(core)/components/drawer/types";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";
import { IconName } from "@subframe/core";

export default function InformationSection(props: { title: string, iconName: IconName, content: IndexedString }) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <span className="text-heading-3 font-heading-3 text-default-font">
        {props.title}
      </span>
      <div className="flex w-full flex-col items-start rounded-md border border-solid">
        {
          Object.keys(props.content).map((it,  index) => (
            <div key={index} className="flex w-full items-center gap-4 border-b px-4 py-4">
              <IconWithBackground icon={props.iconName} />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="text-body font-body text-default-font">
                  {props.content[it]}
                </span>
                <span className="text-caption font-caption text-subtext-color">
                  {it}
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}