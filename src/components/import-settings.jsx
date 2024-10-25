import { useRef } from "react";
import { useDispatch } from "react-redux";
import { importReminders } from "../features/reminderSlice";
import { ToastContainer, toast } from 'react-toastify';
import { isValidJSON } from "../utils/validate";

const ImportSettings = () => {
  const dispatch = useDispatch();
  const importInput = useRef('');

  const submitImport = (e) => {
    // Form was submitted
    e.preventDefault();

    let json = importInput.current.value;
    json = json && isValidJSON(json) ? JSON.parse(json) : false;

    if (json && Array.isArray(json)) {
      dispatch(importReminders(json));
      toast.info("Reminders imported");
    } else {
      toast.error("No reminders imported (data invalid)");
    }
  }

  return (
    <div className="import-settings">
      <h3>Import Reminders</h3>
      <p>Import reminders from other devices</p>
      <form className="app-form" onSubmit={ submitImport }>
        <div>
          <label htmlFor="importReminders">Reminder data</label>
          <textarea className="form-control" id="importReminders" rows="6" ref={ importInput } />
          <button type="button" type="submit" className="btn btn-outline-secondary" aria-label="Import reminders">Import Reminder Data</button>
        </div>
        <ToastContainer />
      </form>
    </div>
    );

}

export default ImportSettings;