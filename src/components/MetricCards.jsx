// src/components/MetricCards.jsx
// Three summary cards: Balance, Income, Expenses

import { formatINR } from "../utils/helpers";

function Card({ label, value, icon, colorClass, subtext }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 shadow-lg border ${colorClass}`}>
      {/* Background glow blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-2xl bg-current" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-1">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{formatINR(value)}</p>
          {subtext && <p className="text-xs opacity-50 mt-1">{subtext}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default function MetricCards({ metrics }) {
  const { balance, totalIncome, totalExpenses } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        label="Net Balance"
        value={balance}
        icon="🏦"
        subtext="Income minus expenses"
        colorClass={
          balance >= 0
            ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300"
            : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300"
        }
      />
      <Card
        label="Total Income"
        value={totalIncome}
        icon="📥"
        subtext="All credits"
        colorClass="bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700 text-sky-800 dark:text-sky-300"
      />
      <Card
        label="Total Expenses"
        value={totalExpenses}
        icon="📤"
        subtext="All debits"
        colorClass="bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-300"
      />
    </div>
  );
}
