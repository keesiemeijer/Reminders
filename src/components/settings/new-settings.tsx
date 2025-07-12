import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";
import slugify from "@sindresorhus/slugify";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { AddNewListType, ListSettings, ListType } from "../../features/lists-slice";
import { isValidListObject, getListTypes } from "../../utils/type";
import { DateSettingsDefault } from "../date-lists/utils/default";
import { TreeSettingsDefault } from "../tree-lists/utils/default";

import { getGeneralSettings } from "./utils/general-settings";
import { GeneralSettingsInputElements } from "./general-settings-Input-elements";

const NewSettings = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation("new-settings");

    const typeSettings = useContext(TypeSettingContext);
    const listsState = useAppSelector((state) => state.lists);

    let pageTitle = t("add-new-list");
    let settingsInfo = "";
    let buttonText = t("add-new-list");

    // HTML elements
    const titleInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLTextAreaElement>(null);
    const orderInput = useRef<HTMLInputElement>(null);

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

        const slug = slugify(settings["title"]);
        const listTypes = getListTypes(listsState);
        const slugExists = listTypes.includes(slug);

        if (!slug || slugExists) {
            let error = t("title-already-exists");
            if (!slug) {
                error = t("title-is-invalid");
            }

            if (generalSettingsRefs.titleInput.current !== null) {
                generalSettingsRefs.titleInput.current.focus();
                generalSettingsRefs.titleInput.current.classList.add("is-invalid");
            }

            toast.error(
                <p>
                    {t("could-not-add-new-list")}
                    <br />
                    {error}
                </p>
            );
        } else {
            settings["type"] = slug;

            if (settings.orderByDate) {
                settings.settings = DateSettingsDefault;
            } else {
                settings.settings = TreeSettingsDefault;
            }

            // Create a ListType object
            const newSettings: ListType = { ...settings, items: [] };

            if (generalSettingsRefs.titleInput.current !== null) {
                generalSettingsRefs.titleInput.current.classList.remove("is-invalid");
            }

            console.log(settings, "Final settings");
            if (isValidListObject(newSettings)) {
                // Add the new type settings
                dispatch(AddNewListType(newSettings));

                toast.info("New list added");
                navigate("/?type=" + settings["type"]);
            } else {
                // Something went wrong
                toast.error("Could not add list");
            }
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
                    <GeneralSettingsInputElements refs={generalSettingsRefs} newSetting={true} settings={typeSettings} />
                    <div className="form-section">
                        <button type="submit" className="btn btn-primary" aria-label={t("add-new-list")}>
                            {t("add-new-list")}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewSettings;
