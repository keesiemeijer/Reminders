import { ReminderType } from "../features/reminderSlice";
import { isObject, isValidTypeObject } from "../utils/validate";

export const getPayloadType = (payload: any): string => {
    if (!isObject(payload)) {
        return "";
    }

    if (!(payload.hasOwnProperty("type") && payload["type"])) {
        // property type doesn't exist
        return "";
    }

    return typeof payload["type"] === "string" ? payload["type"].trim() : "";
};

// Function to get the state index of a type
export const getIndexOfType = (payload: any, state: ReminderType[]): number => {
    const type = getPayloadType(payload);
    if ("" === type) {
        return -1;
    }

    // Get index of reminder type
    const index = state.map((e) => e.type).indexOf(type);
    if (-1 === index) {
        // type doesn't exist
        return -1;
    }

    if (isValidTypeObject(state[index])) {
        return index;
    }

    return -1;
};
