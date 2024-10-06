import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import reminderReducer from "../features/reminderSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reminderReducer);

export const store = configureStore({
  reducer: {
    reminder: persistedReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({

    // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);