import { createContext } from "react";

interface collapseContext {
    collapseLink: React.RefObject<HTMLAnchorElement | null> | null;
    listItemInput: React.RefObject<HTMLInputElement | null> | null;
    container: React.RefObject<HTMLDivElement | null> | null;
}

export const CollapseContext = createContext<collapseContext>({} as collapseContext);
