import { IndexedAddress } from "@/app/(core)/components/types";
import { IconWithBackground } from "@/subframe/components/IconWithBackground";

export default function AddressSection(props: { content: IndexedAddress }) {
  return (
    <div className="flex w-full flex-col items-start gap-4">
      <span className="text-heading-3 font-heading-3 text-default-font">
        Addresses
      </span>
      <div className="flex w-full flex-col items-start rounded-md border border-solid">
        {
          Object.keys(props.content).map((key, index) => (
            <div key={index} className="flex w-full items-center gap-4 border-b border-solid p-4">
              <IconWithBackground icon="FeatherMapPin" />
              <div className="flex grow shrink-0 basis-0 flex-col items-start">
                <span className="text-body-bold font-body-bold text-default-font">
                  {key}
                </span>
                <span className="text-body font-body text-default-font">
                  {props.content[key].street+", "+props.content[key].zipcode}
                </span>
                <span className="text-body font-body text-default-font">
                  {props.content[key].city+", "+props.content[key].state+", "+props.content[key].country}
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}