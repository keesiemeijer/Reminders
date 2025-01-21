import { FormattedDate } from "../utils/date";
import { SettingsType } from "../features/reminderSlice";

const ReminderDate = (props: { dueDate: string; settings: SettingsType }) => {
    const dueDate = FormattedDate(props.dueDate, props.settings);

    return <div className="duedate">{dueDate}</div>;
};

export default ReminderDate;
