import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    let link = (
        <Link className="nav-link" to="/">
            Reminders
        </Link>
    );
    if ("/" === location.pathname) {
        link = (
            <Link className="nav-link" to="/settings">
                Settings
            </Link>
        );
    }

    return <nav className="nav">{link}</nav>;
};

export default Navbar;
