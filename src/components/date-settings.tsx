import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "@sindresorhus/slugify";

import { useAppDispatch } from "../app/hooks";
import { TypeSettingContext } from "../contexts/type-setting-context";
import { useAppSelector } from "../app/hooks";
import { updateTypeSettings, AddNewTypeSettings } from "../features/reminderSlice";
import { getTypes } from "../utils/type";

const DateSettings = (props: { page: string }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const typeSettings = useContext(TypeSettingContext);
    const allReminders = useAppSelector((state) => state.reminders);
    const settingsPage = props.page;

    // Strings
    let pageTitle = "Settings";
    let settingsInfo = "Settings for list: ";
    let titleInfo = "The title can't be edited";
    let buttonText = "Update Settings";
    let titleDisabled = true;

    if ("add-new" === settingsPage) {
        pageTitle = "Add New List";
        settingsInfo = "";
        titleInfo = "Title for the new list";
        buttonText = "Add New List";
        titleDisabled = false;
    }

    // HTML elements
    const titleInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLTextAreaElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);
    const relativeDateInput = useRef<HTMLInputElement>(null);
    const dateFormatInput = useRef<HTMLInputElement>(null);

    const submitSettings = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newSetting: any = {
            title: titleInput,
            description: descInput,
            relativeDate: relativeDateInput,
            date: dateInput,
            dateFormat: dateFormatInput,
        };

        // Get values from the form elements
        Object.keys(newSetting).forEach(function (key) {
            const element = newSetting[key];
            const notNull = element.current !== null;

            let value: string | boolean;
            if (["date", "relativeDate"].includes(key)) {
                // checkbox values
                value = notNull ? element.current.checked : false;
            } else {
                // input values (trimmed)
                value = notNull ? element.current.value.trim() : "";
                // Update form with trimmed values
                element.current.value = value;
            }

            // Assign element values
            newSetting[key] = value;
        });

        const settings: any = { ...typeSettings, ...newSetting };

        if ("add-new" === settingsPage) {
            const allTypes = getTypes(allReminders);

            let slug = settings["title"];
            let error = "";

            slug = typeof slug === "string" ? slugify(slug).trim() : "";
            const slugExists = allTypes.includes(slug);

            // Invalid title
            if (!slug || slugExists) {
                error = "Title is invalid.";
                if (slugExists) {
                    error = "Title already exists.";
                }

                if (titleInput.current !== null) {
                    titleInput.current.focus();
                    titleInput.current.classList.add("is-invalid");
                }

                toast.error(
                    <p>
                        Could not add new list.
                        <br />
                        {error}
                    </p>
                );
            } else {
                settings["type"] = slug;
                settings["reminders"] = [];

                if (titleInput.current !== null) {
                    titleInput.current.classList.remove("is-invalid");
                }

                console.log(settings, "Final settings");
                // Add the new type settings
                dispatch(AddNewTypeSettings(settings));

                toast.info("New list added");
                navigate("/?type=" + settings["type"]);
            }
        } else {
            console.log(settings, "Final settings");
            // Update type settings
            dispatch(updateTypeSettings(settings));
            // Display message.
            toast.info("Settings Updated");
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
                    <div className="form-section">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            ref={titleInput}
                            id="title"
                            name="title"
                            type="text"
                            defaultValue={typeSettings.title}
                            className="form-control"
                            aria-describedby="titleHelp"
                            disabled={titleDisabled}
                            pattern=".*\S+.*"
                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please provide a title")}
                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                            required={true}
                        />
                        <small id="titleHelp" className="form-text text-muted">
                            {titleInfo}
                        </small>
                    </div>
                    <div className="form-section">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea className="form-control" ref={descInput} id="description" rows={3} defaultValue={typeSettings["description"]} />
                    </div>
                    <div className="form-section">
                        <p className="form-label">Date Options</p>
                        <div className="form-check">
                            <input
                                ref={relativeDateInput}
                                id="showRelativeDate"
                                name="relativeDate"
                                type="checkbox"
                                className="form-check-input"
                                defaultChecked={typeSettings.relativeDate}
                            />
                            <label htmlFor="showRelativeDate" className="form-check-label">
                                Show relative dates (e.g., "in 2 days")
                            </label>
                        </div>
                        <div className="form-check">
                            <input ref={dateInput} id="showDate" name="date" type="checkbox" className="form-check-input" defaultChecked={typeSettings.date} />
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
                            defaultValue={typeSettings["dateFormat"]}
                            type="text"
                            className="form-control"
                            aria-describedby="formatHelp"
                        />
                        <small id="formatHelp" className="form-text text-muted">
                            Example format: DD/MM/YYYY. <a href="https://day.js.org/docs/en/display/format">List of all available formats</a>
                        </small>
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

export default DateSettings;
