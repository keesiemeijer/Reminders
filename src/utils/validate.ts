import { dateExists } from "./date";
import { Reminder } from "../features/reminderSlice";
import { Setting } from "../features/settingsSlice";

export const isValidJSON = (value: string) => {
    if (!isString(value)) return false;

    try {
        value = JSON.parse(value);
    } catch (e) {
        return false;
    }

    // True if value is array or object.
    return typeof value === "object" && value !== null;
};

export const isValidReminder = (item: Reminder, checkID = true) => {
    // Return false if the item is not an object
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    // Return false if a property doesn't exist (undefined)
    // Return false if a property value is empty (exceptions: [], {})
    if (!(Boolean(item.text) && Boolean(item.dueDate))) {
        console.log("missing property");
        return false;
    }

    //  Return false if property id doesn't exist
    if (checkID && !Boolean(item.id)) {
        console.log("missing property id");
        return false;
    }

    // Return false if text value is not a string or empty
    if (typeof item.text !== "string" || !item.text) {
        console.log("not a string or empty text");
        return false;
    }

    // Return false if dueDate value is not a string or empty
    if (typeof item.dueDate !== "string" || !item.dueDate) {
        console.log("not a string or empty date");
        return false;
    }

    // Return false if dueDate is an invalid date
    if (!isValidDate(item.dueDate)) {
        console.log("invalid date");
        return false;
    }

    return true;
};

export const isValidSetting = (item: Setting) => {
    // For now only check if it's an object
    return isObject(item);
};

export const isValidDate = (date: string) => {
    if (!isString(date)) return false;

    // Simple regex to weed out invalid date formats (YYYY-MM-DD)
    var regex_date = /^\d{4}\-\d{2}\-\d{2}$/;
    if (!regex_date.test(date)) {
        return false;
    }

    // Check for valid dates
    return dateExists(date);
};

export const isObject = (item: object) => {
    return typeof item === "object" && !Array.isArray(item) && item !== null;
};

export const isString = (item: string) => {
    return typeof item === "string";
};
