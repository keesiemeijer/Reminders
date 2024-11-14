import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { addReminder, selectReminders, selectHighestReminderID } from "../features/reminderSlice";
import ReminderItem from "./reminder-item";

const Reminders = () => {
  const dispatch = useAppDispatch();

  const reminders = useAppSelector(selectReminders);
  const reminderLatestID = useAppSelector(selectHighestReminderID);
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
      alert("Invalid remider. Try again");
    }
  };

  return (
    <div className="app-content reminders">
      <h1>Reminders</h1>
      <form className="app-form" onSubmit={submitReminder}>
        <div className="form-group">
          <label htmlFor="reminder-text">Reminder</label>
          <input type="text" id="reminder-text" className="form-control" name="reminderText" ref={reminderInput} required={true} />
          <label htmlFor="reminder-date">Reminder Date</label>
          <input type="date" id="reminder-date" className="form-control" name="reminderDueDate" ref={dateInput} required={true} />
          <button type="submit" className="btn btn-success">
            Add Reminder
          </button>
        </div>
      </form>
      <ul className="list-group list-group-flush">
        {reminderCount > 0 &&
          reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              text={reminder.text}
              id={reminder.id}
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
