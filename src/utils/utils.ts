import { isValidReminder } from "./validate";
import { Reminder } from "../features/reminderSlice";

export const removeReminderIDs = (items: Reminder[]): { text: string; dueDate: string }[] => {
    if (!Array.isArray(items)) {
        return [];
    }

    // remove invalid reminders (this makes sure text and dueDate properties exist)
    const reminders = items.filter((item) => isValidReminder(item, false));

    // Removes all properties not needed for a reminder (also removes id)
    return reminders.map((data) => {
        return {
            text: data.text,
            dueDate: data.dueDate,
        };
    });
};

// Helper function to get highest reminder ID
export const getHighestReminderID = (items: Reminder[]): number => {
    if (!Array.isArray(items) || !items.length) {
        return 0;
    }
    const ids = items.map((a) => a.id);
    return Math.max.apply(null, ids);
};

export const removeTrailingSlashes = (value: string): string => {
    return value.replace(/\/+$/, "");
};
