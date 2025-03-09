import { ListSettings, SettingDefault, ListType } from "../features/lists-slice";
import { isValidDateListItem, isValidDateSettingsObject, sanitizeDateItem } from "../components/date-lists/utils/validate";
import { isValidTreeListItem, isValidTreeSettingsObject, sanitizeTreeItem } from "../components/tree-lists/utils/validate";
import { isObject } from "./utils";
import { DateListItem } from "../components/date-lists/date-types";
import { FlattenedItem } from "../components/tree-lists/tree-types";

export const getListItemsByType = <Type extends ListType>(listType: string, state: Type[]): any[] => {
    // Returns a valid type object or false
    let typeObject = getListObject(listType, state);
    if (!typeObject) {
        return [];
    }

    let items: any = [];
    if (typeObject.orderByDate) {
        items = typeObject.items.filter((item) => isValidDateListItem(item));
        items = items.map((item: DateListItem) => sanitizeDateItem(item));
    } else {
        items = typeObject.items.filter((item) => isValidTreeListItem(item));
        items = items.map((item: FlattenedItem) => sanitizeTreeItem(item));
    }

    // Return validated list items only
    return items;
};

export const getFirstListObject = <Type extends ListType>(state: Type[]): Type | false => {
    if (!Array.isArray(state) || !state.length) {
        return false;
    }

    const firstType = state.find(Boolean);
    if (firstType && isValidListObject(firstType)) {
        return firstType;
    }

    return false;
};

export const getListTypes = <Type extends ListType>(state: Type[]): string[] => {
    if (!Array.isArray(state) || !state.length) {
        return [];
    }

    return state.map((a) => a.type);
};

export const getListSettings = <Type extends ListType>(listType: string, state: Type[]): ListSettings => {
    let typeObject = getListObject(listType, state);

    if (!typeObject) {
        return SettingDefault;
    }
    // Remove items from list object
    const { items, ...typeSetting } = typeObject;

    return typeSetting;
};

export const getListObject = <Type extends ListType>(listType: string, state: Type[]): Type | false => {
    if (typeof listType !== "string" || !listType) {
        return false;
    }

    if (!Array.isArray(state) || !state.length) {
        return false;
    }

    let typeObj = state.find((x) => x.type === listType);
    if (typeObj && isValidListObject(typeObj)) {
        return typeObj;
    }

    return false;
};

export const isValidListSettingsObject = (item: ListSettings): boolean => {
    // Return false if the item is not an object
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    // All types from the interface SettingsType
    const strings = ["type", "title", "description"];
    const booleans = ["orderByDate"];
    const objects = ["settings"];

    const validSetting = strings.concat(booleans, objects).every(function (key) {
        if (!item.hasOwnProperty(key)) {
            console.log(key + " - property doesn't exist");
            return false;
        }

        const typeValue = item[key as keyof ListSettings];

        if (strings.indexOf(key) > -1) {
            if (typeof typeValue === "string") {
                if (["type", "title"].includes(key) && !typeValue.trim) {
                    console.log(key + " - empty string");
                    return false;
                }
            } else {
                console.log(key + " - not a string");
                return false;
            }
        }

        if (booleans.indexOf(key) > -1) {
            if (typeof typeValue !== "boolean") {
                console.log(key + " - not a boolean");
                return false;
            }
        }

        if (objects.indexOf(key) > -1) {
            if (!isObject(typeValue)) {
                return false;
            }
        }

        return true;
    });

    if (validSetting) {
        if (item.orderByDate) {
            return isValidDateSettingsObject(item.settings);
        } else {
            return isValidTreeSettingsObject(item.settings);
        }
    }

    return validSetting;
};

export const isValidListObject = <Type extends ListType>(item: Type): boolean => {
    // Return false if the item is not an object
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    if (!item.hasOwnProperty("items")) {
        console.log("items - property doesn't exist");
        return false;
    }

    if (!Array.isArray(item.items)) {
        console.log("items - not an array");
        return false;
    }

    // Remove items property
    const { items, ...listSettings } = item;

    return isValidListSettingsObject(listSettings);
};

export const isValidListType = <Type extends ListType>(listType: string, state: Type[]): boolean => {
    // returns a valid type object (with all it's properties) or false
    return Boolean(getListObject(listType, state));
};

// Helper function to get highest list item ID
export const getHighesListItemID = <Type extends { id: any; text: string }>(items: Type[]): number => {
    if (!Array.isArray(items) || !items.length) {
        return 0;
    }
    const ids = items.map((a) => a.id);
    return Math.max.apply(null, ids);
};
