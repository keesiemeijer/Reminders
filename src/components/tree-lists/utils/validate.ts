import { isObject } from "../../../utils/utils";
import { FlattenedItem } from "../tree-types";
import { TreeSettings } from "../tree-types";
import { TreeSettingsDefault } from "./default";

// User defined type guard
export const isValidTreeListItem = (item: any): item is FlattenedItem => {
    // Return false if the item is not an object
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    // All properties from FlattenedItem interface
    const booleans = ["collapsed", "hasChildren"];
    const strings = ["text"];
    const numbers = ["id", "depth", "index"];
    const mixed = ["parentID"];

    return strings.concat(booleans, numbers, mixed).every(function (key) {
        if (!item.hasOwnProperty(key)) {
            console.log(key + " - property doesn't exist");
            return false;
        }

        const typeValue = item[key];

        if (strings.indexOf(key) > -1) {
            if (typeof typeValue !== "string" || !typeValue.trim()) {
                console.log(key + " - Not a string or empty string");
                return false;
            }
        }

        if (booleans.indexOf(key) > -1) {
            if (typeof typeValue !== "boolean") {
                console.log(key + " - Not a boolean");
                return false;
            }
        }

        if (numbers.indexOf(key) > -1) {
            if (typeof typeValue === "number") {
                if (!(typeValue >= 0)) {
                    // Numbers need to be greater than 0
                    console.log(key + " - Number not equal or greater than 0");
                    return false;
                }
                if ("id" === key && !(typeValue >= 1)) {
                    // IDs need to be equal or greater than 1
                    console.log(key + " - ID not equal or greater than 1");
                    return false;
                }
            } else {
                console.log(key + " - Not a number");
                return false;
            }
        }

        if (mixed.indexOf(key) > -1) {
            const isNull = typeValue === null;
            const isNumber = typeof typeValue === "number";

            if (!(isNull || (isNumber && typeValue >= 1))) {
                console.log(key + " - Not null OR number not equal or greater than 1");
                return false;
            }
        }
        return true;
    });
};

export const isValidTreeSettingsObject = (item: TreeSettings): boolean => {
    // For now it only checks for object
    if (!isObject(item)) {
        console.log("Tree settings is not an object");
        return false;
    }

    // There are no tree settings yet
    const types: string[] = [];

    // Check type keys is the same as default keys
    const defaults = Object.keys(TreeSettingsDefault);
    if (types.sort().join("") !== defaults.sort().join("")) {
        console.log(types, " - types doesn't match defaults");
        return false;
    }

    return true;
};
