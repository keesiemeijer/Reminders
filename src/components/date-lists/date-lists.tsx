import React, { useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CollapseContext } from "../../contexts/collapse-context";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addDateListItem, updateDateListItems } from "../../features/lists-slice";
import { getListItemsByType, getHighesListItemID } from "../../utils/type";
import CollapseLink from "../collapseLink";
import { useHistoryState } from "../../app/hooks";
import HistoryNav from "../history-nav";

import { DateListItem, DateListSettings, DateListType } from "./date-types";
import DateButtons from "./date-buttons";

import DateList from "./list";

const DateLists = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("date-lists");

    const typeSettings: DateListSettings = useContext(TypeSettingContext);
    const listType = typeSettings.type;

    // get lists from all types
    const listsState = useAppSelector((state) => state.lists);

    // Get valid list items
    const listItems: DateListItem[] = getListItemsByType<DateListType>(listType, listsState);
    const latestListItemID = getHighesListItemID<DateListItem>(listItems);
    const listItemCount = listItems.length;

    // User preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const userScrollSetting: ScrollBehavior = !mediaQuery || mediaQuery.matches ? "instant" : "smooth";

    // App settingss
    const userScrollBehavior = useRef(userScrollSetting);
    const isNewListItemDispatched = useRef(false);
    const historyButtonClicked = useRef(false);
    // const isFormCollapsedRef = useRef(false);

    // HTML elements
    const listItemInput = useRef<HTMLInputElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);
    const newListItem = useRef<HTMLLIElement | null>(null);
    const collapseContainerRef = useRef<HTMLDivElement>(null);
    const collapseLinkRef = useRef<HTMLAnchorElement>(null);

    // References for the form collapse link (context)
    const collapse = {
        collapseLink: collapseLinkRef,
        listItemInput: listItemInput,
        container: collapseContainerRef,
    };

    // History Hook
    const history = useHistoryState(listItems);
    const { historyState, setHistory } = history;

    // Hook for when history items change
    useEffect(() => {
        // Hook when history state changes
        if (historyButtonClicked.current) {
            // Redo or Undo button was clicked

            dispatch(updateDateListItems({ type: listType, items: historyState }));
            historyButtonClicked.current = false;
        }
    }, [historyState.length]);

    // Hook for when list item count changes
    useEffect(() => {
        if (historyState.length !== listItemCount) {
            // Update history if items are not the same as history items.
            setHistory(listItems);
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

    // Callback function for when submit button was clicked
    const submitListItem = (e: React.FormEvent<HTMLFormElement>) => {
        // Form was submitted
        e.preventDefault();

        // this sucks
        if (listItemInput.current && dateInput.current) {
            // Add new list item
            dispatch(
                addDateListItem({
                    type: listType,
                    item: {
                        id: 0, // id will be set in reducer
                        text: listItemInput.current.value,
                        date: dateInput.current.value,
                    },
                })
            );

            // Reset form values after adding new list item
            listItemInput.current.value = "";
            dateInput.current.value = "";

            // Set list item added flag to true (for scrolling in useEffect).
            isNewListItemDispatched.current = true;
        } else {
            alert(t("invalid-list-item-try-again"));
        }
    };

    // Callback function for when Undo or Redo button is clicked
    const handleHistoryUpdate = (action: () => void) => {
        // Undo or Redo action.
        action();
        // Set the historyButtonClicked flag to true
        historyButtonClicked.current = true;
    };

    return (
        <CollapseContext.Provider value={collapse}>
            <div className="date-lists">
                <div className="list-item-form">
                    <form className="app-form" onSubmit={submitListItem}>
                        <h1>{typeSettings["title"]}</h1>
                        {typeSettings["description"] && <p className="type-desc">{typeSettings["description"]}</p>}
                        <ul className="nav sub-navigation">
                            <li className="nav-item">
                                <Link className="nav-link nav-settings" to={"/settings?type=" + listType}>
                                    {t("settings")}
                                </Link>
                            </li>
                            <li>
                                <CollapseLink listItemCount={listItemCount} />
                            </li>
                        </ul>

                        <div className="form-group collapse" id="form-collapse" ref={collapseContainerRef}>
                            <div className="form-section">
                                <label htmlFor="list-item-text" className="form-label">
                                    {t("list-item")}
                                </label>
                                <input type="text" id="list-item-text" className="form-control" name="listItemText" ref={listItemInput} required={true} />
                            </div>
                            <div className="form-section">
                                <label htmlFor="list-item-date" className="form-label">
                                    {t("list-item-date")}
                                </label>
                                <input type="date" id="list-item-date" className="form-control" name="listItemDate" ref={dateInput} required={true} />
                            </div>
                            <div className="form-section">
                                <DateButtons dateInput={dateInput} />
                            </div>
                            <div className="form-section">
                                <button type="submit" className="btn btn-success">
                                    {t("add-list-item")}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="list-nav">
                    <HistoryNav updateHistory={handleHistoryUpdate} history={history} />
                </div>
                <DateList listType={listType} settings={typeSettings} listItems={listItems} newListItem={newListItem} latestListItemID={latestListItemID} />
                {listItemCount === 0 && <p>{t("there-are-no-list-items-yet")}</p>}
            </div>
        </CollapseContext.Provider>
    );
};

export default DateLists;
