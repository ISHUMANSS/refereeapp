export const teams = [
  {
    number: "123A",
    name: "Example Team",
  },
  {
    number: "456B",
    name: "Another Team",
  },
  {
    number: "789C",
    name: "Third Team",
  },
  {
    number: "321A",
    name: "Fourth Team",
  },
];

export const matches = [
  {
    id: "match-1",
    number: 1,
    type: "qualification",
    red: ["123A", "456B"],
    blue: ["789C", "321A"],
  },
  {
    id: "match-2",
    number: 2,
    type: "qualification",
    red: ["789C", "123A"],
    blue: ["456B", "321A"],
  },
];

export const anomalies = [
  {
    id: "anomaly-1",
    matchId: "match-1",
    teamNumber: "123A",
    rule: "G1",
    severity: "warning",
    notes: "Example warning",
    timestamp: Date.now(),
  },
];