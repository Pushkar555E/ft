// src/components/MetricCards.jsx
// Three summary cards: Balance, Income, Expenses

import { formatINR } from "../utils/helpers";

function Card({ label, value, icon, colorClass, glowColor, subtext }) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl transition-all duration-200 hover:border-white/20 hover:scale-[1.01]">
      {/* Background glow blob */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl ${glowColor}`} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className={`text-2xl font-extrabold tracking-tight ${colorClass}`}>{formatINR(value)}</p>
          {subtext && <p className="text-xs text-slate-500 font-medium">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 text-white ${glowColor} bg-white/[0.04] shadow-inner`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function MetricCards({ metrics }) {
  const { balance, totalIncome, totalExpenses } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card
        label="Net Balance"
        value={balance}
        icon={
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        }
        subtext="Income minus expenses"
        colorClass={balance >= 0 ? "text-emerald-400" : "text-rose-400"}
        glowColor={balance >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}
      />
      <Card
        label="Total Income"
        value={totalIncome}
        icon={
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" />
          </svg>
        }
        subtext="All credit transactions"
        colorClass="text-slate-100"
        glowColor="bg-emerald-500/20 text-emerald-400"
      />
      <Card
        label="Total Expenses"
        value={totalExpenses}
        icon={
          <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-9-9-4 4-6-6" />
          </svg>
        }
        subtext="All debit transactions"
        colorClass="text-slate-100"
        glowColor="bg-rose-500/20 text-rose-400"
      />
    </div>
  );
}
