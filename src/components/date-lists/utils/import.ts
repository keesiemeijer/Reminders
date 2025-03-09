import { isValidDateListItem, sanitizeDateItem } from "./validate";
import { convertDateItemsForExport } from "./export";

export const mergeDateImportItems = (stateItems: any[], importItems: any[]): any[] => {
    let listItems: any[] = [];

    if (!Array.isArray(importItems)) {
        return Array.isArray(stateItems) ? stateItems : listItems;
    }

    // Merge state itemswith payload
    listItems = [...stateItems, ...importItems];

    // Remove invalid list items
    listItems = listItems.filter((item) => isValidDateListItem(item, false));
    listItems = listItems.map((item) => sanitizeDateItem(item));

    // Removes id (and all other properties not needed for a list item)
    listItems = convertDateItemsForExport(listItems);

    // Removes duplicate listItems
    listItems = listItems.filter((obj1, i, arr) => arr.findIndex((obj2) => ["text", "date"].every((key) => obj2[key] === obj1[key])) === i);

    // Add ids back
    listItems = listItems.map((item, index) => ({
        ...item,
        id: index + 1,
    }));

    return listItems;
};
