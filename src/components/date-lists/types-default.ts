import { DateSettings, DateListItem } from "./types";

// Default date settings values
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

// Defaults date list item values
export const DateListItemDefault: DateListItem = {
    id: 0,
    text: "",
    date: "",
};
