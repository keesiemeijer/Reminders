import "./reminder-item.css";

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

import { useDispatch } from "react-redux";
import { removeReminder } from "../features/reminderSlice";

const ReminderItem = (props) => {
  const dispatch = useDispatch();
  const deleteReminder = (e) => {
    dispatch(removeReminder({
      id: props.id
    }))
  };

  dayjs.extend(relativeTime);
  dayjs.extend(isToday);

  let dateClass = 'future';
  let dueDate = dayjs(props.dueDate + ' 23:59').fromNow();

  if (dayjs(props.dueDate).isToday()) {
    dueDate = 'today';
    dateClass = 'today';
  }

  if (dayjs(props.dueDate).isBefore(dayjs(), 'day')) {
    dateClass = 'past';
  }

  return (
    <li key={ props.id } className={ "list-group-item " + dateClass }>
      <div className="list-item">
        <div className="reminder">
          { props.text }
        </div>
        <div className="duedate">
          { dueDate }
        </div>
      </div>
      <button type="button" className="btn-close" aria-label="Delete Reminder" onClick={ deleteReminder }></button>
    </li>
    );
};

export default ReminderItem;
