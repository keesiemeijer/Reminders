import { useSelector, useDispatch } from "react-redux";
import { selectSettings, upateSettings } from "../features/settingsSlice";

const DateSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  const onChangeDateSettings = (e) => {
    const newSetting = {};
    const settingName = e.target.name;

    if ("relativeDate" === settingName || "date" === settingName) {
      newSetting[settingName] = e.target.checked;
    } else if ("dateFormat" === settingName) {
      newSetting[settingName] = e.target.value.trim();
    }

    // Update settings.
    dispatch(upateSettings(newSetting));
  }

  return (
    <div className="date-settings">
      <form className="app-form">
        <h3>Date Settings</h3>
        <div className="date-options">
          <div className="form-check">
            <input id="showRelativeDate" name="relativeDate" type="checkbox" className="form-check-input" onChange={ onChangeDateSettings } defaultChecked={ settings.relativeDate } />
            <label htmlFor="showRelativeDate" className="form-check-label">
              Show relative date (e.g., "in 2 days")
            </label>
          </div>
          <div className="form-check">
            <input id="showDate" name="date" type="checkbox" className="form-check-input" onChange={ onChangeDateSettings } defaultChecked={ settings.date } />
            <label htmlFor="showDate" className="form-check-label">
              Show date
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="dateFormat" className="form-label">Date Format</label>
          <input id="dateFormat" name="dateFormat" type="text" className="form-control" aria-describedby="formatHelp" onChange={ onChangeDateSettings } value={ settings.dateFormat }
          />
          <small id="formatHelp" className="form-text text-muted">Example format: DD/MM/YYYY. <a href="https://day.js.org/docs/en/display/format">List of all available formats</a></small>
        </div>
      </form>
    </div>
    );
};

export default DateSettings;