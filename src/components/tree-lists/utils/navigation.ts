import { useSearchParams } from "react-router-dom";

import { getIDs } from "../../../utils/utils";
import { FlattenedItem } from "../types";

export const getTopLevelID = (items: FlattenedItem[]): number => {
    const [searchParams] = useSearchParams();

    if (!searchParams.has("id")) {
        return 0;
    }

    // searchParams.get returns string|null
    const searchID = searchParams.get("id");

    // Cast to number
    let topLevelID: number = typeof searchID === "string" ? +searchID : 0;

    // Get all item IDs
    const itemIDs = getIDs<FlattenedItem>(items);

    // Check if top level ID is a number and exist in items
    if (topLevelID && !isNaN(topLevelID) && itemIDs.includes(topLevelID)) {
        return topLevelID;
    }

    return 0;
};

export const getLowestDepth = (items: FlattenedItem[]): number => {
    const depth = items.map((item) => item.depth);
    return Math.min(...depth);
};

export const setDepthToZero = (items: FlattenedItem[]): FlattenedItem[] => {
    const lowestDepth = getLowestDepth(items);

    const newItems = items.map((item) => {
        item.depth = item.depth - lowestDepth;
        return item;
    });

    return newItems;
};
