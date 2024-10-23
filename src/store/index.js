import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from "redux-persist/lib/storage";
import remindersReducer from "../features/reminderSlice";
import settingsReducer from "../features/settingsSlice";

const persistConfig = {
  key: "root",
  storage,
};

// combine all reducers
const reducers = combineReducers({
  settings: settingsReducer,
  reminders: remindersReducer
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({

    // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);