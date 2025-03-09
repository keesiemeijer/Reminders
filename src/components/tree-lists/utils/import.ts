import { getHighesListItemID } from "../../../utils/type";
import { isObject } from "../../../utils/utils";

import { TreeItem, FlattenedItem } from "../tree-types";

import { isValidTreeListItem, sanitizeTreeItem } from "./validate";
import { getChildrenByID } from "./tree";

export const mergeTreeImportItems = (stateItems: any[], importItems: any[]): any[] => {
    let listItems: any[] = [];

    if (!Array.isArray(importItems)) {
        return Array.isArray(stateItems) ? stateItems : listItems;
    }

    // Add required properties back
    listItems = importItems.map((item) => {
        if (isObject(item)) {
            item.collapsed = false;
            item.hasChildren = false;
        }
        return item;
    });

    // Remove invalid items
    listItems = listItems.filter((item) => isValidTreeListItem(item));

    // Remove invalid properties
    listItems = listItems.map((item) => sanitizeTreeItem(item));

    // Sets valid parentID and hasChildren properties
    listItems = setParents(listItems);

    // Get highest id from State
    const highestExistingID = getHighesListItemID<TreeItem>(stateItems);

    // Shift import items ids (to not overwrite existing items)
    listItems = shiftItemsIDs(listItems, highestExistingID);

    return [...stateItems, ...listItems];
};

const setParents = (items: FlattenedItem[]) => {
    const itemIDs = items.map((item) => item.id);

    items = items.map((item) => {
        if (typeof item.parentID === "number") {
            if (!itemIDs.includes(item.parentID)) {
                // Parent doesn't exist in all items
                item.parentID = null;
            }
        } else {
            item.parentID = null;
        }
        return item;
    });

    // Now that parent IDs are set correctly we can set the hasChildren property
    for (let i = 0; i < items.length; i++) {
        const children = getChildrenByID(items, items[i].id);
        items[i].hasChildren = children.length > 0;
    }

    return items;
};

const shiftItemsIDs = (items: FlattenedItem[], shiftBy: number): FlattenedItem[] => {
    const shiftedItems = items.map((item) => {
        item.id = Number(item.id) + shiftBy;
        item.parentID = typeof item.parentID === "number" ? item.parentID + shiftBy : item.parentID;
        return item;
    });

    return shiftedItems;
};
