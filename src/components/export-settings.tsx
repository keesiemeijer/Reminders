import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppSelector } from "../app/hooks";
import { TypeSettingContext } from "../contexts/type-setting-context";
import { getRemindersByType } from "../utils/type";
import { removeReminderIDs } from "../utils/utils";

const ExportSettings = () => {
    const typeSettings = useContext(TypeSettingContext);
    const allReminders = useAppSelector((state) => state.reminders);
    const reminders = getRemindersByType(typeSettings["type"], allReminders);

    // Removes the id and all other properties not needed for a reminder
    const remindersWithoutID = removeReminderIDs(reminders);

    let json = JSON.stringify(remindersWithoutID);

    // https://stackoverflow.com/questions/69210695/type-element-is-not-assignable-to-type-string-ts2322
    let button: React.ReactElement | null = null;
    let code: React.ReactElement | null = null;
    let help: React.ReactElement | string = "There are no list items to export yet";

    const copySuccess = "Copied data to clipboard";
    const copyError = "Unable to copy data to clipboard";

    const copyReminderData = (_e: React.MouseEvent<HTMLElement>) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(json).then(
                function () {
                    toast.info(copySuccess);
                },
                function (_err) {
                    toast.error(copyError);
                }
            );
        } else {
            toast.error(copyError);
        }
    };

    if (remindersWithoutID.length > 0) {
        const typeLink = <Link to={"/?type=" + typeSettings["type"]}>{typeSettings["title"]}</Link>;
        help = <>Use the list item data below to import ({typeLink}) list items on to other devices"</>;
        button = (
            <div className="form-section">
                <button type="button" className="btn btn-outline-secondary" aria-label="Copy data to clipboard" onClick={copyReminderData}>
                    Copy list items To Clipboard
                </button>
            </div>
        );
        code = (
            <div className="form-section">
                <code>{json}</code>
            </div>
        );
    }

    return (
        <div className="export-settings">
            <h3>Export List Items</h3>
            <p>{help}</p>
            {code}
            {button}
        </div>
    );
};

export default ExportSettings;
