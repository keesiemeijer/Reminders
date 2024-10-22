import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addReminder, selectReminders } from "../features/reminderSlice";
import ReminderItem from "./reminder-item";

const Reminders = () => {
  const dispatch = useDispatch();

  const reminders = useSelector(selectReminders);
  const reminderCount = reminders.length;
  const reminderLatestID = Math.max.apply(null, reminders.map(item => item.id));

  // User preferences
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const userScrollSetting = (!mediaQuery || mediaQuery.matches) ? "instant" : "smooth";

  // App settings
  const newReminderDispatched = useRef(false);
  const scrollBehavior = useRef(userScrollSetting);

  // HTML elements
  const reminderInput = useRef('');
  const dateInput = useRef('');
  const newReminderItem = useRef(null);

  useEffect(() => {
    if (newReminderDispatched.current && newReminderItem.current) {
      // Scroll to new reminder after re-render
      newReminderItem.current.scrollIntoView({
        behavior: scrollBehavior.current
      });

      // Add class to highlight new reminder
      newReminderItem.current.classList.add("newReminder");
      setTimeout(function() {
        // Remove class to highlighted new reminder
        newReminderItem.current.classList.remove("newReminder");
        // Remove reference to scrolled element
        newReminderItem.current = null;
      }, 1000);
    }

    // Reset reminder added flag back to false
    newReminderDispatched.current = false;
  }, [reminderCount]);

  const submitReminder = (e) => {
    // Form was submitted
    e.preventDefault();

    if (reminderInput.current.value && dateInput.current.value) {
      // Add new reminder
      dispatch(addReminder({
        text: reminderInput.current.value,
        dueDate: dateInput.current.value
      }));

      // Reset form values after adding new reminder
      reminderInput.current.value = '';
      dateInput.current.value = '';

      // Set reminder added flag to true (for scrolling in useEffect).
      newReminderDispatched.current = true;
    } else {
      alert('Invalid remider. Try again');
    }
  };

  return (
    <div className="app-content reminders">
      <h1>Reminders</h1>
      <form className="app-form" onSubmit={ submitReminder }>
        <div className="form-group">
          <label htmlFor="reminder-text">
            Reminder
          </label>
          <input type="text" id="reminder-text" className="form-control" name="reminderText" ref={ reminderInput } required="required" />
          <label htmlFor="reminder-date">Reminder Date</label>
          <input type="date" id="reminder-date" className="form-control" name="reminderDueDate" ref={ dateInput } required="required" />
          <button type="submit" className="btn btn-success">
            Add Reminder
          </button>
        </div>
      </form>
      <ul className="list-group list-group-flush">
        { (reminderCount > 0) && reminders.map((reminder) => (
            <ReminderItem key={ reminder.id } text={ reminder.text } id={ reminder.id } dueDate={ reminder.dueDate } scrollref={ (reminder.id === reminderLatestID) ? newReminderItem : null } />
          )) }
      </ul>
      { reminderCount === 0 && <p>There are no reminders yet</p> }
    </div>
    );
};

export default Reminders;