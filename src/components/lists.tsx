import { lazy, useState } from "react";

import { EditModeContext } from "../contexts/edit-mode-context";

// import DateLists from "./date-lists/date-lists";
// import TreeLists from "./tree-lists/tree-lists";

// Import lazy
const DateLists = lazy(() => import("./date-lists/date-lists"));
const TreeLists = lazy(() => import("./tree-lists/tree-lists"));

const Lists = (props: { type: string }) => {
    const [editMode, setEditMode] = useState(true);
    const value = { editMode, setEditMode };
    return (
        <EditModeContext.Provider value={value}>
            <div className="lists">
                {"date" === props.type && <DateLists />}
                {"tree" === props.type && <TreeLists />}
            </div>
        </EditModeContext.Provider>
    );
};

export default Lists;
