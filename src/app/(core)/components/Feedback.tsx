import { Loader } from "@/subframe/components/Loader";
import SubframeCore from "@subframe/core";

export default function Feedback({ message, error = false, fullScreen = false }: {
  message: string,
  error?: boolean,
  fullScreen?: boolean
}) {

  const loader = (
    <div className="flex flex-col items-center justify-center w-full">
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
  )

  return fullScreen ?
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
      {loader}
    </div> : loader
}