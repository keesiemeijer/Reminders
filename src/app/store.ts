import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import listsReducer from "../features/lists-slice";
import versionReducer from "../features/version-slice";
const persistConfig = {
    key: "root",
    storage,
};

// combine all reducers
const reducers = combineReducers({
    lists: listsReducer,
    version: versionReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];
