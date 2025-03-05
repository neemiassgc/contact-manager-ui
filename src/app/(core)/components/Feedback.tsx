import { Loader } from "@/subframe/components/Loader";
import SubframeCore from "@subframe/core";

export default function Feedback({message, error = false}: {message: string, error?: boolean}) {
  return (
    <div className="flex h-full w-full flex-col items-start gap-4 bg-default-background">
      <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
        <div className="flex flex-col items-center justify-center">
          {
            error ?
            <SubframeCore.Icon
              className="text-body font-body text-default-font"
              name="FeatherAlertTriangle"
            /> :
            <Loader/>
          }
          <span className="text-body font-body text-default-font">{message}</span>
        </div>
      </div>
    </div>
  );
}