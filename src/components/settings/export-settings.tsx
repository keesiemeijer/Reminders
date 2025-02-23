import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
    let help: React.ReactElement | string = "There are no list items to export yet";

    const copySuccess = "Copied data to clipboard";
    const copyError = "Unable to copy data to clipboard";

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
        const typeLink = <Link to={"/?type=" + typeSettings["type"]}>{typeSettings["title"]}</Link>;
        help = <>Use the list item data below to import ({typeLink}) list items on to other devices"</>;
        button = (
            <div className="form-section">
                <button type="button" className="btn btn-outline-secondary" aria-label="Copy data to clipboard" onClick={copyListItemData}>
                    Copy list item data To Clipboard
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
            <h3>Export List Items</h3>
            <p>{help}</p>
            {code}
            {button}
        </div>
    );
};

export default ExportSettings;
