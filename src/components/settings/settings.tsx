import { useContext } from "react";

import { TypeSettingContext } from "../../contexts/type-setting-context";

//import GeneralSettings from "./general-settings";
import DateSettings from "./date-settings";
import TreeSettings from "./tree-settings";
import DeleteSettings from "./delete-settings";
import ExportSettings from "./export-settings";
import ImportSettings from "./import-settings";
import NewSettings from "./new-settings";

const Settings = (props: { page: string }) => {
    const settingsPage = props.page;
    const typeSettings = useContext(TypeSettingContext);
    let pageType = "";
    if ("add-new" !== settingsPage) {
        pageType = typeSettings.orderByDate ? "date" : "tree";
    }

    return (
        <div className="settings">
            {"add-new" === settingsPage && <NewSettings />}
            {"tree" === pageType && <TreeSettings />}
            {"date" === pageType && <DateSettings />}
            {"settings" === settingsPage && <ImportSettings />}
            {"settings" === settingsPage && <ExportSettings />}
            {"settings" === settingsPage && <DeleteSettings />}
        </div>
    );
};

export default Settings;
