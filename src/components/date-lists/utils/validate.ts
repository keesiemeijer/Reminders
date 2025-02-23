import { dateExists } from "./date";

import { isObject } from "../../../utils/utils";
import { DateListItem } from "../date-types";
import { DateSettings } from "../date-types";

// User defined type guard
export const isValidDateListItem = (item: any, checkID = true): item is DateListItem => {
    // Return false if the item is not an object
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    // Types
    const strings = ["text", "date"];
    const numbers = ["id"];

    return strings.concat(numbers).every(function (key) {
        if (!checkID && key === "id") {
            return true;
        }

        if (!item.hasOwnProperty(key)) {
            console.log(key + " - property doesn't exist");
            return false;
        }

        const typeValue = item[key];

        if (strings.indexOf(key) > -1) {
            if (typeof typeValue === "string") {
                if (!typeValue.trim()) {
                    console.log(key + " - Empty string");
                    return false;
                }
                if (key === "date" && !isValidDate(typeValue)) {
                    console.log(key + " - Not a valid date");
                    return false;
                }
            } else {
                console.log(key + " - Not a string");
                return false;
            }
        }

        if (numbers.indexOf(key) > -1) {
            if (typeof typeValue === "number") {
                if (key === "id" && !(typeValue >= 1)) {
                    // Numbers need to be greater than 0
                    console.log(key + " - Number not equal or greater than 1");
                    return false;
                }
            } else {
                console.log(key + " - Not a number");
                return false;
            }
        }

        return true;
    });
};

export const isValidDateSettingsObject = (item: DateSettings): boolean => {
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    const strings = ["dateFormat"];
    const booleans = ["showRelativeDate", "showDate"];

    return strings.concat(booleans).every(function (key) {
        if (!item.hasOwnProperty(key)) {
            console.log(key + " - property doesn't exist");
            return false;
        }

        const typeValue = item[key as keyof DateSettings];

        if (strings.indexOf(key) > -1) {
            if (typeof typeValue !== "string") {
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
        return true;
    });
};

export const isValidDate = (date: string): boolean => {
    if (typeof date !== "string" || !date.trim()) {
        return false;
    }

    // Simple regex to weed out invalid date formats (YYYY-MM-DD)
    var regex_date = /^\d{4}\-\d{2}\-\d{2}$/;
    if (!regex_date.test(date)) {
        return false;
    }

    // Check for valid dates
    return dateExists(date);
};
