import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { EditModeContext } from "../contexts/edit-mode-context";

import { Link } from "react-router-dom";

const EditModeToggleLink = () => {
    const { editMode, setEditMode } = useContext(EditModeContext);

    const { t } = useTranslation("common");
    const editModeDefault = editMode ? "View" : "Edit";
    const [linkText, setLinkText] = useState(editModeDefault);

    // Callback function for when collapse link is clicked
    const handleEditModeToggle = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // EditModeContext context before updating context
        const toggleLinkText = editMode ? "Edit" : "View";
        // Update toggle link text in link
        setLinkText(toggleLinkText);
        // Update context
        setEditMode(!editMode);
    };

    return (
        <Link
            className={"nav-link edit-view-toggle" + (editMode ? " edit-toggled" : " view-toggled")}
            to="#edit-view"
            role="button"
            onClick={(e) => handleEditModeToggle(e)}
        >
            {t(linkText)}
        </Link>
    );
};
export default EditModeToggleLink;
