import { useAppDispatch } from "../app/hooks";
import { removeReminder } from "../features/reminderSlice";
import { RelativeDateClass } from "../utils/date";
import ReminderDate from "./reminder-date";
import { SettingsType } from "../features/reminderSlice";

interface ReminderItemProps {
    key: number;
    text: string;
    id: number;
    dueDate: string;
    type: string;
    settings: SettingsType;
    scrollref: React.MutableRefObject<HTMLLIElement | null> | null;
}

const ReminderItem = (props: ReminderItemProps) => {
    const dispatch = useAppDispatch();
    const deleteReminder = (_e: React.MouseEvent<HTMLElement>) => {
        dispatch(removeReminder({ id: props.id, type: props.type }));
    };

    const dateClass = RelativeDateClass(props.dueDate);

    return (
        <li key={props.id} className={"list-group-item " + dateClass} ref={props.scrollref}>
            <div className="list-item">
                <div className="reminder">{props.text}</div>
                <ReminderDate dueDate={props.dueDate} settings={props.settings} />
            </div>
            <button type="button" className="btn-close" aria-label="Delete Reminder" onClick={deleteReminder}></button>
        </li>
    );
};

export default ReminderItem;
