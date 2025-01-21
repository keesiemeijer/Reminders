import { Link, useLocation, useSearchParams } from "react-router-dom";

import { useAppSelector } from "../app/hooks";

import { sanitizePathname } from "../utils/path";
import { getFirstTypeObject } from "../utils/type";

const Navbar = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const currentPage = sanitizePathname(location.pathname);
    const allReminders = useAppSelector((state) => state.reminders);

    let firstType = "";
    let firstTitle = "";
    if (1 === allReminders.length) {
        const firstReminderType = getFirstTypeObject(allReminders);
        if (firstReminderType) {
            firstType = firstReminderType["type"];
            firstTitle = firstReminderType["title"];
        }
    }

    let reminderType = "";
    if ("/add-new-list" !== currentPage && searchParams.has("type")) {
        const typeParam = searchParams.get("type");
        reminderType = typeof typeParam === "string" ? typeParam.trim() : "";
    }

    // Type parameter
    const typeString = reminderType ? "?type=" + reminderType : "";

    const dropdown = (
        <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown" to={"/" + typeString}>
            <span>My Lists</span>
        </Link>
    );

    return (
        <ul className="nav main">
            {1 === allReminders.length && "" !== firstType && (
                <li className="nav-item">
                    <Link className="nav-link first-item" to={"/?type=" + firstType}>
                        {firstTitle}
                    </Link>
                </li>
            )}
            {1 < allReminders.length && (
                <li className="nav-item dropdown">
                    {dropdown}
                    <ul className="dropdown-menu">
                        {allReminders.map((type, index) => {
                            let currentPageClass = "";
                            if (reminderType && reminderType === type.type) {
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
                    Add New List
                </Link>
            </li>
        </ul>
    );
};

export default Navbar;
