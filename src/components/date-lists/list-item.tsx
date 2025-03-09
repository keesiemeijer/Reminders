import { useAppDispatch } from "../../app/hooks";
import { removeListItems } from "../../features/lists-slice";
import { DateListSettings } from "./date-types";
import { DateListItem } from "./date-types";
import ListItemDate from "./list-item-date";
import { RelativeDateClass } from "./utils/date";

interface ListItemProps {
    item: DateListItem;
    settings: DateListSettings;
    newListItem: React.RefObject<HTMLLIElement | null> | null;
}

const ListItem = (props: ListItemProps) => {
    const dispatch = useAppDispatch();
    const deleteListItem = (_e: React.MouseEvent<HTMLElement>) => {
        dispatch(removeListItems({ ids: [props.item.id], type: props.settings.type }));
    };

    let dateClass = "";
    if (props.settings.settings.usePastDateColor) {
        dateClass = RelativeDateClass(props.item.date);
    }

    return (
        <li key={props.item.id} className={"list-group-item " + dateClass} ref={props.newListItem}>
            <div className="list-item">
                <div className="list-item-text">{props.item.text}</div>
                <ListItemDate date={props.item.date} settings={props.settings} dateType={dateClass} />
            </div>
            <button type="button" className="delete-item" tabIndex={0} aria-label="Delete List Item" onClick={deleteListItem}></button>
        </li>
    );
};

export default ListItem;
