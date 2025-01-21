import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { isValidReminder, isValidTypeObject } from "../utils/validate";
import { removeReminderIDs, getHighestReminderID } from "../utils/utils";
import { getIndexOfType } from "../utils/slice";

export interface Reminder {
    type?: string;
    id: number;
    text: string;
    dueDate: string;
}

export interface ReminderType {
    type: string;
    title: string;
    description: string;
    orderByDate: boolean;
    relativeDate: boolean;
    date: boolean;
    dateFormat: string;
    reminders: Reminder[];
}

// Remindertype without the reminders property
export type SettingsType = Omit<ReminderType, "reminders">;

export const SettingDefault: SettingsType = {
    type: "",
    title: "",
    description: "",
    orderByDate: true,
    relativeDate: true,
    date: false,
    dateFormat: "DD/MM/YYYY",
};

const initialType = {
    type: "reminders",
    title: "Reminders",
    reminders: [],
};

const initialState: ReminderType[] = Array({ ...SettingDefault, ...initialType });

export const reminderSlice = createSlice({
    name: "reminders",
    initialState,
    reducers: {
        updateTypeSettings: (state, action: PayloadAction<SettingsType>) => {
            const index = getIndexOfType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            state[index] = { ...state[index], ...action.payload };

            return state;
        },
        AddNewTypeSettings: (state, action: PayloadAction<ReminderType>) => {
            const newTypeSettings = action.payload;
            if (!isValidTypeObject(newTypeSettings)) {
                return state;
            }

            state.push(newTypeSettings);
        },
        DeleteType: (state, action: PayloadAction<string>) => {
            return state.filter((element) => element.type !== action.payload);
        },
        addReminder: (state, action: PayloadAction<Reminder>) => {
            let reminder: Reminder = action.payload;

            const index = getIndexOfType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            // Add new reminder id
            reminder.id = getHighestReminderID(state[index].reminders) + 1;

            // remove type
            delete reminder.type;

            if (isValidReminder(reminder)) {
                // Add valid reminder
                state[index].reminders.push(reminder);
            }

            state[index].reminders.sort((a, b) => new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf());
        },

        removeReminder: (state, action: PayloadAction<{ type: string; id: number }>) => {
            const index = getIndexOfType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }
            // Update state
            state[index] = { ...state[index], reminders: state[index].reminders.filter((element) => element.id !== action.payload.id) };

            return state;
        },

        importReminders: (state, action: PayloadAction<{ type: string; reminders: any[] }>) => {
            const index = getIndexOfType(action.payload, state);
            if (-1 === index) {
                // Not an existing type
                return state;
            }

            // Merge payload reminders with state reminders
            let reminders = [...state[index]["reminders"], ...action.payload["reminders"]];

            // Get valid reminders (with text and dueDate)
            reminders = reminders.filter((item) => isValidReminder(item, false));

            // Removes id (and all other properties not needed for a reminder)
            reminders = removeReminderIDs(reminders);

            // Removes duplicate reminders
            reminders = reminders.filter((obj1, i, arr) => arr.findIndex((obj2) => ["text", "dueDate"].every((key) => obj2[key] === obj1[key])) === i);

            // Add ids back
            reminders = reminders.map((item, index) => ({
                ...item,
                id: index + 1,
            }));

            // Sort reminders by date
            reminders.sort((a, b) => new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf());

            state[index].reminders = reminders;

            return state;
        },
    },
});

// Export reducer actions
export const { addReminder, removeReminder, importReminders, updateTypeSettings, AddNewTypeSettings, DeleteType } = reminderSlice.actions;

// export reducer
export default reminderSlice.reducer;
