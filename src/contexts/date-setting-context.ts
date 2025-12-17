import { createContext } from "react";

import { DateListSettings } from "../components/date-lists/types";

export const TypeSettingContext = createContext<DateListSettings>({} as DateListSettings);
