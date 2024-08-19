import { createContext } from "react";
import { ShowAlertFunc } from "./types";

const AlertContext = createContext<ShowAlertFunc>((msg, severity) => {});
export default AlertContext;