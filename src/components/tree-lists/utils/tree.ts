import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import type { FlattenedItem, TreeItem, TreeItems } from "../types";

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

import { getIDs } from "../../../utils/utils";
import { isValidTreeListItem, sanitizeTreeItem } from "./validate";

function getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
}

export function getProjection(items: FlattenedItem[], activeID: UniqueIdentifier, overID: UniqueIdentifier, dragOffset: number, indentationWidth: number) {
    const overItemIndex = items.findIndex(({ id }) => id === overID);
    const activeItemIndex = items.findIndex(({ id }) => id === activeID);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = activeItem.depth + dragDepth;
    const maxDepth = getMaxDepth({
        previousItem,
    });
    const minDepth = getMinDepth({ nextItem });
    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
        depth = maxDepth;
    } else if (projectedDepth < minDepth) {
        depth = minDepth;
    }

    return { depth, maxDepth, minDepth, parentID: getParentID() };

    function getParentID() {
        if (depth === 0 || !previousItem) {
            return null;
        }

        if (depth === previousItem.depth) {
            return previousItem.parentID;
        }

        if (depth > previousItem.depth) {
            return previousItem.id;
        }

        const newParent = newItems
            .slice(0, overItemIndex)
            .reverse()
            .find((item) => item.depth === depth)?.parentID;

        return newParent ?? null;
    }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
    if (previousItem) {
        return previousItem.depth + 1;
    }

    return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
    if (nextItem) {
        return nextItem.depth;
    }

    return 0;
}

function flatten(items: TreeItems, parentID: UniqueIdentifier | null = null, depth = 0): FlattenedItem[] {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
        return [...acc, { ...item, parentID, depth, index } as FlattenedItem, ...flatten(item.children || [], item.id, depth + 1)];
    }, []);
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
    const flattened = flatten(items);

    // Remove child objects and set hasChildren property
    flattened.map((item) => {
        item.hasChildren = false;
        if (item.children && item.children.length) {
            item.hasChildren = true;
        }

        // Flattened items don't need/have property children
        delete item.children;

        return item;
    });
    return flattened;
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
    const root: TreeItem = { id: 0, children: [], text: "", collapsed: false };
    const nodes: Record<string, TreeItem> = { [root.id]: root };

    const items = flattenedItems.map((item) => {
        // Remove properties: hasChildren, index, depth
        const { hasChildren, index, depth, ...cleanItem } = item;
        /// Tree items don't have properties: hasChildren, index, depth
        return { ...cleanItem, children: [] };
    });

    for (const item of items) {
        const { id, children, text, collapsed } = item;
        const parentId = item.parentID ?? root.id;
        const parent = nodes[parentId] ?? findItem(items, parentId);
        nodes[id] = { id, children, text, collapsed };

        // Remove parentID property
        const { parentID, ...cleanItem } = item;

        // Tree items don't have property parentID
        parent.children.push(cleanItem);
    }

    return root.children;
}

export function updateTreeIndexes(flattenedItems: FlattenedItem[]): FlattenedItem[] {
    // Updates all indexes
    return flattenTree(buildTree(flattenedItems));
}

export function findItem(items: TreeItem[], itemID: UniqueIdentifier) {
    return items.find(({ id }) => id === itemID);
}

export function findItemDeep(items: TreeItems, itemID: UniqueIdentifier): TreeItem | undefined {
    for (const item of items) {
        const { id, children } = item;

        if (id === itemID) {
            return item;
        }

        if (children.length) {
            const child = findItemDeep(children, itemID);

            if (child) {
                return child;
            }
        }
    }

    return undefined;
}

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
    const newItems = [];

    for (const item of items) {
        if (item.id === id) {
            continue;
        }

        if (item.children.length) {
            item.children = removeItem(item.children, id);
        }

        newItems.push(item);
    }

    return newItems;
}

export function setProperty<T extends keyof TreeItem>(items: TreeItems, id: UniqueIdentifier, property: T, setter: (value: TreeItem[T]) => TreeItem[T]) {
    for (const item of items) {
        if (item.id === id) {
            item[property] = setter(item[property]);
            continue;
        }

        if (item.children.length) {
            item.children = setProperty(item.children, id, property, setter);
        }
    }

    return [...items];
}

function countChildren(items: TreeItem[], count = 0): number {
    return items.reduce((acc, { children }) => {
        if (children.length) {
            return countChildren(children, acc + 1);
        }

        return acc + 1;
    }, count);
}

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
    const item = findItemDeep(items, id);

    return item ? countChildren(item.children) : 0;
}

export function hasChildren(items: FlattenedItem[], id: UniqueIdentifier) {
    const children = items.filter((item) => item.parentID === id);
    return children.length;
}

export function getFlattenedItem(items: FlattenedItem[], id: UniqueIdentifier): FlattenedItem | false {
    if (!Array.isArray(items) || !items.length) {
        return false;
    }

    const item = items.find((item) => id === item.id);
    if (isValidTreeListItem(item)) {
        return sanitizeTreeItem(item);
    }
    return false;
}

export function getParentsOf(items: FlattenedItem[], id: UniqueIdentifier) {
    let allParents: FlattenedItem[] = [];

    const search = (items: FlattenedItem[], id: UniqueIdentifier) => {
        const parent = items.find((item) => id === item.id);
        if (isValidTreeListItem(parent)) {
            allParents = [...allParents, sanitizeTreeItem(parent)];
            if (parent.parentID) {
                search(items, parent.parentID);
            }
            return allParents;
        }
        return allParents;
    };

    return search(items, id);
}

export function getChildrenByID(items: FlattenedItem[], id: UniqueIdentifier) {
    let allChildItems: FlattenedItem[] = [];

    // recursive function to get all child elements
    const search = (items: FlattenedItem[], id: UniqueIdentifier) => {
        const childItems = items.filter((item) => item.parentID === id);

        if (childItems.length) {
            allChildItems = [...allChildItems, ...childItems];

            // Remove children from items to search (limiting the search scope)
            const childIDs = getIDs<FlattenedItem>(childItems);

            const remainingItems = items.filter((item) => !childIDs.includes(+item.id));

            childItems.map((item) => search(remainingItems, item.id));
            return allChildItems;
        }
        return allChildItems;
    };

    return search(items, id);
}

export function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
    let allChildItems: FlattenedItem[] = [];

    if (ids.length) {
        ids.map((id) => {
            // all children of parent ids
            allChildItems = [...allChildItems, ...getChildrenByID(items, id)];
        });
    }

    if (allChildItems.length) {
        const childIDs = getIDs(allChildItems);

        const remainingItems = items.filter((item) => !childIDs.includes(+item.id));
        return remainingItems;
    }

    return items;
}
