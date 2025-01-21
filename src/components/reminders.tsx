import React, { useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { addReminder } from "../features/reminderSlice";
import { getHighestReminderID } from "../utils/utils";
import { getRemindersByType } from "../utils/type";
import ReminderItem from "./reminder-item";
import { TypeSettingContext } from "../contexts/type-setting-context";

const Reminders = () => {
    const dispatch = useAppDispatch();

    const typeSettings = useContext(TypeSettingContext);
    const reminderType = typeSettings.type;

    // get reminders from all types
    const allReminders = useAppSelector((state) => state.reminders);

    const reminders = getRemindersByType(reminderType, allReminders);
    const reminderLatestID = getHighestReminderID(reminders);
    const reminderCount = reminders.length;

    // User preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const userScrollSetting: ScrollBehavior = !mediaQuery || mediaQuery.matches ? "instant" : "smooth";

    // App settings
    const newReminderDispatched = useRef(false);
    const userScrollBehavior = useRef(userScrollSetting);

    // HTML elements
    const reminderInput = useRef<HTMLInputElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);
    const newReminderItem = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        if (newReminderDispatched.current && newReminderItem.current !== null) {
            // Scroll to new reminder after re-render
            newReminderItem.current.scrollIntoView({
                behavior: userScrollBehavior.current,
            });

            // Add class to highlight new reminder
            newReminderItem.current.classList.add("newReminder");

            setTimeout(function () {
                if (newReminderItem.current !== null) {
                    // Remove class to highlighted new reminder
                    newReminderItem.current.classList.remove("newReminder");
                }
                // Remove reference to scrolled element
                newReminderItem.current = null;
            }, 1000);
        }

        // Reset reminder added flag back to false
        newReminderDispatched.current = false;
    }, [reminderCount]);

    const submitReminder = (e: React.FormEvent<HTMLFormElement>) => {
        // Form was submitted
        e.preventDefault();

        // For Typescript
        const notNull = reminderInput.current !== null && dateInput.current !== null;

        if (notNull && reminderInput.current.value && dateInput.current.value) {
            // Add new reminder
            dispatch(
                addReminder({
                    type: reminderType,
                    id: 0, // id will be set in reducer
                    text: reminderInput.current.value,
                    dueDate: dateInput.current.value,
                })
            );

            // Reset form values after adding new reminder
            reminderInput.current.value = "";
            dateInput.current.value = "";

            // Set reminder added flag to true (for scrolling in useEffect).
            newReminderDispatched.current = true;
        } else {
            alert("Invalid reminder. Try again");
        }
    };

    return (
        <div className="app-content">
            <div className="reminders-form">
                <form className="app-form" onSubmit={submitReminder}>
                    <h1>{typeSettings["title"]}</h1>
                    {typeSettings["description"] && <p className="type-desc">{typeSettings["description"]}</p>}
                    <ul className="nav nav-pills sub-navigation">
                        <li className="nav-item">
                            <Link className="nav-link settings" to={"/settings?type=" + reminderType}>
                                Settings
                            </Link>
                        </li>
                    </ul>

                    <div className="form-group">
                        <div className="form-section">
                            <label htmlFor="reminder-text" className="form-label">
                                Reminder
                            </label>
                            <input type="text" id="reminder-text" className="form-control" name="reminderText" ref={reminderInput} required={true} />
                        </div>
                        <div className="form-section">
                            <label htmlFor="reminder-date" className="form-label">
                                Reminder Date
                            </label>
                            <input type="date" id="reminder-date" className="form-control" name="reminderDueDate" ref={dateInput} required={true} />
                        </div>
                        <div className="form-section">
                            <button type="submit" className="btn btn-success">
                                Add Reminder
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <ul className="list-group list-group-flush">
                {reminderCount > 0 &&
                    reminders.map((reminder) => (
                        <ReminderItem
                            key={reminder.id}
                            text={reminder.text}
                            id={reminder.id}
                            type={reminderType}
                            settings={typeSettings}
                            dueDate={reminder.dueDate}
                            scrollref={reminder.id === reminderLatestID ? newReminderItem : null}
                        />
                    ))}
            </ul>
            {reminderCount === 0 && <p>There are no reminders yet</p>}
        </div>
    );
};

export default Reminders;
