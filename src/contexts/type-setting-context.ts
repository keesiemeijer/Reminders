import { createContext } from "react";

import { ListSettings } from "../types";

export const TypeSettingContext = createContext<ListSettings>({} as ListSettings);
