import { TreeSettings, FlattenedItem } from "./types";

// No settinngs yet
export const TreeSettingsDefault: TreeSettings = {};

export const FlattenedItemDefault: FlattenedItem = {
    id: 0,
    parentID: null,
    text: "",
    hasChildren: false,
    collapsed: false,
    depth: 0,
    index: 0,
};
