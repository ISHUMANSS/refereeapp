import { createContext, useContext, useState, useEffect } from "react";
import { sampleTeams } from "../data/sampleData";

const STORAGE_KEY = "roboref-event-data";
const EventDataContext = createContext(null);

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load saved data", e);
  }
  return { teams: sampleTeams, violations: [] };
}

export function EventDataProvider({ children }) {
  const [data, setData] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function addTeam(number, name) {
    const team = {
      id: crypto.randomUUID(),
      number: number.trim(),
      name: name.trim(),
    };
    setData((prev) => ({ ...prev, teams: [...prev.teams, team] }));
  }

  function removeTeam(teamId) {
    setData((prev) => ({
      teams: prev.teams.filter((t) => t.id !== teamId),
      violations: prev.violations.filter((v) => v.teamId !== teamId),
    }));
  }

  function addViolation(teamId, type, note) {
    const violation = {
      id: crypto.randomUUID(),
      teamId,
      type,
      note: note?.trim() || "",
      timestamp: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      violations: [...prev.violations, violation],
    }));
  }

  function removeViolation(violationId) {
    setData((prev) => ({
      ...prev,
      violations: prev.violations.filter((v) => v.id !== violationId),
    }));
  }

  function violationsForTeam(teamId) {
    return data.violations.filter((v) => v.teamId === teamId);
  }

  const value = {
    teams: data.teams,
    violations: data.violations,
    addTeam,
    removeTeam,
    addViolation,
    removeViolation,
    violationsForTeam,
  };

  return (
    <EventDataContext.Provider value={value}>
      {children}
    </EventDataContext.Provider>
  );
}

export function useEventData() {
  const ctx = useContext(EventDataContext);
  if (!ctx) {
    throw new Error("useEventData must be used within EventDataProvider");
  }
  return ctx;
}