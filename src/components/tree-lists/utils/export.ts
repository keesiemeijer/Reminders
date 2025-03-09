import { FlattenedItem } from "../tree-types";
import { isValidTreeListItem, sanitizeTreeItem } from "./validate";

export const convertTreeItemsForExport = (items: FlattenedItem[]): FlattenedItem[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    // remove invalid list items (this makes sure text and date properties exist)
    let listItems = items.filter((item) => isValidTreeListItem(item));

    // Removes all propperties not in tree item default
    listItems = items.map((item) => sanitizeTreeItem(item));

    return listItems.map((item) => {
        // Remove collapsed and hasChildren properties
        const { collapsed, hasChildren, ...propsRemovedItem } = item;
        return propsRemovedItem;
    });
};
