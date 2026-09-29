import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

const ICONS = { system: "🖥️", light: "☀️", dark: "🌙" };
const LABELS = { system: "Auto", light: "Light", dark: "Dark" };

export default function ThemeToggle() {
  const { mode, cycleMode } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={cycleMode}
      title={`Theme: ${LABELS[mode]} — click to change`}
    >
      <span className="theme-toggle-icon">{ICONS[mode]}</span>
      <span className="theme-toggle-label">{LABELS[mode]}</span>
    </button>
  );
}