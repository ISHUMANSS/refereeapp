function Header() {
  return (
    <header className="header">
      <div>
        <span className="event-label">Current Event</span>
        <h2>Demo VEX Event</h2>
      </div>

      <div className="header-right">
        <span className="offline-status">
          ● Offline
        </span>
      </div>
    </header>
  );
}

export default Header;