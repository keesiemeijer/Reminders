import { FormattedDate } from "../utils/date";

const ReminderDate = (props: { dueDate: string }) => {
  const dueDate = FormattedDate(props.dueDate);

  return <div className="duedate">{dueDate}</div>;
};

export default ReminderDate;
