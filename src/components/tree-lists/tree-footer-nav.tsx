import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CollapseContext } from "../../contexts/collapse-context";

const TreeFooterNav = (props: { type: string; id: number }) => {
    const collapse = useContext(CollapseContext);
    const FooterLinkRef = useRef<HTMLAnchorElement>(null);

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
            <Link className={"add-item"} to={linkTo} onClick={handleClick} ref={FooterLinkRef} title="Add Item" aria-label="Add Item">
                <span className="sr-only">Add Item</span>
            </Link>
        </div>
    );
};

export default TreeFooterNav;
