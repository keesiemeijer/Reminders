import DateSettings from "./date-settings";
import DeleteSettings from "./delete-settings";
import ExportSettings from "./export-settings";
import ImportSettings from "./import-settings";

const Settings = (props: { page: string }) => {
    const settingsPage = props.page;

    return (
        <div className="app-content settings">
            <DateSettings page={settingsPage} />
            {"settings" === settingsPage && <ImportSettings />}
            {"settings" === settingsPage && <ExportSettings />}
            {"settings" === settingsPage && <DeleteSettings />}
        </div>
    );
};

export default Settings;
