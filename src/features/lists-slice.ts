import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListType, ListSettings } from "../types";
import { SettingDefault } from "../types-defaults";

import { isValidDateListItem, sanitizeDateItem } from "../components/date-lists/utils/validate";
import { mergeDateImportItems } from "../components/date-lists/utils/import";
import { DateSettingsDefault } from "../components/date-lists/types-default";
import { DateListItem } from "../components/date-lists/types";

import { isValidTreeListItem, sanitizeTreeItem } from "../components/tree-lists/utils/validate";
import { mergeTreeImportItems } from "../components/tree-lists/utils/import";
import { updateTreeIndexes } from "../components/tree-lists/utils/tree";
import { FlattenedItem } from "../components/tree-lists/types";

import { isValidListObject, getHighesListItemID, sanitizeListSettingObject } from "../utils/type";
import { getIndexOfListType } from "../utils/slice";

const initialType = {
    type: "reminders",
    title: "Reminders",
    items: [],
    settings: DateSettingsDefault,
};

// Create default list type when first using this app
const initialState: ListType[] = Array({ ...SettingDefault, ...initialType });

export const ListsSlice = createSlice({
    name: "lists",
    initialState,
    reducers: {
        updateListSettings: (state, action: PayloadAction<ListSettings>) => {
            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }
            // Remove invalid properties from settings object before updating
            const sanitized = sanitizeListSettingObject(action.payload);

            state[index] = { ...state[index], ...sanitized };

            return state;
        },
        AddNewListType: (state, action: PayloadAction<ListType>) => {
            const newTypeSettings = action.payload;

            if (!isValidListObject(newTypeSettings)) {
                return state;
            }

            state.push(newTypeSettings);
        },
        DeleteListType: (state, action: PayloadAction<string>) => {
            return state.filter((element) => element.type !== action.payload);
        },

        addDateListItem: (state, action: PayloadAction<{ type: string; item: DateListItem }>) => {
            let listItem: DateListItem = action.payload.item;

            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            // Add new listItem id
            listItem.id = getHighesListItemID<DateListItem>(state[index].items) + 1;

            if (isValidDateListItem(listItem)) {
                // Add valid listItem
                state[index].items.push(sanitizeDateItem(listItem));
            }

            state[index].items.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
        },

        addTreeListItem: (state, action: PayloadAction<{ type: string; item: FlattenedItem }>) => {
            let listItem: FlattenedItem = action.payload.item;

            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            // Add new listItem id
            listItem.id = getHighesListItemID<FlattenedItem>(state[index].items) + 1;

            if (isValidTreeListItem(listItem)) {
                state[index].items.unshift(sanitizeTreeItem(listItem));
            }

            // Udates item indexes
            state[index].items = updateTreeIndexes(state[index].items);

            return state;
        },

        updateTreeListItems: (state, action: PayloadAction<{ type: string; items: FlattenedItem[] }>) => {
            let tree: FlattenedItem[] = action.payload.items;

            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            let treeItems = tree.filter((item) => isValidTreeListItem(item));
            treeItems = treeItems.map((item) => sanitizeTreeItem(item));

            state[index] = { ...state[index], items: updateTreeIndexes(treeItems) };

            return state;
        },
        updateDateListItems: (state, action: PayloadAction<{ type: string; items: DateListItem[] }>) => {
            let items: DateListItem[] = action.payload.items;

            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            let dateItems = items.filter((item) => isValidDateListItem(item));
            dateItems = dateItems.map((item) => sanitizeDateItem(item));

            state[index] = { ...state[index], items: dateItems };

            return state;
        },
        updateDateListItemText: (state, action: PayloadAction<{ type: string; id: number; text: string }>) => {
            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            const itemIndex = state[index].items.findIndex((item) => item.id === action.payload.id);
            if (itemIndex === -1) {
                // Item not found
                return state;
            }

            let item = state[index].items[itemIndex];
            item.text = action.payload.text;
            item = sanitizeDateItem(item);

            // Ensure the updated item is still valid
            if (!isValidDateListItem(item)) {
                return state;
            }

            // Uptate the item
            state[index].items[itemIndex] = item;

            return state;
        },
        removeListItems: (state, action: PayloadAction<{ type: string; ids: number[] }>) => {
            const index = getIndexOfListType(action.payload, state);
            const removeIDs = action.payload.ids;
            if (-1 === index || !Array.isArray(removeIDs)) {
                // Not an existing type
                return state;
            }

            // Update state
            state[index] = { ...state[index], items: state[index].items.filter((item) => !removeIDs.includes(item.id)) };

            return state;
        },
        importDateListItems: (state, action: PayloadAction<{ type: string; items: any[] }>) => {
            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            let mergedItems = mergeDateImportItems(state[index]["items"], action.payload.items);
            mergedItems.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

            state[index].items = mergedItems;

            return state;
        },
        importTreeListItems: (state, action: PayloadAction<{ type: string; items: any[] }>) => {
            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            state[index].items = mergeTreeImportItems(state[index]["items"], action.payload.items);

            return state;
        },
        // Should only be used for upgrade purposes
        addPropToSettings: (state, action: PayloadAction<{ propName: string; propValue: any }>) => {
            state.map((listType) => {
                const dateType = listType.hasOwnProperty("orderByDate") && listType.orderByDate;
                if (!dateType) {
                    return listType;
                }

                const settingsExists = listType.hasOwnProperty("settings");
                const propExists = settingsExists && listType.settings.hasOwnProperty(action.payload.propName);
                if (settingsExists && !propExists) {
                    // Add Property that doesn't exist yet in date settings
                    console.log("adding prop:", action.payload.propName);
                    (listType.settings as any)[action.payload.propName] = action.payload.propValue;
                }
                return listType;
            });

            return state;
        },
        // Should only be used for upgrade purposes
        removePropFromSettings: (state, action: PayloadAction<{ propName: string }>) => {
            state.map((listType) => {
                const dateType = listType.hasOwnProperty("orderByDate") && listType.orderByDate;
                if (!dateType || !listType.hasOwnProperty("settings")) {
                    return listType;
                }

                if (listType.settings.hasOwnProperty(action.payload.propName)) {
                    // Remove Property that does exist in date settings
                    console.log("deleting prop:", action.payload.propName);
                    delete (listType.settings as any)[action.payload.propName];
                }
                return listType;
            });

            return state;
        },
    },
});

// Export reducer actions
export const {
    addDateListItem,
    addTreeListItem,
    removeListItems,
    importDateListItems,
    importTreeListItems,
    updateListSettings,
    AddNewListType,
    DeleteListType,
    updateTreeListItems,
    updateDateListItems,
    updateDateListItemText,
    // Should only be used for upgrade purposes
    addPropToSettings,
    removePropFromSettings,
} = ListsSlice.actions;

// export reducer
export default ListsSlice.reducer;
