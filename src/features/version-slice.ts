import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppVersion } from "../types";

// App version constants
import { APP_VERSION, APP_SCHEMA_VERSION } from "../app/version";

const initialState: AppVersion = {
    app: APP_VERSION,
    schema: APP_SCHEMA_VERSION,
};

const VersionSlice = createSlice({
    name: "version",
    initialState,
    reducers: {
        UpdateSchemaVersion: (state, action: PayloadAction<number>) => {
            state.schema = action.payload;
            return state;
        },
    },
});

// Export reducer actions
export const { UpdateSchemaVersion } = VersionSlice.actions;

// export reducer
export default VersionSlice.reducer;
