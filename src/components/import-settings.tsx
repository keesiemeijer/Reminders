import React, { useRef } from "react";
import { useAppDispatch } from "../app/hooks";
import { importReminders } from "../features/reminderSlice";
import { toast } from "react-toastify";
import { isValidJSON } from "../utils/validate";

const ImportSettings = () => {
  const dispatch = useAppDispatch();
  const importInput = useRef<HTMLTextAreaElement>(null);

  const submitImport = (e: React.FormEvent<HTMLFormElement>) => {
    // Form was submitted
    e.preventDefault();
    let json = "";

    // current' is possibly 'null'
    if (importInput.current !== null) {
      json = importInput.current.value;
    }

    const reminders = json && isValidJSON(json) ? JSON.parse(json) : false;

    if (reminders && Array.isArray(reminders)) {
      dispatch(importReminders(reminders));
      toast.info("Reminders imported");
    } else {
      toast.error("No reminders imported (data invalid)");
    }
  };

  return (
    <div className="import-settings">
      <h3>Import Reminders</h3>
      <p>Import reminders from other devices</p>
      <form className="app-form" onSubmit={submitImport}>
        <div>
          <label htmlFor="importReminders">Reminder data</label>
          <textarea className="form-control" ref={importInput} id="importReminders" rows={6} />
          <button type="submit" className="btn btn-outline-secondary" aria-label="Import reminders">
            Import Reminder Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportSettings;
