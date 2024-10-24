import { useSelector } from "react-redux";
import { selectReminders } from "../features/reminderSlice";
import { ToastContainer, toast } from 'react-toastify';

const ExportSettings = () => {

  const reminders = useSelector(selectReminders);
  let json = JSON.stringify(reminders);

  let button = "";
  let code = "";
  let help = "There are no reminders yet";
  const copySuccess = "Copied data to clipboard";
  const copyError = "Unable to copy data to clipboard";

  const copyReminderData = (e) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(json).then(function() {
        toast.info(copySuccess);
      }, function(err) {
        toast.error(copyError);
      });
    } else {
      toast.error(copyError);
    }
  }

  if (reminders.length > 0) {
    help = "Use the data below to import reminders on another device";
    button = <button type="button" className="btn btn-outline-secondary" aria-label="Copy data to clipboard" onClick={ copyReminderData }>Copy data to clipboard</button>;
    code = <code>{ json }</code>;
  }

  return (
    <div className="export-settings">
      <h3>Export Reminders</h3>
      <p>
        { help }
      </p>
      { button }
      { code }
      <ToastContainer />
    </div>
    );
};

export default ExportSettings;