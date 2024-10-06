import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addReminder, selectReminders } from "./features/reminderSlice";
import ReminderItem from "./components/reminder-item";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const reminders = useSelector(selectReminders);
  const reminderCount = reminders.length;

  // Used below to reset form after successfully adding a reminder.
  // https://stackoverflow.com/questions/54895883/reset-to-initial-state-with-react-hooks/
  const initialState = {
    reminderText: "",
    reminderDueDate: "",
  };

  const [{reminderText, reminderDueDate}, setState] = useState(initialState);

  const onChange = e => {
    const {name, value} = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();

    if (reminderText && reminderDueDate) {
      dispatch(addReminder({
        text: reminderText,
        dueDate: reminderDueDate
      }));
      setState({
        ...initialState
      });
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
          <input type="text" id="reminder-text" className="form-control" value={ reminderText } name="reminderText" onChange={ onChange } required="required" />
          <label htmlFor="reminder-date">Reminder Date</label>
          <input type="date" id="reminder-date" className="form-control" value={ reminderDueDate } name="reminderDueDate" onChange={ onChange } required="required"
          />
          <button type="submit" className="btn btn-success">
            Add Reminder
          </button>
        </div>
      </form>
      <ul className="list-group list-group-flush">
        { (reminderCount > 0) && reminders.map((reminder) => (
            <ReminderItem key={ reminder.id } text={ reminder.text } id={ reminder.id } dueDate={ reminder.dueDate } />
          )) }
      </ul>
      { reminderCount === 0 && <p>There are no reminders yet</p> }
    </div>
    );
}

export default App;