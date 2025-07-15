import { DateListSettings } from "./date-types";
import { FormattedDate } from "./utils/date";
import { isValidHex } from "../../utils/utils";

const ListItemDate = (props: { date: string; settings: DateListSettings; dateType: string }) => {
    const date = FormattedDate(props.date, props.settings.settings);

    const pastDatecolor = props.settings.settings.pastDateColor;
    const usePastColor = props.settings.settings.usePastDateColor;
    const isPastDate = props.dateType === "past";

    let style = {};
    if (isPastDate && usePastColor && isValidHex(pastDatecolor)) {
        style = {
            color: pastDatecolor,
        };
    }

    const todayDatecolor = props.settings.settings.todayDateColor;
    const useTodayColor = props.settings.settings.useTodayDateColor;
    const isToday = props.dateType === "today";

    if (isToday && useTodayColor && isValidHex(todayDatecolor)) {
        style = {
            color: todayDatecolor,
        };
    }

    return (
        <div className="list-item-date" style={style}>
            {date}
        </div>
    );
};

export default ListItemDate;
