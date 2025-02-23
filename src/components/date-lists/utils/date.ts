import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { DateListSettings } from "../date-types";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(customParseFormat);

export const RelativeDateClass = (date: string): string => {
    let dateClass = "future";

    if (dayjs(date).isToday()) {
        dateClass = "today";
    }

    if (dayjs(date).isBefore(dayjs(), "day")) {
        dateClass = "past";
    }

    return dateClass;
};

export const FormattedDate = (date: string, settings: DateListSettings): string => {
    let dateString = "";

    if (settings.settings.showRelativeDate) {
        dateString = dayjs(date + " 23:59").fromNow();
        if (dayjs(date).isToday()) {
            dateString = "today";
        }
    }

    if (settings.settings.showDate) {
        dateString += " " + dayjs(date).format(settings.settings.dateFormat);
    }

    return dateString.trim();
};

export const dateExists = (date: string, format = "YYYY-MM-DD"): boolean => {
    return dayjs(date, format, true).isValid();
};
