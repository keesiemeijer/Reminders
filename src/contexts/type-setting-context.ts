import { createContext } from "react";

import { ListSettings } from "../features/lists-slice";

export const TypeSettingContext = createContext<ListSettings>({} as ListSettings);
