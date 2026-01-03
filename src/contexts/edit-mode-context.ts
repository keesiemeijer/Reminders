import { createContext } from "react";
interface editModeContext {
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditModeContext = createContext<editModeContext>({} as editModeContext);
