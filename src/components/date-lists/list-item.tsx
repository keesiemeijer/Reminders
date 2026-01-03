import { useRef, useState, useContext } from "react";

import { EditModeContext } from "../../contexts/edit-mode-context";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../app/hooks";

import { removeListItems, updateListItemText } from "../../features/lists-slice";
import { DateListSettings } from "./types";
import { DateListItem } from "./types";
import ListItemDate from "./list-item-date";
import { RelativeDateClass } from "./utils/date";

interface ListItemProps {
    item: DateListItem;
    settings: DateListSettings;
    newListItem: React.RefObject<HTMLLIElement | null> | null;
}

const ListItem = (props: ListItemProps) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation(["date-lists", "common"]);
    const { editMode } = useContext(EditModeContext);

    // Reference for contenteditable div
    const itemTextDiv = useRef<HTMLDivElement>(null);
    // State for editing contenteditable div
    const [isEditing, setIsEditing] = useState(false);

    // List item properties
    const ListItemText = props.item.text;
    const ListItemID = props.item.id;

    const handleFocus = () => {
        if (itemTextDiv.current) {
            // Set text to original text (in case it was edited)
            itemTextDiv.current.textContent = ListItemText;
        }

        // Set editing state true
        setIsEditing(true);
    };

    const handleBlur = (_e: React.FocusEvent<HTMLElement>) => {
        // Check if button was clicked before blur
        if (_e.relatedTarget?.className.includes("edit-item-id-" + ListItemID)) {
            // Blur event triggers before click but the edit button was clicked because of relatedTarget
            saveEditedListItemText();
        } else {
            if (itemTextDiv.current) {
                // Revert to original text if not saved by edit button
                itemTextDiv.current.textContent = ListItemText;
            }
        }
        // Set editing state false
        setIsEditing(false);
    };

    const handleKeyDown = (_e: React.KeyboardEvent<HTMLDivElement>) => {
        if (_e.key === "Enter") {
            // Enter key pressed
            _e.preventDefault();
            // Save edited text on Enter key
            saveEditedListItemText();
            // Remove focus from div
            if (itemTextDiv.current) {
                itemTextDiv.current.blur();
            }
        }
    };

    const deleteListItem = (_e: React.MouseEvent<HTMLElement>) => {
        dispatch(removeListItems({ ids: [props.item.id], type: props.settings.type }));
    };

    const saveEditedListItemText = () => {
        if (itemTextDiv.current) {
            const editedItemText = itemTextDiv.current.textContent;
            if (typeof editedItemText === "string" && "" !== editedItemText.trim()) {
                dispatch(updateListItemText({ type: props.settings.type, id: props.item.id, text: editedItemText.trim() }));
            } else {
                // Revert to original text if empty
                itemTextDiv.current.textContent = ListItemText;
            }
        }
    };

    let dateClass = "";
    if (props.settings.settings.usePastDateColor) {
        dateClass = RelativeDateClass(props.item.date);
    }

    return (
        <li key={props.item.id} className={"list-group-item " + dateClass} ref={props.newListItem}>
            <div className="list-item">
                {editMode && (
                    <div
                        ref={itemTextDiv}
                        className="list-item-text"
                        contentEditable="plaintext-only"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        suppressContentEditableWarning={true}
                        role="textbox"
                    >
                        {ListItemText}
                    </div>
                )}

                {!editMode && <div className="list-item-text">{ListItemText}</div>}

                <ListItemDate date={props.item.date} settings={props.settings} dateType={dateClass} />
            </div>
            {editMode && (
                <>
                    <button
                        type="button"
                        className={`edit-item edit-item-id-${ListItemID} ${isEditing ? "visible" : "hide"}`}
                        tabIndex={0}
                        aria-label={t("edit-list-item", { ns: "common" })}
                        title={t("save-list-item", { ns: "common" })}
                        onClick={saveEditedListItemText}
                    ></button>
                    <button
                        type="button"
                        className="delete-item"
                        tabIndex={0}
                        aria-label={t("delete-list-item", { ns: "common" })}
                        title={t("delete-list-item", { ns: "common" })}
                        onClick={deleteListItem}
                    ></button>
                </>
            )}
        </li>
    );
};

export default ListItem;
