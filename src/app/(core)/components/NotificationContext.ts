import { createContext } from "react";
import { Variant } from "./drawer/types";

const NotificationContext = createContext((title: string, variant: Variant) => {});
export default NotificationContext;