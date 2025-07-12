import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CollapseContext } from "../../contexts/collapse-context";
import { useTranslation } from "react-i18next";

const TreeFooterNav = (props: { type: string; id: number }) => {
    const collapse = useContext(CollapseContext);
    const FooterLinkRef = useRef<HTMLAnchorElement>(null);
    const { t } = useTranslation("tree-lists");

    let linkTo = "/?type=" + props.type;
    if (props.id > 0) {
        linkTo += "&id=" + props.id;
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (collapse.container?.current) {
            const hidden = !collapse.container.current.classList.contains("show");
            if (hidden && collapse.collapseLink?.current) {
                collapse.collapseLink.current.click();
            }
        }

        if (collapse.listItemInput?.current) {
            collapse.listItemInput.current.focus();
        }

        if (FooterLinkRef.current) {
            FooterLinkRef.current.style.cssText = "display: none;";
        }
    };
    return (
        <div className="tree-footer-nav">
            <Link className={"add-item"} to={linkTo} onClick={handleClick} ref={FooterLinkRef} title={t("add-item")} aria-label={t("add-item")}>
                <span className="sr-only">{t("add-item")}</span>
            </Link>
        </div>
    );
};

export default TreeFooterNav;
