import DateSettings from "./date-settings";
import ExportSettings from "./export-settings";
import ImportSettings from "./import-settings";

const Settings = () => {
  return (
    <div className="app-content settings">
      <DateSettings />
      <ImportSettings />
      <ExportSettings />
    </div>
  );
};

export default Settings;
