import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useTranslation } from "react-i18next";

import { DateListSettings } from "./date-lists/date-types";
import { updateListSettings } from "../features/lists-slice";
import { isValidListSettingsObject } from "../utils/type";

interface SortButtonProps {
    settings: DateListSettings;
}

const SortButton = (props: SortButtonProps) => {
    const { t } = useTranslation("common");
    const dispatch = useAppDispatch();

    const typeSettings: DateListSettings = props.settings;
    const [sort, setSort] = useState(typeSettings.settings.listSort);

    const ToggleSortOrder = (_e: React.MouseEvent<HTMLElement>) => {
        const newSortOrder = sort === "ASC" ? "DESC" : "ASC";
        const updatedSettings = { ...typeSettings.settings, listSort: newSortOrder };
        const newTypeSettings = { ...typeSettings, settings: updatedSettings };

        if (isValidListSettingsObject(newTypeSettings)) {
            // Update listSort setting in redux store
            dispatch(updateListSettings(newTypeSettings));
        }
        // Update local sort state
        setSort(newSortOrder);
    };

    return (
        <button
            type="button"
            className={`sort-button sort-button-${sort}`}
            tabIndex={0}
            aria-label={t("sort-list")}
            title={t("sort-list")}
            onClick={ToggleSortOrder}
        ></button>
    );
};

export default SortButton;
