import { DateListItem } from "../date-types";
import { isValidDateListItem } from "./validate";

export const convertDateItemsForExport = (items: DateListItem[]): { text: string; date: string }[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    // remove invalid list items (this makes sure text and date properties exist)
    const listItems = items.filter((item) => isValidDateListItem(item, false));

    // Removes all properties not needed for a list item (also removes id)
    return listItems.map((data) => {
        return {
            text: data.text,
            date: data.date,
        };
    });
};
