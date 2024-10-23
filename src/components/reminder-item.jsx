import "./reminder-item.css";

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

import { useDispatch } from "react-redux";
import { removeReminder } from "../features/reminderSlice";
import ReminderDate from "./reminder-date";

import { RelativeDateClass } from "./date";

const ReminderItem = (props) => {
  const dispatch = useDispatch();
  const deleteReminder = (e) => {
    dispatch(removeReminder({
      id: props.id
    }))
  };

  const dateClass = RelativeDateClass(props.dueDate);

  return (
    <li key={ props.id } className={ "list-group-item " + dateClass } ref={ props.scrollref }>
      <div className="list-item">
        <div className="reminder">
          { props.text }
        </div>
        <ReminderDate dueDate={ props.dueDate } />
      </div>
      <button type="button" className="btn-close" aria-label="Delete Reminder" onClick={ deleteReminder }></button>
    </li>
    );
};

export default ReminderItem;
