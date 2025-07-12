import { useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";

import { CollapseContext } from "../contexts/collapse-context";
interface CollapseLinkProps {
    listItemCount: number;
}

const CollapseLink = (props: CollapseLinkProps) => {
    const { t } = useTranslation("common");
    const collapse = useContext(CollapseContext);
    const isFormCollapsedRef = useRef(false);

    // Fuction to get collapsed state of form
    const isFormCollapsed = () => {
        return isFormCollapsedRef.current;
    };

    // Callback function for when collapse link is clicked
    const collapseClickEventCallack = (collapsed: boolean) => {
        // Set isFormCollapsedRef
        isFormCollapsedRef.current = collapsed;

        if (collapsed) {
            // The form is collapsed
            // Set collapse link text to "Add List Items"
            toggleLink("add");
        } else {
            if (props.listItemCount > 0) {
                // The form is displayed and there are list items
                // Set collapse link text to "hide form"
                toggleLink("hide");
            }
        }
    };

    // Function to toggle collapse link text and class
    const toggleLink = (toggle: string) => {
        if (collapse.collapseLink && collapse.collapseLink.current) {
            if ("hide" === toggle) {
                collapse.collapseLink.current.classList.remove("add-items");
                collapse.collapseLink.current.classList.add("hide-form");
                collapse.collapseLink.current.innerHTML = t("hide-form");
            } else {
                collapse.collapseLink.current.classList.add("add-items");
                collapse.collapseLink.current.classList.remove("hide-form");
                collapse.collapseLink.current.innerHTML = t("add-items");
            }
        }
    };

    // Hook for Initial render
    useEffect(() => {
        if (props.listItemCount > 0) {
            // There are list items.
            // Form is collapsed if there are list items
            isFormCollapsedRef.current = true;
        } else {
            // There are no list items
            // Hide the collapse link
            if (collapse.collapseLink && collapse.collapseLink.current) {
                collapse.collapseLink.current.style.cssText = "display: none;";
            }
            // Display collapse container
            if (collapse.container && collapse.container.current) {
                collapse.container.current.classList.add("show");
            }
        }

        if (collapse.container && collapse.container.current) {
            // Bootstrap Collapse click events
            collapse.container.current.addEventListener("hide.bs.collapse", () => collapseClickEventCallack(true));
            collapse.container.current.addEventListener("show.bs.collapse", () => collapseClickEventCallack(false));
        }
    }, []);

    // Hook for when list item count changes
    useEffect(() => {
        if (props.listItemCount === 0) {
            // There are no list items
            if (collapse.collapseLink && collapse.collapseLink.current) {
                if (!isFormCollapsed()) {
                    // Form is not collapsed
                    // Hide link.
                    collapse.collapseLink.current.style.display = "none";
                } else {
                    // Form is collapsed
                    // Trigger click to display form
                    collapse.collapseLink.current.click();
                    // Hide link after form is displayed
                    collapse.collapseLink.current.style.display = "none";
                }
            }
        } else if (props.listItemCount > 0) {
            // There are list items
            if (!isFormCollapsed() && collapse.collapseLink && collapse.collapseLink.current) {
                // Form is not collapsed
                const refStyle = collapse.collapseLink.current.style.display;
                if ("none" === refStyle) {
                    // Link is hidden
                    // Unhide link and change text to "hide form"
                    collapse.collapseLink.current.style.display = "block";
                    toggleLink("hide");
                }
            }
        }
    }, [props.listItemCount]);

    return (
        <Link
            className="nav-link add-items"
            data-bs-toggle="collapse"
            to="#form-collapse"
            role="button"
            aria-expanded="false"
            aria-controls="form-collapse"
            ref={collapse.collapseLink}
        >
            {t("add-items")}
        </Link>
    );
};
export default CollapseLink;
