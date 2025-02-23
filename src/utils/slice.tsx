import { ListType } from "../features/lists-slice";
import { isObject } from "./utils";
import { isValidListObject } from "./type";

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
export const getIndexOfListType = <Type extends ListType>(payload: any, state: Type[]): number => {
    const type = getPayloadType(payload);
    if ("" === type) {
        return -1;
    }

    // Get index of list type
    const index = state.map((e) => e.type).indexOf(type);
    if (-1 === index) {
        // type doesn't exist
        return -1;
    }

    if (isValidListObject(state[index])) {
        return index;
    }

    return -1;
};
