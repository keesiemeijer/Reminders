import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Trans, useTranslation } from "react-i18next";

import { useAppSelector } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { TreeListType } from "../tree-lists/tree-types";
import { DateListType } from "../date-lists/date-types";
import { getListItemsByType } from "../../utils/type";
import { convertDateItemsForExport } from "../date-lists/utils/export";
import { convertTreeItemsForExport } from "../tree-lists/utils/export";

const ExportSettings = () => {
    const typeSettings = useContext(TypeSettingContext);
    const listsState = useAppSelector((state) => state.lists);
    const { t } = useTranslation("settings");

    let listItems: any;
    let listItemsWithoutID: any;
    if (typeSettings.orderByDate) {
        // Todo: fetch items by TreeListType
        listItems = getListItemsByType<DateListType>(typeSettings["type"], listsState);
        // Removes id and all other properties not needed for a Date list item
        listItemsWithoutID = convertDateItemsForExport(listItems);
    } else {
        listItems = getListItemsByType<TreeListType>(typeSettings["type"], listsState);
        // Removes collapsed, hasChildren and all other properties not needed for a Date list item
        listItemsWithoutID = convertTreeItemsForExport(listItems);
    }

    let json = JSON.stringify(listItemsWithoutID);

    // https://stackoverflow.com/questions/69210695/type-element-is-not-assignable-to-type-string-ts2322
    let button: React.ReactElement | null = null;
    let code: React.ReactElement | null = null;
    let help: React.ReactElement | string = t("there-are-no-list-items-to-export-yet");

    const copySuccess = t("copied-data-to-clipboard");
    const copyError = t("unable-to-copy-data-to-clipboard");

    const copyListItemData = (_e: React.MouseEvent<HTMLElement>) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(json).then(
                function () {
                    toast.info(copySuccess);
                },
                function (_err) {
                    toast.error(copyError);
                }
            );
        } else {
            toast.error(copyError);
        }
    };

    if (listItemsWithoutID.length > 0) {
        /* https://stackoverflow.com/questions/72030446/react-18-react-i18next-trans-component-interpolation-issue */
        help = (
            <Trans t={t} i18nKey="export-list-items-on-to-other-devices" values={{ list: typeSettings.title }}>
                Use the list item data below to import (<Link to={"/?type=" + typeSettings.type}>list</Link>) list items on to other devices
            </Trans>
        );

        button = (
            <div className="form-section">
                <button type="button" className="btn btn-outline-secondary" aria-label={t("copy-list-item-data-to-clipboard")} onClick={copyListItemData}>
                    {t("copy-list-item-data-to-clipboard")}
                </button>
            </div>
        );
        code = (
            <div className="form-section">
                <code>{json}</code>
            </div>
        );
    }

    return (
        <div className="export-settings">
            <h3>{t("export-list-items")}</h3>
            <p>{help}</p>
            {code}
            {button}
        </div>
    );
};

export default ExportSettings;
