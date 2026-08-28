import { NavLink } from "react-router-dom";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true, disabled: false },
  { to: "/matches", label: "Matches", disabled: true },
  { to: "/teams", label: "Teams", disabled: false },
  { to: "/anomalies", label: "Anomalies", disabled: true },
  { to: "/event/setup", label: "Event Setup", disabled: true },
];

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <div>
          <span className="event-label">Current Event</span>
          <h2>Demo VEX Event</h2>
        </div>

        <div className="header-right">
          <span className="offline-status">● Offline</span>
        </div>
      </div>

      <nav className="header-nav">
        {NAV_LINKS.map((link) =>
          link.disabled ? (
            <span
              key={link.to}
              className="nav-link nav-link-disabled"
              aria-disabled="true"
            >
              {link.label}
            </span>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;