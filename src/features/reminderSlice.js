import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  reminders: [],
};

// Helper function to return array of reminders
const getReminders = (state) => {
  if (Array.isArray(state.reminders)) {
    return state.reminders;
  }
  return [];
}

// Helper function to get highest reminder ID
const getHighestReminderID = (state) => {
  const reminders = getReminders(state);
  if (!reminders.length) {
    return 0
  }
  const ids = reminders.map(a => a.id);
  return Math.max.apply(null, ids);
}

export const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    addReminder: (state, action) => {
      const reminder = {
        id: getHighestReminderID(state) + 1,
        text: action.payload.text,
        dueDate: action.payload.dueDate
      };

      // Add reminder
      state.reminders.push(reminder);

      // Sort reminders by date
      state.reminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    },
    removeReminder: (state, action) => {
      // Remove reminder
      state.reminders = state.reminders.filter((reminder) => reminder.id !== action.payload.id);
    },
  },
});

// Export reducer actions
export const {addReminder, removeReminder} = reminderSlice.actions;

// Export reminders
export const selectReminders = state => getReminders(state.reminder);

// export reducer
export default reminderSlice.reducer;