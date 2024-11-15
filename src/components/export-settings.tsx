import { useAppSelector } from "../app/hooks";
import { selectReminders } from "../features/reminderSlice";
import { toast } from "react-toastify";
import { removeReminderIDs } from "../utils/utils";

const ExportSettings = () => {
    const reminders = useAppSelector(selectReminders);

    // Removes the id and all other properties not needed for a reminder
    const remindersWithoutID = removeReminderIDs(reminders);

    let json = JSON.stringify(remindersWithoutID);

    // https://stackoverflow.com/questions/69210695/type-element-is-not-assignable-to-type-string-ts2322
    let button: React.ReactElement | null = null;
    let code: React.ReactElement | null = null;

    let help = "There are no reminders yet";
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
        help = "Use the reminder data below to import reminders on other devices";
        button = (
            <button type="button" className="btn btn-outline-secondary" aria-label="Copy data to clipboard" onClick={copyReminderData}>
                Copy Reminder Data To Clipboard
            </button>
        );
        code = <code>{json}</code>;
    }

    return (
        <div className="export-settings">
            <h3>Export Reminders</h3>
            <p>{help}</p>
            {code}
            {button}
        </div>
    );
};

export default ExportSettings;
