import { ListSettings } from "../../features/lists-slice";

// Date list item interface
export interface DateListItem {
    id: number;
    text: string;
    date: string;
}

export interface DateSettings {
    showRelativeDate: boolean;
    showDate: boolean;
    usePastDateColor: boolean;
    pastDateColor: string;
    useTodayDateColor: boolean;
    todayDateColor: string;
    dateFormat: string;
}
export interface DateListSettings extends ListSettings {
    settings: DateSettings;
}

// Interface used for date list types
export interface DateListType extends DateListSettings {
    items: DateListItem[];
}
