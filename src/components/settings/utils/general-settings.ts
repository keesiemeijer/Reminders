import { ListSettings } from "../../../features/lists-slice";

export interface GeneralSettingsRefs {
    titleInput: React.RefObject<HTMLInputElement | null> | null;
    descInput: React.RefObject<HTMLTextAreaElement | null> | null;
    orderInput: React.RefObject<HTMLInputElement | null> | null;
}

type GeneralSettings = Omit<ListSettings, "type" | "settings">;

export const getGeneralSettings = (settings: ListSettings, refs: GeneralSettingsRefs): GeneralSettings => {
    const newSetting: any = {
        title: refs.titleInput,
        description: refs.descInput,
        orderByDate: refs.orderInput,
    };

    // Get values from the form elements
    Object.keys(newSetting).forEach(function (key) {
        const element = newSetting[key];

        // Old value
        let value: string | boolean = settings[key as keyof ListSettings];

        // Set new values
        if (["orderByDate"].includes(key)) {
            // checkbox values
            if (element.current) {
                value = element.current.checked;
            }
        } else {
            if (element.current) {
                value = element.current.value.trim();
                // Update form with trimmed values
                element.current.value = value;
            }
        }
        // Add value to newSetting
        newSetting[key] = value;
    });

    return newSetting;
};
