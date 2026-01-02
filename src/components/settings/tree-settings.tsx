import { useContext, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { updateListSettings } from "../../features/lists-slice";
import { getGeneralSettings } from "./utils/general-settings";
import { GeneralSettingsInputElements } from "./general-settings-Input-elements";
import { isValidListSettingsObject } from "../../utils/type";
import { TreeListSettings } from "../tree-lists/types";
import { ListSettings } from "../../types";

const TreeSettings = () => {
    const dispatch = useAppDispatch();
    const typeSettings = useContext(TypeSettingContext);
    const { t } = useTranslation(["settings", "common"]);

    let pageTitle = t("settings", { ns: "common" });
    let buttonText = t("update-settings");

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
            dispatch(updateListSettings(treeSettings));
            // Display message.
            toast.info(t("settings-updated"));
        } else {
            // Something went wrong
            toast.error(t("could-not-update-settings"));
        }
    };

    return (
        <div className="date-settings">
            <form className="app-form" onSubmit={submitSettings}>
                <h1>{pageTitle}</h1>
                <p>
                    {/* https://stackoverflow.com/questions/72030446/react-18-react-i18next-trans-component-interpolation-issue */}
                    <Trans t={t} i18nKey="settings-for-list" values={{ list: typeSettings.title }}>
                        Settings for list: <Link to={"/?type=" + typeSettings.type}>list</Link>
                    </Trans>
                </p>
                <div className="form-group">
                    <GeneralSettingsInputElements refs={generalSettingsRefs} newSetting={false} settings={typeSettings} />
                    <div className="form-section">
                        <button type="submit" className="btn btn-primary" aria-label={t("update-settings")}>
                            {buttonText}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TreeSettings;
