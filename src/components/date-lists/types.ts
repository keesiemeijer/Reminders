import { ListSettings } from "../../types";

// Interface for date settings
export interface DateSettings {
    showRelativeDate: boolean;
    showDate: boolean;
    usePastDateColor: boolean;
    pastDateColor: string;
    useTodayDateColor: boolean;
    todayDateColor: string;
    dateFormat: string;
    listSort: "ASC" | "DESC";
}

// Interface for date list type settings
export interface DateListSettings extends ListSettings {
    settings: DateSettings;
}

// Interface for date list types
export interface DateListType extends DateListSettings {
    items: DateListItem[];
}

// Interface for date list items
export interface DateListItem {
    id: number;
    text: string;
    date: string;
}
