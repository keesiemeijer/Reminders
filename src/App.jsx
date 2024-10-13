import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addReminder, selectReminders } from "./features/reminderSlice";
import ReminderItem from "./components/reminder-item";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const reminders = useSelector(selectReminders);
  const reminderCount = reminders.length;
  const reminderLatestID = Math.max.apply(null, reminders.map(item => item.id));

  // App user preferences
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scrollBehavior = (!mediaQuery || mediaQuery.matches) ? "instant" : "smooth";

  // App HTML element reference values
  const reminderInput = useRef('');
  const dateInput = useRef('');
  const scrollToRef = useRef(null);

  // App settings reference values
  const reminderAddedRef = useRef(false);
  const scrollBehaviorRef = useRef(scrollBehavior);

  useEffect(() => {
    // Scroll to new reminder after re-render
    if (reminderAddedRef.current && scrollToRef.current) {
      scrollToRef.current.scrollIntoView({
        behavior: scrollBehaviorRef.current
      });

      // Add class to highlight new reminder
      scrollToRef.current.classList.add("newReminder");
      setTimeout(function() {
        // Remove class to highlight new reminder
        scrollToRef.current.classList.remove("newReminder");
        // Remove reference to scrolled element
        scrollToRef.current = null;
      }, 1000);
    }

    // Reset reminder added flag back to false
    reminderAddedRef.current = false;
  }, [reminderCount]);

  const handleAddReminder = (e) => {
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

      // Set add reminder added flag to true (for scrolling in useEffect).
      reminderAddedRef.current = true;
    } else {
      alert('Invalid remider. Try again');
    }
  };

  return (
    <div className="app">
      <h1>Reminders</h1>
      <form className="app-form" onSubmit={ handleAddReminder }>
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
            <ReminderItem key={ reminder.id } text={ reminder.text } id={ reminder.id } dueDate={ reminder.dueDate } scrollref={ (reminder.id === reminderLatestID) ? scrollToRef : null } />
          )) }
      </ul>
      { reminderCount === 0 && <p>There are no reminders yet</p> }
    </div>
    );
}

export default App;