import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { DateListSettings } from "../date-types";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

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

export const dateAdd = (number: number, type: string): string => {
    return dayjs()
        .add(number, type as dayjs.ManipulateType)
        .format("YYYY-MM-DD");
};

export interface DateDuration {
    type: string;
    hours: number;
    days: number;
    months: number;
    years: number;
}

export const getDurationObject = (date: string): DateDuration => {
    const relDate = dayjs(date).startOf("day").add(12, "hour");
    const now = dayjs().startOf("day").add(12, "hour");

    const duration = dayjs.duration(relDate.diff(now));

    const durationObj: DateDuration = {
        type: "future",
        hours: duration.get("hours"),
        days: duration.get("days"),
        months: duration.get("months"),
        years: duration.get("years"),
    };
    const globalLocaleData = dayjs.localeData();
    console.log(globalLocaleData.longDateFormat("L"), "jdjdj");

    let key: keyof typeof durationObj;
    for (key in durationObj) {
        if (key !== "type" && typeof durationObj[key] === "number" && durationObj[key] < 0) {
            // date in the past
            durationObj["type"] = "past";
            // convert to positive
            durationObj[key] = Math.abs(durationObj[key]);
        }
    }

    return durationObj;
};

export const FormattedDate = (date: string, settings: DateListSettings): string => {
    let dateString = "";

    if (settings.settings.showRelativeDate) {
        if (dayjs(date).isToday()) {
            //dateString = "today";
        }
        dateString = dayjs(date).startOf("day").fromNow();

        const duration = getDurationObject(date);
        const hours = duration.hours;
        const days = duration.days;
        const months = duration.months;
        const years = duration.years;

        const relObj = {
            future: "in %s",
            past: "%s ago",
            h: "%d hour",
            hh: "%d hours",
            d: "% day",
            dd: "%d days",
            M: "%d month",
            MM: "%d months",
            y: "%d year",
            yy: "%d years",
        };

        console.log(hours + " hours, " + days + " days, " + months + " months, " + years + "years");
        let ddateString = "";
        if (0 === days && 0 === months && 0 === years) {
            // today
            dateString = dayjs().fromNow();
        } else {
            // 1 year, 2 months, 3 days ago
            // in 2 months and 1 day
            if (years > 0) {
                ddateString += years === 1 ? "y" : "yy";
                ddateString += months > 0 || days > 0 ? ", " : "";
            }

            if (months > 0) {
                ddateString += months === 1 ? "M" : "MM";
                ddateString += days > 0 ? ", " : "";
            }
            if (days > 0) {
                ddateString += days === 1 ? "d" : "dd";
            }
        }
        console.log(ddateString, "helloodk");
    }

    if (settings.settings.showDate) {
        dateString += " " + dayjs(date).format(settings.settings.dateFormat);
    }

    return dateString.trim();
};

export const dateExists = (date: string, format = "YYYY-MM-DD"): boolean => {
    return dayjs(date, format, true).isValid();
};
