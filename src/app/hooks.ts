import { useReducer, useRef, useCallback } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";
import { initialUseHistoryStateState, useHistoryStateReducer } from "../features/undo-reducer";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useHistoryState(initialPresent = {}) {
    const initialPresentRef = useRef(initialPresent);

    const [state, dispatch] = useReducer(useHistoryStateReducer, {
        ...initialUseHistoryStateState,
        present: initialPresentRef.current,
    });

    const canUndo = state.past.length !== 0;
    const canRedo = state.future.length !== 0;

    const undoHistory = useCallback(() => {
        if (canUndo) {
            dispatch({ type: "UNDO" });
        }
    }, [canUndo]);

    const redoHistory = useCallback(() => {
        if (canRedo) {
            dispatch({ type: "REDO" });
        }
    }, [canRedo]);

    const setHistory = useCallback((newPresent: any) => dispatch({ type: "SET", newPresent }), []);

    const resetHistory = useCallback((current: any) => dispatch({ type: "RESET", current }), []);

    const clearHistory = useCallback(() => dispatch({ type: "CLEAR", initialPresent: initialPresentRef.current }), []);

    return { historyState: state.present, setHistory, undoHistory, redoHistory, clearHistory, resetHistory, canUndo, canRedo };
}
