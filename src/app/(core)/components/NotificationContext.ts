import { createContext } from "react";
import { Variant } from "./types";

const NotificationContext = createContext((title: string, variant: Variant) => {});
export default NotificationContext;