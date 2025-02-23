import React, { useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { addDateListItem } from "../../features/lists-slice";
import { getListItemsByType, getHighesListItemID } from "../../utils/type";

import { DateListItem, DateListSettings, DateListType } from "./date-types";
import DateList from "./list";

const DateLists = () => {
    const dispatch = useAppDispatch();

    const typeSettings: DateListSettings = useContext(TypeSettingContext);
    const listType = typeSettings.type;

    // get lists from all types
    const listsState = useAppSelector((state) => state.lists);

    // Get valid list items
    const listItems = getListItemsByType<DateListType>(listType, listsState);
    const latestListItemID = getHighesListItemID<DateListItem>(listItems);
    const listItemCount = listItems.length;

    // User preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const userScrollSetting: ScrollBehavior = !mediaQuery || mediaQuery.matches ? "instant" : "smooth";

    // App settingss
    const userScrollBehavior = useRef(userScrollSetting);
    const isNewListItemDispatched = useRef(false);
    const isFormCollapsedRef = useRef(false);

    // HTML elements
    const listItemInput = useRef<HTMLInputElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);
    const newListItem = useRef<HTMLLIElement | null>(null);
    const collapseContainerRef = useRef<HTMLDivElement>(null);
    const collapseLinkRef = useRef<HTMLAnchorElement>(null);

    const isFormCollapsed = () => {
        return isFormCollapsedRef.current;
    };

    // Function to toggle link between hiding form and adding items
    const toggleLink = (toggle: string) => {
        if (collapseLinkRef.current) {
            if ("hide" === toggle) {
                collapseLinkRef.current.classList.remove("add-items");
                collapseLinkRef.current.classList.add("hide-form");
                collapseLinkRef.current.innerHTML = "Hide Form";
            } else {
                collapseLinkRef.current.classList.add("add-items");
                collapseLinkRef.current.classList.remove("hide-form");
                collapseLinkRef.current.innerHTML = "Add Items";
            }
        }
    };

    useEffect(() => {
        // Hook for Initial render
        if (listItemCount > 0) {
            // There are list items.
            // Form is collapsed if there are list items
            isFormCollapsedRef.current = true;
        } else {
            // There are no list items
            // Hide the collapse link
            if (collapseLinkRef.current) {
                collapseLinkRef.current.style.cssText = "display: none;";
            }
            // Display collapse container
            if (collapseContainerRef.current) {
                collapseContainerRef.current.classList.add("show");
            }
        }

        if (collapseContainerRef.current) {
            // Bootstrap Collapse click events
            collapseContainerRef.current.addEventListener("hide.bs.collapse", () => collapseClickEventCallack(true));
            collapseContainerRef.current.addEventListener("show.bs.collapse", () => collapseClickEventCallack(false));
        }
    }, []);

    const collapseClickEventCallack = (collapsed: boolean) => {
        // Set isFormCollapsedRef
        isFormCollapsedRef.current = collapsed;

        if (collapsed) {
            // The form is collapsed
            // Set collapse link text to "Add List Items"
            toggleLink("add");
        } else {
            if (listItems.length > 0) {
                // The form is displayed and there are list items
                // Set collapse link text to "hide form"
                toggleLink("hide");
            }
        }
    };

    useEffect(() => {
        // Hook for list item count changes
        if (listItemCount === 0) {
            // There are no list items
            if (collapseLinkRef.current) {
                if (!isFormCollapsed()) {
                    // Form is not collapsed
                    // Hide link.
                    collapseLinkRef.current.style.display = "none";
                } else {
                    // Form is collapsed
                    // Trigger click to display form
                    collapseLinkRef.current.click();
                    // Hide link after form is displayed
                    collapseLinkRef.current.style.display = "none";
                }
            }
        } else if (listItemCount > 0) {
            // There are list items
            if (!isFormCollapsed() && collapseLinkRef.current) {
                // Form is not collapsed
                const refStyle = collapseLinkRef.current.style.display;
                if ("none" === refStyle) {
                    // Link is hidden
                    // Unhide link and change text to "hide form"
                    collapseLinkRef.current.style.display = "block";
                    toggleLink("hide");
                }
            }
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
            alert("Invalid List Item. Try again");
        }
    };

    return (
        <div className="date-lists">
            <div className="list-item-form">
                <form className="app-form" onSubmit={submitListItem}>
                    <h1>{typeSettings["title"]}</h1>
                    {typeSettings["description"] && <p className="type-desc">{typeSettings["description"]}</p>}
                    <ul className="nav nav-pills sub-navigation">
                        <li className="nav-item">
                            <Link className="nav-link settings" to={"/settings?type=" + listType}>
                                Settings
                            </Link>
                        </li>

                        <li>
                            <Link
                                className="nav-link add-items"
                                data-bs-toggle="collapse"
                                to="#form-collapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="form-collapse"
                                ref={collapseLinkRef}
                            >
                                Add Items
                            </Link>
                        </li>
                    </ul>

                    <div className="form-group collapse" id="form-collapse" ref={collapseContainerRef}>
                        <div className="form-section">
                            <label htmlFor="list-item-text" className="form-label">
                                List Item
                            </label>
                            <input type="text" id="list-item-text" className="form-control" name="listItemText" ref={listItemInput} required={true} />
                        </div>
                        <div className="form-section">
                            <label htmlFor="list-item-date" className="form-label">
                                List Item Date
                            </label>
                            <input type="date" id="list-item-date" className="form-control" name="listItemDate" ref={dateInput} required={true} />
                        </div>
                        <div className="form-section">
                            <button type="submit" className="btn btn-success">
                                Add List Item
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <DateList listType={listType} settings={typeSettings} listItems={listItems} newListItem={newListItem} latestListItemID={latestListItemID} />
            {listItemCount === 0 && <p>There are no list items yet</p>}
        </div>
    );
};

export default DateLists;
