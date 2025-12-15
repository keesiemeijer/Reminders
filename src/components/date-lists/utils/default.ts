import { DateSettings, DateListItem } from "../date-types";

export const DateSettingsDefault: DateSettings = {
    showRelativeDate: true,
    showDate: false,
    dateFormat: "DD/MM/YYYY",
    usePastDateColor: true,
    pastDateColor: "#ff0000",
    useTodayDateColor: true,
    todayDateColor: "#ff8c00",
    listSort: "ASC",
};

export const DateListItemDefault: DateListItem = {
    id: 0,
    text: "",
    date: "",
};
