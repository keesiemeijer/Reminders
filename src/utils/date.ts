import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { SettingsType } from "../features/reminderSlice";

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

export const FormattedDate = (date: string, settings: SettingsType): string => {
    let dueDate = "";

    if (settings.relativeDate) {
        dueDate = dayjs(date + " 23:59").fromNow();
        if (dayjs(date).isToday()) {
            dueDate = "today";
        }
    }

    if (settings.date) {
        dueDate += " " + dayjs(date).format(settings.dateFormat);
    }

    return dueDate.trim();
};

export const dateExists = (date: string, format = "YYYY-MM-DD"): boolean => {
    return dayjs(date, format, true).isValid();
};
