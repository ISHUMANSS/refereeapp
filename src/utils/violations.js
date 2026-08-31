// Groups a team's violations by ruleCode.
// Returns groups sorted by most recently broken first.
export function groupByRule(violations) {
  const groups = {};
  violations.forEach((v) => {
    if (!groups[v.ruleCode]) {
      groups[v.ruleCode] = { ruleCode: v.ruleCode, entries: [] };
    }
    groups[v.ruleCode].entries.push(v);
  });
  return Object.values(groups)
    .map((g) => ({
      ...g,
      entries: g.entries.sort((a, b) => b.timestamp - a.timestamp),
      count: g.entries.length,
      latestTimestamp: Math.max(...g.entries.map((e) => e.timestamp)),
      hasMajor: g.entries.some((e) => e.severity === "major"),
    }))
    .sort((a, b) => b.latestTimestamp - a.latestTimestamp);
}