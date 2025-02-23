import { FlattenedItem } from "../tree-types";
import { isValidTreeListItem } from "./validate";

export const convertTreeItemsForExport = (items: FlattenedItem[]): FlattenedItem[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    // remove invalid list items (this makes sure text and date properties exist)
    const listItems = items.filter((item) => isValidTreeListItem(item));

    return listItems.map((item) => {
        // Remove collapsed and hasChildren properties
        const { collapsed, hasChildren, ...propsRemovedItem } = item;
        return propsRemovedItem;
    });
};
