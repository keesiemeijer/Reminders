import { createContext } from "react";

import { DateListSettings } from "../components/date-lists/date-types";

export const TypeSettingContext = createContext<DateListSettings>({} as DateListSettings);
