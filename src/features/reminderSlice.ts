import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../app/store";
import { isValidReminder } from "../utils/validate";
import { removeIDs } from "../utils/utils";

// Inital state is an array of reminder objects

export interface Reminder {
  id: number;
  text: string;
  dueDate: string;
}

const initialState: Reminder[] = [];

// Helper function to return array of reminders
const getReminders = (state: Reminder[]) => {
  if (Array.isArray(state)) {
    return state;
  }
  return [];
};

// Helper function to get highest reminder ID
const getHighestReminderID = (state: Reminder[]) => {
  const reminders = getReminders(state);
  if (!reminders.length) {
    return 0;
  }
  const ids = reminders.map((a) => a.id);
  return Math.max.apply(null, ids);
};

export const reminderSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<Reminder>) => {
      const reminder: Reminder = action.payload;
      reminder.id = getHighestReminderID(state) + 1;

      if (isValidReminder(reminder)) {
        // Add valid reminder
        state.push(reminder);
      }

      // Sort reminders by date
      state.sort((a, b) => new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf());
    },

    removeReminder: (state, action: PayloadAction<number>) => {
      // Remove reminder
      return state.filter((reminder) => reminder.id !== action.payload);
    },

    importReminders: (state, action: PayloadAction<any[]>) => {
      // Merge payload with state
      let reminders = [...state, ...action.payload];

      // Validate reminders
      reminders = reminders.filter((item) => isValidReminder(item));

      // Removes id and all other properties not needed for a reminder
      reminders = removeIDs(reminders);

      // Removes duplicate reminders
      reminders = reminders.filter((obj1, i, arr) => arr.findIndex((obj2) => ["text", "dueDate"].every((key) => obj2[key] === obj1[key])) === i);

      // Sort reminders by date
      reminders.sort((a, b) => new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf());

      // Add ids back
      state = reminders.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      return state;
    },
  },
});

// Export reducer actions
export const { addReminder, removeReminder, importReminders } = reminderSlice.actions;

// Export reminders
export const selectReminders = (state: RootState) => getReminders(state.reminders);

// Export largest ID
export const selectHighestReminderID = (state: RootState) => getHighestReminderID(state.reminders);

// export reducer
export default reminderSlice.reducer;
