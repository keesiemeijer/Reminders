import { useState } from "react";
import { Link } from "react-router-dom";

import { FlattenedItem, TreeItems } from "./tree-types";
import { flattenTree, getParentsOf } from "./utils/tree";
import { isValidTreeListItem } from "./utils/validate";

interface TreeNavProps {
    items: TreeItems;
    topLevelID: number;
    type: string;
}

const TreeNav = (props: TreeNavProps) => {
    const flattenedItems = flattenTree(props.items);
    const [edit, setEdit] = useState(false);

    let topLevelTitle = "";
    let parents: FlattenedItem[] = [];

    if (props.topLevelID > 0) {
        parents = getParentsOf(flattenedItems, props.topLevelID);

        const topLevelItem = flattenedItems.find((item) => props.topLevelID === item.id);
        if (isValidTreeListItem(topLevelItem)) {
            topLevelTitle = topLevelItem.text;
        }
    }

    return (
        <div className="tree-nav">
            {parents.length > 0 && (
                <nav style={{ "--bs-breadcrumb-divider": "'>'" } as React.CSSProperties} aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {parents.length > 0 && (
                            <li className="breadcrumb-item home" key={1}>
                                <Link className="tree-home" to={"/?type=" + props.type}>
                                    <span className="sr-only">Home</span>
                                </Link>
                            </li>
                        )}
                        {parents.length > 0 &&
                            parents.reverse().map((item, index) => {
                                if (props.topLevelID !== item.id) {
                                    return (
                                        <li className="breadcrumb-item" key={index + 2}>
                                            <Link to={"/?type=" + props.type + "&id=" + item.id}>{item.text}</Link>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li className="breadcrumb-item active" aria-current="page" key={index + 2}>
                                            {item.text}
                                        </li>
                                    );
                                }
                            })}
                    </ol>
                    {topLevelTitle && <h5 className="top-level-title">{topLevelTitle}</h5>}
                </nav>
            )}
        </div>
    );
};

export default TreeNav;
