import rulesData from "../data/rules.json";

// Flat lookup: code -> { code, title, categoryId, categoryName, color, severity }
export const RULE_INDEX = rulesData.categories.reduce((acc, cat) => {
  cat.rules.forEach((rule) => {
    acc[rule.code] = {
      ...rule,
      categoryId: cat.id,
      categoryName: cat.name,
      color: cat.color,
    };
  });
  return acc;
}, {});

export const RULE_CATEGORIES = rulesData.categories;

export function getRule(code) {
  return RULE_INDEX[code] || null;
}