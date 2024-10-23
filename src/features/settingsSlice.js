import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  relativeDate: true,
  date: false,
  dateFormat: 'DD/MM/YYYY'
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    upateSettings: (state, action) => {
      // Merge payload with state
      return {
        ...state,
        ...action.payload
      };
    }
  }
});

// Export reducer actions
export const {upateSettings} = settingsSlice.actions;

// Export settings
export const selectSettings = state => state.settings;

// export reducer
export default settingsSlice.reducer;