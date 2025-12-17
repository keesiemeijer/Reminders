import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FlattenedItem, TreeItems } from "./types";
import { flattenTree, getParentsOf } from "./utils/tree";

interface TreeNavProps {
    items: TreeItems;
    topLevelID: number;
    type: string;
    clearHistory: () => void;
}

const TreeNav = (props: TreeNavProps) => {
    const { t } = useTranslation("tree-lists");
    const flattenedItems = flattenTree(props.items);

    let parents: FlattenedItem[] = [];

    if (props.topLevelID > 0) {
        parents = getParentsOf(flattenedItems, props.topLevelID);
    }
    const visible = parents.length > 0 ? " visible" : "";
    return (
        <div className={"tree-nav" + visible}>
            {parents.length > 0 && (
                <nav style={{ "--bs-breadcrumb-divider": "'>'" } as React.CSSProperties} aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {parents.length > 0 && (
                            <li className="breadcrumb-item home" key={1}>
                                <Link className="tree-home" to={"/?type=" + props.type} onClick={props.clearHistory}>
                                    <span className="sr-only">{t("home")}</span>
                                </Link>
                            </li>
                        )}
                        {parents.length > 0 &&
                            parents.reverse().map((item, index) => {
                                if (props.topLevelID !== item.id) {
                                    return (
                                        <li className="breadcrumb-item" key={index + 2}>
                                            <Link to={"/?type=" + props.type + "&id=" + item.id} onClick={props.clearHistory}>
                                                {item.text}
                                            </Link>
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
                </nav>
            )}
        </div>
    );
};

export default TreeNav;
