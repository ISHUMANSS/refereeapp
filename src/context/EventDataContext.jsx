import { createContext, useContext, useState, useEffect } from "react";
import { sampleTeams } from "../data/sampleData";


//key to access data in local storage
const STORAGE_KEY = "roboref-event-data";

//creates the context that will hold and share event data
const EventDataContext = createContext(null);


/**
 * Loads the initial event data from localStorage.
 *
 * If saved data exists, it is converted from JSON back into
 * a JavaScript object and returned.
 *
 * If there is no saved data, or loading fails, we use the
 * sample teams and start with an empty list of violations.
 */
function loadInitial() {
  //try to get any saved event data from local storage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load saved data", e);
  }
  return { teams: sampleTeams, violations: [] };
}

/**
 * Provides event data and functions to all components
 * that are inside the EventDataProvider.
 */
export function EventDataProvider({ children }) {

  // Store the event data in React state.
  // loadInitial is used to get the starting data.
  const [data, setData] = useState(loadInitial);

   /**
   * Save the current event data to localStorage whenever
   * the data state changes.
   *
   * JSON.stringify converts the JavaScript object into a
   * string because localStorage can only store strings.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  /**
   * Adds a new team to the event.
   *
   * @param {string} number - The team's number.
   * @param {string} name - The team's name.
  */
  function addTeam(number, name) {
    const team = {
      id: crypto.randomUUID(),
      number: number.trim(),
      name: name.trim(),
    };
    setData((prev) => ({ ...prev, teams: [...prev.teams, team] }));
  }

  /**
   * Removes a team from the event.
   *
   * The team's violations are also removed because they
   * belong to the team being deleted.
   *
   * @param {string} teamId - The ID of the team to remove.
  */
  function removeTeam(teamId) {
    setData((prev) => ({
      teams: prev.teams.filter((t) => t.id !== teamId),
      violations: prev.violations.filter((v) => v.teamId !== teamId),
    }));
  }

  /**
   * Adds a violation to a team.
   *
   * @param {string} teamId - The ID of the team receiving the violation.
   * @param {string} type - The type of violation.
   * @param {string} note - An optional note about the violation.
  */
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

  /**
   * Removes a violation from a team.
   *
   * @param {string} violationId - The ID of the violation to remove.
  */
  function removeViolation(violationId) {
    setData((prev) => ({
      ...prev,
      violations: prev.violations.filter((v) => v.id !== violationId),
    }));
  }


  /**
   * Gets all violations belonging to a specific team.
   *
   * @param {string} teamId - The ID of the team.
   * @returns {Array} All violations for the specified team.
  */
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

/**
 * Custom hook used by components to access the event data.
 *
 * Instead of importing and using useContext(EventDataContext)
 * in every component, we can simply use useEventData().
*/
export function useEventData() {
  const ctx = useContext(EventDataContext);
  if (!ctx) {
    throw new Error("useEventData must be used within EventDataProvider");
  }
  return ctx;
}