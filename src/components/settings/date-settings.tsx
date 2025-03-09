import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { updateListType, ListSettings } from "../../features/lists-slice";
import { isValidListSettingsObject } from "../../utils/type";
import { DateListSettings } from "../date-lists/date-types";

import { getGeneralSettings } from "./utils/general-settings";
import { GeneralSettingsInputElements } from "./general-settings-Input-elements";
import { ColorPicker } from "../color-picker/color-picker";

const DateFormSettings = () => {
    const dispatch = useAppDispatch();
    const typeSettings = useContext(TypeSettingContext);

    const [pastColor, setPastColor] = useState(typeSettings.settings.pastDateColor);
    const [todayColor, setTodayColor] = useState(typeSettings.settings.todayDateColor);

    let pageTitle = "Settings";
    let settingsInfo = "Settings for list: ";
    let buttonText = "Update Settings";

    // HTML elements
    const titleInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLTextAreaElement>(null);
    const orderInput = useRef<HTMLInputElement>(null);
    const showDateInput = useRef<HTMLInputElement>(null);
    const showRelativeDateInput = useRef<HTMLInputElement>(null);
    const dateFormatInput = useRef<HTMLInputElement>(null);
    const usePastDateColorInput = useRef<HTMLInputElement>(null);
    const useTodayDateColorInput = useRef<HTMLInputElement>(null);

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

        const newDateSettings: any = {
            showRelativeDate: showRelativeDateInput,
            showDate: showDateInput,
            dateFormat: dateFormatInput,
            usePastDateColor: usePastDateColorInput,
            useTodayDateColor: useTodayDateColorInput,
        };

        // Get values from the form elements
        Object.keys(newDateSettings).forEach(function (key) {
            const element = newDateSettings[key];

            // old value
            let value: string | boolean = settings.settings[key];

            if (["showDate", "showRelativeDate", "usePastDateColor", "useTodayDateColor"].includes(key)) {
                // checkbox values
                if (element.current) {
                    // new value
                    value = element.current.checked;
                }
            } else {
                if (element.current) {
                    // new value
                    value = element.current.value.trim();
                    // Update form with trimmed values
                    element.current.value = value;
                }
            }

            // Assign element values
            newDateSettings[key] = value;
        });

        newDateSettings.pastDateColor = pastColor;
        newDateSettings.todayDateColor = todayColor;
        // Merge new date list Settings
        const dateSettings: DateListSettings = { ...settings, settings: newDateSettings };

        console.log(dateSettings, "Final settings");

        if (isValidListSettingsObject(dateSettings)) {
            // Update type settings
            dispatch(updateListType(dateSettings));
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
                    <div className="date-settings">
                        <div className="form-section">
                            <p className="form-label">Date Options</p>
                            <div className="form-check">
                                <input
                                    ref={showRelativeDateInput}
                                    id="showRelativeDate"
                                    name="relativeDate"
                                    type="checkbox"
                                    className="form-check-input"
                                    defaultChecked={typeSettings.settings.showRelativeDate}
                                />
                                <label htmlFor="showRelativeDate" className="form-check-label">
                                    Show relative dates (e.g., "in 2 days")
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    ref={showDateInput}
                                    id="showDate"
                                    name="date"
                                    type="checkbox"
                                    className="form-check-input"
                                    defaultChecked={typeSettings.settings.showDate}
                                />
                                <label htmlFor="showDate" className="form-check-label">
                                    Show dates (with date format below)
                                </label>
                            </div>
                        </div>
                        <div className="form-section">
                            <label htmlFor="dateFormat" className="form-label">
                                Date Format
                            </label>
                            <input
                                ref={dateFormatInput}
                                id="dateFormat"
                                name="dateFormat"
                                defaultValue={typeSettings.settings.dateFormat}
                                type="text"
                                className="form-control"
                                aria-describedby="formatHelp"
                            />
                            <small id="formatHelp" className="form-text text-muted">
                                Example format: DD/MM/YYYY. <a href="https://day.js.org/docs/en/display/format">List of all available formats</a>
                            </small>
                        </div>
                        <div className="form-section">
                            <div className="form-check">
                                <input
                                    ref={usePastDateColorInput}
                                    id="usePastDateColor"
                                    name="usePastDateColor"
                                    type="checkbox"
                                    className="form-check-input"
                                    defaultChecked={typeSettings.settings.usePastDateColor}
                                />
                                <div className="label-color-picker">
                                    <label htmlFor="usePastDateColor" className="form-check-label">
                                        Text color for list items with a past date
                                    </label>
                                    <ColorPicker color={pastColor} onChange={setPastColor} />
                                </div>
                            </div>
                            <div className="form-check">
                                <input
                                    ref={useTodayDateColorInput}
                                    id="useTodayDateColor"
                                    name="useTodayDateColor"
                                    type="checkbox"
                                    className="form-check-input"
                                    defaultChecked={typeSettings.settings.useTodayDateColor}
                                />
                                <div className="label-color-picker">
                                    <label htmlFor="useTodayDateColor" className="form-check-label">
                                        Text color for list items with today's date
                                    </label>
                                    <ColorPicker color={todayColor} onChange={setTodayColor} />
                                </div>
                            </div>
                        </div>
                    </div>
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

export default DateFormSettings;
