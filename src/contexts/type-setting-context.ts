import { createContext } from "react";

import { SettingsType } from "../features/reminderSlice";

export const TypeSettingContext = createContext<SettingsType>({} as SettingsType);
