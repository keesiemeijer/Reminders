import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const reminders = ('/' === location.pathname);
  const settings = ('/settings' === location.pathname);

  return (
    <nav className="nav">
      <Link className={ "nav-link" + (reminders ? ' active' : '') } to="/">Reminders</Link>
      <Link className={ "nav-link" + (settings ? ' active' : '') } to="/settings">Settings</Link>
    </nav>
    );
}

export default Navbar