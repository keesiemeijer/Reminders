import i18n from "i18next";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";

import { DateSettingsDefault } from "./default";
import { DateSettings } from "../date-types";
import { isValidDate } from "./validate";

// The next comment is used to trick the vscode i18n ally extension to use the right namespace
// useTranslation("date-lists")

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

interface DateDuration {
    type: string;
    hour: number;
    day: number;
    month: number;
    year: number;
}

interface LocalizedDate {
    day: string;
    month: string;
    year: string;
}

export const dateExists = (date: string, format = "YYYY-MM-DD"): boolean => {
    return dayjs(date, format, true).isValid();
};

export const RelativeDateClass = (date: string): string => {
    if (!isValidDate(date)) {
        return "";
    }

    let dateClass = "future";

    if (dayjs(date).isToday()) {
        dateClass = "today";
    }

    if (dayjs(date).isBefore(dayjs(), "day")) {
        dateClass = "past";
    }

    return dateClass;
};

export const dateAdd = (number: number, type: string, from = ""): string => {
    if ("" !== from && !isValidDate(from)) {
        return "";
    }
    const now = "" !== from ? dayjs(from) : dayjs();
    return now.add(number, type as dayjs.ManipulateType).format("YYYY-MM-DD");
};

export const FormattedRelativeDate = (date: string): string => {
    const settings = DateSettingsDefault;
    return FormattedDate(date, settings);
};

export const FormattedDate = (date: string, settings: DateSettings): string => {
    if (!isValidDate(date)) {
        return "";
    }

    // Can't use the useTranslation hook as this function can be called inside a hook (not allowed)
    const t = i18n.t;
    let dateString = "";

    if (settings.showRelativeDate) {
        const duration = getDurationObject(date);
        const localDate = getLocalizedDate(duration);

        const days = duration.day;
        const months = duration.month;
        const years = duration.year;

        if (0 === years && 0 === months && 0 === days) {
            // Today
            dateString = t("intlRelativeTime-day-auto", { val: 0, ns: "date-lists" });
        } else if (0 !== years && 0 === months && 0 === days) {
            // Relative year
            // Convert past dates back to negative number.
            const relativeYear = duration.type === "past" ? -Math.abs(years) : years;
            dateString = t("intlRelativeTime-year", { val: relativeYear, ns: "date-lists" });
        } else if (0 === years && 0 !== months && 0 === days) {
            // Relative month
            // Convert past dates back to negative number.
            const relativeMonth = duration.type === "past" ? -Math.abs(months) : months;
            dateString = t("intlRelativeTime-month", { val: relativeMonth, ns: "date-lists" });
        } else if (0 === years && 0 === months && 0 !== days) {
            // Relative day
            // Convert past dates back to negative number.
            const relativeDay = duration.type === "past" ? -Math.abs(days) : days;
            dateString = t("intlRelativeTime-day-auto", { val: relativeDay, ns: "date-lists" });
        } else {
            // Relative with multiple date units
            if (years > 0 && months > 0 && days > 0) {
                dateString = t("relative-year-month-day", { ...localDate, ns: "date-lists" });
            } else if (years > 0 && months === 0 && days > 0) {
                dateString = t("relative-year-day", { ...localDate, ns: "date-lists" });
            } else if (years > 0 && months > 0 && days === 0) {
                dateString = t("relative-year-month", { ...localDate, ns: "date-lists" });
            } else if (years === 0 && months > 0 && days > 0) {
                dateString = t("relative-month-day", { ...localDate, ns: "date-lists" });
            }

            // Relative future or past.
            if (duration.type === "past") {
                dateString = t("relative-date-past", { date: dateString, ns: "date-lists" });
            } else {
                dateString = t("relative-date-future", { date: dateString, ns: "date-lists" });
            }
        }
    }

    if (settings.showDate) {
        dateString += " " + dayjs(date).format(settings.dateFormat);
    }

    return dateString.trim();
};

const getDurationObject = (date: string): DateDuration => {
    // Normalize dates
    const relativeDate = dayjs(date + " 12:00");
    const now = dayjs().format("YYYY-MM-DD");
    const today = dayjs(now + " 12:00");

    const duration = dayjs.duration(relativeDate.diff(today));
    const durationObj: DateDuration = {
        type: "future",
        hour: duration.get("hours"),
        day: duration.get("days"),
        month: duration.get("months"),
        year: duration.get("years"),
    };

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

const getLocalizedDate = (date: DateDuration): LocalizedDate => {
    const t = i18n.t;

    let year = t("year-WithCount_one", { count: 1, ns: "date-lists" });
    if (date.year !== 1) {
        year = t("year-WithCount_other", { count: date.year, ns: "date-lists" });
    }

    let month = t("month-WithCount_one", { count: 1, ns: "date-lists" });
    if (date.month !== 1) {
        month = t("month-WithCount_other", { count: date.month, ns: "date-lists" });
    }

    let day = t("day-WithCount_one", { count: 1, ns: "date-lists" });
    if (date.day !== 1) {
        day = t("day-WithCount_other", { count: date.day, ns: "date-lists" });
    }

    return {
        year: year,
        month: month,
        day: day,
    };
};
