import { createSlice } from "@reduxjs/toolkit";
import { isValidSetting } from "../utils/validate";
import type { RootState } from '../app/store'

export interface Setting {
  relativeDate: boolean,
  date: boolean,
  dateFormat: string,
  defaultFormat: string,
}

const initialState: Setting = {
  relativeDate: true,
  date: false,
  dateFormat: "DD/MM/YYYY",
  defaultFormat: "DD/MM/YYYY",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    upateSettings: (state, action) => {
      const payload = isValidSetting(action.payload) ? action.payload : {};

      // Merge payload with state
      return {
        ...state,
        ...payload,
      };
    },
  },
});

// Export reducer actions
export const { upateSettings } = settingsSlice.actions;

// Export settings
export const selectSettings = (state: RootState) => state.settings;

// export reducer
export default settingsSlice.reducer;
