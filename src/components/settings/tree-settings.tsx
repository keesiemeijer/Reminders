import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { updateListType, ListSettings } from "../../features/lists-slice";
import { getGeneralSettings } from "./utils/general-settings";
import { GeneralSettingsInputElements } from "./general-settings-Input-elements";
import { isValidListSettingsObject } from "../../utils/type";
import { TreeListSettings } from "../tree-lists/tree-types";

const TreeSettings = () => {
    const dispatch = useAppDispatch();
    const typeSettings = useContext(TypeSettingContext);

    let pageTitle = "Settings";
    let settingsInfo = "Settings for list: ";
    let buttonText = "Update Settings";

    // HTML elements
    const titleInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLTextAreaElement>(null);
    const orderInput = useRef<HTMLInputElement>(null);

    // Genneral Settings
    const generalSettingsRefs = {
        titleInput: titleInput,
        descInput: descInput,
        orderInput: orderInput,
    };

    const submitSettings = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Get general setting values
        const generalSettings = getGeneralSettings(typeSettings, generalSettingsRefs);

        // Merge general settings
        const settings: ListSettings = { ...typeSettings, ...generalSettings };

        // Update when needed (You know that feature creep is comming)
        const newTreeSettings: any = {};

        // Merge new tree list settings
        const treeSettings: TreeListSettings = { ...settings, settings: newTreeSettings };

        console.log(treeSettings, "Final settings");
        if (isValidListSettingsObject(treeSettings)) {
            // Update type settings
            dispatch(updateListType(treeSettings));
            // Display message.
            toast.info("Settings Updated");
        } else {
            // Something went wrong
            toast.error("Could not update settings");
        }
    };

    return (
        <div className="date-settings">
            <form className="app-form" onSubmit={submitSettings}>
                <h1>{pageTitle}</h1>
                {settingsInfo && (
                    <p>
                        {settingsInfo} <Link to={"/?type=" + typeSettings.type}>{typeSettings.title}</Link>
                    </p>
                )}
                <div className="form-group">
                    <GeneralSettingsInputElements refs={generalSettingsRefs} newSetting={false} settings={typeSettings} />
                    <div className="form-section">
                        <button type="submit" className="btn btn-primary" aria-label="Update settings">
                            {buttonText}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TreeSettings;
