import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";
import { selectSettings, upateSettings } from "../features/settingsSlice";

const DateSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const [date, setDate] = useState(settings.date);
  const [relativeDate, setRelativeDate] = useState(settings.relativeDate);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);

  const submitSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sanitze date format on submit
    const format = dateFormat.trim();
    setDateFormat(format);

    const setting = {
      relativeDate: relativeDate,
      date: date,
      dateFormat: format,
    };

    // Update settings.
    dispatch(upateSettings(setting));

    // Display message.
    toast.info("Settings Updated");
  };

  return (
    <div className="date-settings">
      <form className="app-form" onSubmit={submitSettings}>
        <h3>Settings</h3>
        <div className="date-options">
          <div className="form-check">
            <input
              id="showRelativeDate"
              name="relativeDate"
              type="checkbox"
              className="form-check-input"
              onChange={(e) => setRelativeDate(e.target.checked)}
              defaultChecked={relativeDate}
            />
            <label htmlFor="showRelativeDate" className="form-check-label">
              Show relative dates (e.g., "in 2 days")
            </label>
          </div>
          <div className="form-check">
            <input id="showDate" name="date" type="checkbox" className="form-check-input" onChange={(e) => setDate(e.target.checked)} defaultChecked={date} />
            <label htmlFor="showDate" className="form-check-label">
              Show dates (with date format below)
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="dateFormat" className="form-label">
            Date Format
          </label>
          <input
            id="dateFormat"
            name="dateFormat"
            type="text"
            className="form-control"
            aria-describedby="formatHelp"
            onChange={(e) => setDateFormat(e.target.value)}
            value={dateFormat}
          />
          <small id="formatHelp" className="form-text text-muted">
            Example format: DD/MM/YYYY. <a href="https://day.js.org/docs/en/display/format">List of all available formats</a>
          </small>
        </div>
        <button type="submit" className="btn btn-primary" aria-label="Update settins">
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default DateSettings;
