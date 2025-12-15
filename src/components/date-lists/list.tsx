import { DateListSettings } from "./date-types";

import { DateListItem } from "./date-types";
import ListItem from "./list-item";

interface ListProps {
    listType: string;
    listItems: DateListItem[];
    latestListItemID: number;
    settings: DateListSettings;
    newListItem: React.RefObject<HTMLLIElement | null> | null;
}

const DateList = (props: ListProps) => {
    const listItemCount = props.listItems.length;

    const itemsSorted = props.settings.settings.listSort === "DESC" ? [...props.listItems].reverse() : props.listItems;
    return (
        <ul className="list-group list-group-flush">
            {listItemCount > 0 &&
                itemsSorted.map((item) => (
                    <ListItem key={item.id} item={item} settings={props.settings} newListItem={item.id === props.latestListItemID ? props.newListItem : null} />
                ))}
        </ul>
    );
};

export default DateList;
