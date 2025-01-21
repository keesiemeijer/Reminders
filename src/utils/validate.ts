import { dateExists } from "./date";
import { Reminder, ReminderType } from "../features/reminderSlice";

export const isValidJSON = (value: string): boolean => {
    if (typeof value !== "string" || !value) {
        return false;
    }

    try {
        value = JSON.parse(value);
    } catch (e) {
        return false;
    }

    // True if value is array or object.
    return typeof value === "object" && value !== null;
};

export const isValidTypeObject = (item: ReminderType): boolean => {
    // Return false if the item is not an object
    if (!isObject(item)) {
        console.log("not an object");
        return false;
    }

    // All types
    const strings = ["type", "title", "dateFormat"];
    const booleans = ["orderByDate", "relativeDate", "date"];
    const arrays = ["reminders"];

    return strings.concat(booleans, arrays).every(function (key) {
        if (!item.hasOwnProperty(key)) {
            console.log("property doesn't exist");
            return false;
        }

        if (strings.indexOf(key) > -1) {
            if (typeof item[key as keyof ReminderType] !== "string") {
                console.log("not a string");
                return false;
            }
        }

        if (booleans.indexOf(key) > -1) {
            if (typeof item[key as keyof ReminderType] !== "boolean") {
                console.log("not a boolean");
                return false;
            }
        }

        if (arrays.indexOf(key) > -1) {
            if (!Array.isArray(item[key as keyof ReminderType])) {
                console.log("not an array");
                return false;
            }
        }

        return true;
    });
};

export const isValidReminderType = (reminderType: string, state: ReminderType[]): boolean => {
    if (typeof reminderType !== "string" || !reminderType) {
        return false;
    }

    // find type in state
    let typeObj = state.find((x) => x.type === reminderType);
    if (typeObj && isValidTypeObject(typeObj)) {
        return true;
    }

    return false;
};

export const isValidReminder = (item: Reminder, checkID = true): boolean => {
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

export const isValidDate = (date: string): boolean => {
    if (typeof date !== "string" || !date) {
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

export const isObject = (item: any) => {
    return typeof item === "object" && !Array.isArray(item) && item !== null && item !== undefined;
};
