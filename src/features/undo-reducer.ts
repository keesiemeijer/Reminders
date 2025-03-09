import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateListItem } from "../components/date-lists/date-types";

interface UseHistoryStateState {
    past: any[];
    present: any;
    future: any[];
}
export const initialUseHistoryStateState: UseHistoryStateState = {
    past: [],
    present: null,
    future: [],
};

export const useHistoryStateReducer = (state: any, action: any) => {
    const { past, present, future } = state;

    if (action.type === "UNDO") {
        return {
            past: past.slice(0, past.length - 1),
            present: past[past.length - 1],
            future: [present, ...future],
        };
    } else if (action.type === "REDO") {
        return {
            past: [...past, present],
            present: future[0],
            future: future.slice(1),
        };
    } else if (action.type === "SET") {
        const { newPresent } = action;

        if (JSON.stringify(action.newPresent) === JSON.stringify(present)) {
            return state;
        }

        return {
            past: [...past, present],
            present: newPresent,
            future: [],
        };
    } else if (action.type === "CLEAR") {
        return {
            ...initialUseHistoryStateState,
            present: action.initialPresent,
        };
    } else if (action.type === "RESET") {
        const { current } = action;

        return {
            past: [],
            present: current,
            future: [],
        };
    } else {
        throw new Error("Unsupported action type");
    }
};
