import React, { forwardRef, HTMLAttributes, useState, useRef, useContext } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { EditModeContext } from "../../../../contexts/edit-mode-context";

import { Action, Handle } from "../Item";
import { updateListItemText } from "../../../../features/lists-slice";
import { useAppDispatch } from "../../../../app/hooks";

import styles from "./TreeItem.module.css";
import { Link } from "react-router-dom";
import { mergeRefs } from "../../../../utils/refs";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
    childCount?: number;
    clone?: boolean;
    collapsed?: boolean;
    depth: number;
    disableInteraction?: boolean;
    disableSelection?: boolean;
    ghost?: boolean;
    handleProps?: any;
    indicator?: boolean;
    indentationWidth: number;
    value: string | number;
    textFormat: number;
    id: number | string;
    type: string;
    newListItem: React.RefObject<HTMLLIElement | null> | null;
    onCollapse?(): void;
    onRemove?(): void;
    onNavigate?(): void;
    wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
    (
        {
            childCount,
            clone,
            depth,
            disableSelection,
            disableInteraction,
            ghost,
            handleProps,
            indentationWidth,
            indicator,
            collapsed,
            onCollapse,
            onRemove,
            onNavigate,
            style,
            id,
            type,
            newListItem,
            value,
            textFormat,
            wrapperRef,
            ...props
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const { editMode } = useContext(EditModeContext);
        const { t } = useTranslation(["common"]);
        // Reference for contenteditable div
        const itemTextDiv = useRef<HTMLDivElement>(null);
        // State for editing contenteditable div
        const [isEditing, setIsEditing] = useState(false);

        // List item properties
        const ListItemText = value;

        let textFormatClass = "";

        if (typeof textFormat === "number") {
            if (textFormat === 2) {
                textFormatClass = " h3";
            } else if (textFormat === 3) {
                textFormatClass = " h5";
            }
        }

        const ListItemID = id;

        const handleFocus = () => {
            if (itemTextDiv.current) {
                // Set text to original text (in case it was edited)
                itemTextDiv.current.textContent = ListItemText as string;
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
                    itemTextDiv.current.textContent = ListItemText as string;
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

        const saveEditedListItemText = () => {
            if (itemTextDiv.current) {
                const editedItemText = itemTextDiv.current.textContent;
                if (typeof editedItemText === "string" && "" !== editedItemText.trim()) {
                    dispatch(updateListItemText({ type: type, id: id as number, text: editedItemText.trim() }));
                } else {
                    // Revert to original text if empty
                    itemTextDiv.current.textContent = ListItemText as string;
                }
            }
        };

        return (
            <li
                className={
                    "tree-list-item " +
                    classNames(
                        styles.Wrapper,
                        clone && styles.clone,
                        ghost && styles.ghost,
                        indicator && styles.indicator,
                        disableSelection && styles.disableSelection,
                        disableInteraction && styles.disableInteraction
                    )
                }
                ref={mergeRefs(wrapperRef, newListItem)}
                style={
                    {
                        "--spacing": `${indentationWidth * depth}px`,
                    } as React.CSSProperties
                }
                {...props}
            >
                <div className={"tree-item " + styles.TreeItem} ref={ref} style={style}>
                    {editMode && (
                        <div className={"tree-item-actions"}>
                            <Link
                                to={"/?type=" + type + "&id=" + id}
                                className="item-nav-link"
                                aria-label={t("go-to-item-id", { id: id })}
                                onClick={onNavigate}
                            >
                                <span className="sr-only">{t("go-to-item-id", { id: id })}</span>
                            </Link>
                            <Handle {...handleProps} />

                            {onCollapse && (
                                <Action onClick={onCollapse} className={classNames(styles.Collapse, collapsed && styles.collapsed)}>
                                    {collapseIcon}
                                </Action>
                            )}
                        </div>
                    )}
                    {editMode && (
                        <div
                            className={styles.Text + textFormatClass + " edit-mode"}
                            ref={itemTextDiv}
                            contentEditable="plaintext-only"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            suppressContentEditableWarning={true}
                            role="textbox"
                        >
                            {value}
                        </div>
                    )}
                    {!editMode && <div className={styles.Text + textFormatClass + " view-mode"}>{value}</div>}
                    {/* {!clone && onRemove && <Remove onClick={onRemove} />} */}
                    {clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null}
                    {!clone && editMode && (
                        <button
                            type="button"
                            className={`edit-item edit-item-id-${ListItemID} ${isEditing ? "visible" : "hide"}`}
                            tabIndex={0}
                            aria-label={t("edit-list-item")}
                            title={t("save-list-item")}
                            onClick={saveEditedListItemText}
                        ></button>
                    )}

                    {!clone && editMode && (
                        <button
                            type="button"
                            className="delete-item"
                            tabIndex={0}
                            onClick={onRemove}
                            aria-label={t("delete-list-item")}
                            title={t("delete-list-item")}
                        ></button>
                    )}
                </div>
            </li>
        );
    }
);

const collapseIcon = (
    <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
        <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
    </svg>
);
