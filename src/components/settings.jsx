import DateSettings from "./date-settings";
import ExportSettings from "./export-settings";

const Settings = () => {

  return (
    <div className="app-content settings">
      <DateSettings />
      <ExportSettings />
    </div>
    );
};

export default Settings;