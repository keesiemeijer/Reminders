import React, { useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import objectHash from "object-hash";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHistoryState } from "../../app/hooks";

import { TypeSettingContext } from "../../contexts/type-setting-context";
import { EditModeContext } from "../../contexts/edit-mode-context";
import { CollapseContext } from "../../contexts/collapse-context";

import { addTreeListItem, updateTreeListItems } from "../../features/lists-slice";
import { getListItemsByType, getHighesListItemID } from "../../utils/type";
import HistoryNav from "../history-nav";
import CollapseLink from "../collapseLink";
import EditModeToggleLink from "../editModeToggleLink";

import { TreeListType, TreeListSettings, FlattenedItem, TreeItem } from "./types";
import { SortableTree } from "./SortableTree";
import { getTopLevelID } from "./utils/navigation";
import { buildTree, getFlattenedItem } from "./utils/tree";
import TreeNav from "./tree-nav";

const TreeLists = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("common");

    const { editMode } = useContext(EditModeContext);
    const modeClass = editMode ? " edit-mode" : " view-mode";

    const typeSettings: TreeListSettings = useContext(TypeSettingContext);
    const listType = typeSettings.type;

    // get lists from all types
    const listsState = useAppSelector((state) => state.lists);

    // Get valid list items
    const flattenedListItems = getListItemsByType<TreeListType>(listType, listsState);
    const listItemCount = flattenedListItems.length;
    const latestListItemID = getHighesListItemID<TreeItem>(flattenedListItems);

    // Creates the nested tree
    const listItems = buildTree(flattenedListItems);

    // User preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const userScrollSetting: ScrollBehavior = !mediaQuery || mediaQuery.matches ? "instant" : "smooth";

    // App settingss
    const userScrollBehavior = useRef(userScrollSetting);
    const isNewListItemDispatched = useRef(false);

    // History Settings
    const historyButtonClicked = useRef(false);
    const treeLinkClicked = useRef(false);

    // HTML elements
    const collapseLinkRef = useRef<HTMLAnchorElement>(null);
    const listItemInput = useRef<HTMLInputElement>(null);
    const textFormatSelect = useRef<HTMLSelectElement>(null);
    const collapseContainerRef = useRef<HTMLDivElement>(null);
    const newListItem = useRef<HTMLLIElement | null>(null);

    // References for the form collapse link (context)
    const collapse = {
        collapseLink: collapseLinkRef,
        listItemInput: listItemInput,
        container: collapseContainerRef,
    };

    // ID in url params
    const topLevelID = getTopLevelID(flattenedListItems);
    let topLevelText = "";

    if (topLevelID > 0) {
        const topLevelItem = getFlattenedItem(flattenedListItems, topLevelID);
        topLevelText = topLevelItem ? topLevelItem.text : "";
    }

    // History Hook
    let history = useHistoryState(flattenedListItems);
    const { historyState, setHistory, resetHistory } = history;

    if (treeLinkClicked.current) {
        // Reset History with current list items
        resetHistory(flattenedListItems);
        // Set link clicked flag back to false
        treeLinkClicked.current = false;
    }

    // Hook for when history items change
    useEffect(() => {
        if (historyButtonClicked.current) {
            // Redo or Undo button was clicked

            dispatch(updateTreeListItems({ type: listType, items: historyState }));
            historyButtonClicked.current = false;
        }
    }, [objectHash(historyState)]);

    // Hook for when list item count changes
    useEffect(() => {
        if (historyState.length !== listItemCount) {
            // Update history if list item count is not the same as history item count.
            setHistory(flattenedListItems);
        }

        // Scroll to new list item after re-render
        if (isNewListItemDispatched.current && newListItem.current !== null) {
            newListItem.current.scrollIntoView({
                behavior: userScrollBehavior.current,
            });

            // Add class to highlight new list item
            newListItem.current.classList.add("new-list-item");

            setTimeout(function () {
                if (newListItem.current !== null) {
                    // Remove class to highlighted new list item
                    newListItem.current.classList.remove("new-list-item");
                }
                // Remove reference to scrolled element
                newListItem.current = null;
            }, 1000);
        }

        // Reset new list item dispatched flag back to false
        isNewListItemDispatched.current = false;
    }, [listItemCount]);

    const submitListItem = (e: React.FormEvent<HTMLFormElement>) => {
        // Form was submitted
        e.preventDefault();

        // this sucks
        if (listItemInput.current && textFormatSelect.current) {
            let parentID: null | number = null;
            if (topLevelID > 0) {
                parentID = topLevelID;
            }

            // Add new list item
            dispatch(
                addTreeListItem({
                    type: listType,
                    item: {
                        id: 0, // id will be set in reducer
                        text: listItemInput.current.value,
                        collapsed: false,
                        parentID: parentID,
                        depth: 0,
                        index: 0,
                        hasChildren: false,
                        textFormat: parseInt(textFormatSelect.current.value, 10),
                    },
                })
            );

            // Reset form values after adding new list item
            listItemInput.current.value = "";
            textFormatSelect.current.value = "1";

            // Set list item added flag to true (for scrolling in useEffect).
            isNewListItemDispatched.current = true;
        } else {
            alert(t("invalid-list-item-try-again"));
        }
    };

    // Callback function for when Undo or Redo button is clicked
    const handleHistoryUpdate = (action: () => void) => {
        // undo or redo
        action();
        // Set flag to update history
        historyButtonClicked.current = true;
    };

    // Callback function for when tree nav link was clicked
    // Callback function for when tree item link was clicked
    const resetHistoryState = () => {
        // Set flag to reset history
        treeLinkClicked.current = true;
    };

    // Callback function for when items were dragged
    const handleDragUpdate = (items: FlattenedItem[]) => {
        setHistory(items);
        dispatch(updateTreeListItems({ type: listType, items: items }));
    };

    return (
        <CollapseContext.Provider value={collapse}>
            <div className={"tree-lists" + modeClass}>
                <div className="list-item-form">
                    <form className="app-form" onSubmit={submitListItem}>
                        <h1>{typeSettings["title"]}</h1>
                        {typeSettings["description"] && <p className="type-desc">{typeSettings["description"]}</p>}
                        <ul className="nav sub-navigation">
                            <li>
                                <EditModeToggleLink />
                            </li>
                            {editMode && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link nav-settings" to={"/settings?type=" + listType}>
                                            {t("settings")}
                                        </Link>
                                    </li>

                                    <li>
                                        <CollapseLink listItemCount={listItemCount} />
                                    </li>
                                </>
                            )}
                        </ul>
                        {editMode && (
                            <div className="form-group collapse" id="form-collapse" ref={collapseContainerRef}>
                                <div className="form-section">
                                    <label htmlFor="list-item-text" className="form-label">
                                        {t("list-item")}
                                    </label>
                                    <input type="text" id="list-item-text" className="form-control" name="listItemText" ref={listItemInput} required={true} />
                                </div>
                                <div className="form-section">
                                    <label htmlFor="textFormat" className="form-label">
                                        Text Format
                                    </label>
                                    <select id="textFormat" className="form-select" name="textFormat" defaultValue="1" ref={textFormatSelect}>
                                        <option value="1">normal</option>
                                        <option value="2">heading 1</option>
                                        <option value="3">heading 2</option>
                                    </select>
                                </div>
                                <div className="form-section">
                                    <button type="submit" className="btn btn-success">
                                        {t("add-list-item")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="list-nav">
                    {editMode && (
                        <>
                            <TreeNav items={listItems} topLevelID={topLevelID} type={listType} clearHistory={resetHistoryState} />
                            <HistoryNav updateHistory={handleHistoryUpdate} history={history} />
                        </>
                    )}
                </div>

                {topLevelText && <p className="h3">{topLevelText}</p>}
                {listItemCount > 0 && (
                    <SortableTree
                        treeItems={listItems}
                        key={objectHash(flattenedListItems)}
                        type={listType}
                        newListItem={newListItem}
                        latestListItemID={latestListItemID}
                        handleDragUpdate={handleDragUpdate}
                        handleNavigate={resetHistoryState}
                    />
                )}

                {listItemCount === 0 && (
                    <div className="tree-nav">
                        <p>{t("there-are-no-list-items-yet")}</p>
                    </div>
                )}
            </div>
        </CollapseContext.Provider>
    );
};

export default TreeLists;
