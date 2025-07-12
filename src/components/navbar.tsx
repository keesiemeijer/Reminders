import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../app/hooks";

import { sanitizePathname } from "../utils/path";
import { getFirstListObject } from "../utils/type";

const Navbar = () => {
    const { t } = useTranslation("common");
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const currentPage = sanitizePathname(location.pathname);
    const lists = useAppSelector((state) => state.lists);

    let firstType = "";
    let firstTitle = "";
    if (1 === lists.length) {
        const firstListType = getFirstListObject(lists);
        if (firstListType) {
            firstType = firstListType["type"];
            firstTitle = firstListType["title"];
        }
    }

    let listType = "";
    if ("/add-new-list" !== currentPage && searchParams.has("type")) {
        const typeParam = searchParams.get("type");
        listType = typeof typeParam === "string" ? typeParam.trim() : "";
    }

    // Type parameter
    const typeString = listType ? "?type=" + listType : "";

    const dropdown = (
        <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" to={"/" + typeString}>
            <span>{t("lists")}</span>
        </Link>
    );

    return (
        <ul className="nav main">
            {1 === lists.length && "" !== firstType && (
                <li className="nav-item">
                    <Link className="nav-link first-item" to={"/?type=" + firstType}>
                        {firstTitle}
                    </Link>
                </li>
            )}
            {1 < lists.length && (
                <li className="nav-item dropdown">
                    {dropdown}
                    <ul className="dropdown-menu">
                        {lists.map((type, index) => {
                            let currentPageClass = "";
                            if (listType && listType === type.type) {
                                currentPageClass = " active";
                            }
                            return (
                                <li key={index}>
                                    <Link className={"dropdown-item" + currentPageClass} to={"/?type=" + type["type"]}>
                                        {type.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>
            )}
            <li className="nav-item add">
                <Link className="nav-link add-type" to="/add-new-list">
                    {t("add-list")}
                </Link>
            </li>
        </ul>
    );
};

export default Navbar;
