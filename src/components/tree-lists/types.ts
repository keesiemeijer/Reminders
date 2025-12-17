import type { RefObject } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { ListSettings } from "../../types";

export interface TreeItem {
    id: UniqueIdentifier;
    text: string;
    children: TreeItem[];
    collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem {
    id: UniqueIdentifier;
    parentID: UniqueIdentifier | null;
    text: string;
    children?: TreeItem[];
    hasChildren?: boolean;
    collapsed?: boolean;
    depth: number;
    index: number;
}

export type SensorContext = RefObject<{
    items: FlattenedItem[];
    offset: number;
}>;

export interface TreeSettings {}

export interface TreeListSettings extends ListSettings {
    settings: TreeSettings;
}

// Interface used for tree list types
export interface TreeListType extends TreeListSettings {
    items: FlattenedItem[];
}
