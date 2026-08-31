import { NavLink } from "react-router-dom";
import { useEventData } from "../context/EventDataContext";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true, disabled: false },
  { to: "/matches", label: "Matches", disabled: true },
  { to: "/teams", label: "Teams", disabled: false },
  { to: "/anomalies", label: "Anomalies", disabled: false },
  { to: "/event/setup", label: "Event Setup", disabled: false },
];

function Header() {
  const { event } = useEventData();

  return (
    <header className="header">
      <div className="header-top">
        <div>
          <span className="event-label">Current Event</span>
          <h2 className={!event ? "event-name-empty" : ""}>
            {event ? event.name : "No Event Selected"}
          </h2>
        </div>
        {/*will show if a local event or a online event is currently sellected*/}
        <div className="header-right">
          <span className="offline-status">● Local</span>
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