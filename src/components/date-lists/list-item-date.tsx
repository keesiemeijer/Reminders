import { DateListSettings } from "./date-types";
import { FormattedDate } from "./utils/date";

const ListItemDate = (props: { date: string; settings: DateListSettings }) => {
    const date = FormattedDate(props.date, props.settings);

    return <div className="list-item-date">{date}</div>;
};

export default ListItemDate;
