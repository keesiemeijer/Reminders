import { isValidReminder } from "./validate";
import { Reminder } from "../features/reminderSlice";

export const removeReminderIDs = (items: Reminder[]) => {
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
