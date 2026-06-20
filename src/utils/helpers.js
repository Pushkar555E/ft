// src/utils/helpers.js

export const CATEGORIES = [
  { label: "Salary",     icon: "💼", type: "credit" },
  { label: "Freelance",  icon: "🖥️",  type: "credit" },
  { label: "Investment", icon: "📈", type: "credit" },
  { label: "Gift",       icon: "🎁", type: "credit" },
  { label: "Other Income", icon: "💰", type: "credit" },
  { label: "Food",       icon: "🍔", type: "debit" },
  { label: "Transport",  icon: "🚗", type: "debit" },
  { label: "Fuel",       icon: "⛽", type: "debit" },
  { label: "Shopping",   icon: "🛍️", type: "debit" },
  { label: "Bills",      icon: "📄", type: "debit" },
  { label: "Health",     icon: "🏥", type: "debit" },
  { label: "Education",  icon: "📚", type: "debit" },
  { label: "Entertainment", icon: "🎬", type: "debit" },
  { label: "Other",      icon: "📌", type: "debit" },
];

export const CATEGORY_COLORS = {
  Salary:       "#6ee7b7",
  Freelance:    "#93c5fd",
  Investment:   "#fde68a",
  Gift:         "#f9a8d4",
  "Other Income": "#c4b5fd",
  Food:         "#f87171",
  Transport:    "#fb923c",
  Fuel:         "#facc15",
  Shopping:     "#a78bfa",
  Bills:        "#60a5fa",
  Health:       "#34d399",
  Education:    "#f472b6",
  Entertainment:"#38bdf8",
  Other:        "#94a3b8",
};

// Format number as Indian Rupee currency
export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Group transactions by month for bar chart
export const groupByMonth = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const d = t.date instanceof Date ? t.date : new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { month: key, credit: 0, debit: 0 };
    map[key][t.type] += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
};

// Group debit transactions by category for pie chart
export const groupByCategory = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === "debit")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};
