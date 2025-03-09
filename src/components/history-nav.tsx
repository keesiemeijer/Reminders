interface HistoryNavProps {
    updateHistory: (action: () => void) => void;
    history: {
        historyState: any;
        setHistory: (newPresent: any) => void;
        undoHistory: () => void;
        redoHistory: () => void;
        clearHistory: () => void;
        resetHistory: (current: any) => void;
        canUndo: boolean;
        canRedo: boolean;
    };
}

const HistoryNav = (props: HistoryNavProps) => {
    let undoClass = "undo-action";
    let redoClass = "redo-action";

    undoClass += props.history.canUndo ? "" : " disabled";
    redoClass += props.history.canRedo ? "" : " disabled";

    let visible = true;
    if (!props.history.canUndo && !props.history.canRedo) {
        undoClass += " hidden";
        redoClass += " hidden";
        visible = false;
    } else if (props.history.canUndo && !props.history.canRedo) {
        redoClass += " hidden";
    }
    const containerClass = visible ? " visible" : "";

    return (
        <div className={"history-nav" + containerClass}>
            <button disabled={!props.history.canUndo} className={undoClass} onClick={() => props.updateHistory(props.history.undoHistory)}>
                Undo
            </button>
            <button disabled={!props.history.canRedo} className={redoClass} onClick={() => props.updateHistory(props.history.redoHistory)}>
                Redo
            </button>
        </div>
    );
};
export default HistoryNav;
