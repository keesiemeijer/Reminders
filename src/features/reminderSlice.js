import { createSlice } from "@reduxjs/toolkit";
import { isValidReminder } from "../utils/validate";

// Inital state is an array of reminder objects
const initialState = [];

// Helper function to return array of reminders
const getReminders = (state) => {
  if (Array.isArray(state)) {
    return state;
  }
  return [];
};

// Helper function to get highest reminder ID
const getHighestReminderID = (state) => {
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
    addReminder: (state, action) => {
      const reminder = {
        id: getHighestReminderID(state) + 1,
        text: action.payload.text,
        dueDate: action.payload.dueDate,
      };

      if (isValidReminder(reminder)) {
        // Add reminder
        state.push(reminder);
      }

      // Sort reminders by date
      state.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    },

    removeReminder: (state, action) => {
      // Remove reminder
      return state.filter((reminder) => reminder.id !== action.payload.id);
    },

    importReminders: (state, action) => {
      // Merge payload with state
      let reminders = [...state, ...action.payload];

      // Validate reminders
      reminders = reminders.filter((item) => isValidReminder(item));

      // Remove all properties not needed for a reminder (also removes id)
      reminders = reminders.map((data) => {
        return {
          text: data.text,
          dueDate: data.dueDate,
        };
      });

      // Remove duplicates
      reminders = reminders.filter((obj1, i, arr) => arr.findIndex((obj2) => ["text", "dueDate"].every((key) => obj2[key] === obj1[key])) === i);

      // Sort reminders by date
      reminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
export const selectReminders = (state) => getReminders(state.reminders);

// Export largest ID
export const selectHighestReminderID = (state) => getHighestReminderID(state.reminders);

// export reducer
export default reminderSlice.reducer;
