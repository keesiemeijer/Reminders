import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isValidDateListItem } from "../components/date-lists/utils/validate";
import { mergeDateImportItems } from "../components/date-lists/utils/import";
import { DateSettingsDefault } from "../components/date-lists/utils/default";
import { DateListItem } from "../components/date-lists/date-types";

import { isValidTreeListItem } from "../components/tree-lists/utils/validate";
import { mergeTreeImportItems } from "../components/tree-lists/utils/import";
import { updateTreeIndexes } from "../components/tree-lists/utils/tree";
import { FlattenedItem } from "../components/tree-lists/tree-types";

import { isValidListObject, getHighesListItemID } from "../utils/type";
import { getIndexOfListType } from "../utils/slice";

export interface ListSettings {
    type: string;
    title: string;
    description: string;
    orderByDate: boolean;
    settings: any;
}

// Generic interface used in generic functions
export interface ListType extends ListSettings {
    items: any[];
}

export const SettingDefault: ListSettings = {
    type: "",
    title: "",
    description: "",
    orderByDate: true,
    settings: {},
};

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
        updateListType: (state, action: PayloadAction<ListSettings>) => {
            const index = getIndexOfListType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            state[index] = { ...state[index], ...action.payload };

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
                state[index].items.push(listItem);
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
                state[index].items.unshift(listItem);
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

            const treeItems = tree.filter((item) => isValidTreeListItem(item));

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

            const dateItems = items.filter((item) => isValidDateListItem(item));

            state[index] = { ...state[index], items: dateItems };

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
    },
});

// Export reducer actions
export const {
    addDateListItem,
    addTreeListItem,
    removeListItems,
    importDateListItems,
    importTreeListItems,
    updateListType,
    AddNewListType,
    DeleteListType,
    updateTreeListItems,
    updateDateListItems,
} = ListsSlice.actions;

// export reducer
export default ListsSlice.reducer;
