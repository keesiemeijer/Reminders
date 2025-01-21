import { isObject, isValidTypeObject } from "./validate";
import { isValidReminder } from "../utils/validate";

import { Reminder, ReminderType, SettingsType, SettingDefault } from "../features/reminderSlice";

export const getRemindersByType = (reminderType: string, state: ReminderType[]) => {
    let typeReminders: Reminder[] = [];
    if (typeof reminderType !== "string" || !reminderType) {
        return typeReminders;
    }
    // Get type
    let reminders = state.find((x) => x.type === reminderType);

    if (reminders) {
        if (isObject(reminders) && reminders.hasOwnProperty("reminders")) {
            typeReminders = Array.isArray(reminders.reminders) ? reminders.reminders : [];
        }
    }

    // Return valid reminders
    return typeReminders.filter((item) => isValidReminder(item, false));
};

export const getFirstTypeObject = (state: ReminderType[]): ReminderType | false => {
    if (!Array.isArray(state) || !state.length) {
        return false;
    }

    const firstReminderType = state.find(Boolean);
    if (firstReminderType && isValidTypeObject(firstReminderType)) {
        return firstReminderType;
    }

    return false;
};

export const getTypes = (state: ReminderType[]): string[] => {
    if (!Array.isArray(state) || !state.length) {
        return [];
    }

    return state.map((a) => a.type);
};

export const getTypeSettingsObject = (reminderType: string, state: ReminderType[]): SettingsType => {
    if (typeof reminderType !== "string" || !reminderType) {
        return SettingDefault;
    }

    let typeObj = state.find((x) => x.type === reminderType);
    if (typeObj && isValidTypeObject(typeObj)) {
        const { reminders, ...typeSetting } = typeObj;

        return typeSetting;
    }

    return SettingDefault;
};

export const getTypeObject = (reminderType: string, state: ReminderType[]): ReminderType | false => {
    if (typeof reminderType !== "string" || !reminderType) {
        return false;
    }

    let typeObj = state.find((x) => x.type === reminderType);
    if (typeObj && isValidTypeObject(typeObj)) {
        return typeObj;
    }

    return false;
};
