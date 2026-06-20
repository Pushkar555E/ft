// src/components/Charts.jsx
// Pie chart (spending by category) + Bar chart (monthly credit vs debit)
// Built with Recharts

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { groupByMonth, groupByCategory, CATEGORY_COLORS, formatINR } from "../utils/helpers";

const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl text-xs font-semibold">
      {label && <p className="text-slate-400 font-bold uppercase tracking-wider mb-1.5">{label}</p>}
      <div className="space-y-1">
        {payload.map((p) => (
          <p key={p.dataKey || p.name} style={{ color: p.fill || p.stroke || p.color }}>
            {p.name}: {formatINR(p.value)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default function Charts({ transactions }) {
  const monthlyData = groupByMonth(transactions);
  const categoryData = groupByCategory(transactions);

  const axisColor = "#94a3b8";
  const gridColor = "rgba(255, 255, 255, 0.05)";

  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-300">No analytics data yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[280px] text-center">Add transactions to visualize your income and spending distributions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ── Bar Chart: Monthly Trend ──────────────────────── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl p-6">
        <h3 className="font-extrabold text-white text-sm mb-1 tracking-tight">Monthly Overview</h3>
        <p className="text-xs text-slate-400 mb-6">Last 6 months income vs expenses</p>
        {monthlyData.length === 0 ? (
          <p className="text-center text-xs text-slate-500 py-12">Not enough history yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: axisColor, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  const [yr, mo] = v.split("-");
                  return new Date(yr, parseInt(mo) - 1).toLocaleString("en", { month: "short" });
                }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: axisColor, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                width={40}
              />
              <Tooltip content={<CurrencyTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)", radius: 6 }} />
              <Legend
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: "11px", color: axisColor, paddingTop: "15px" }}
              />
              <Bar dataKey="credit" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="debit"  name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Pie Chart: Spending Breakdown ─────────────────── */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl p-6">
        <h3 className="font-extrabold text-white text-sm mb-1 tracking-tight">Spending Breakdown</h3>
        <p className="text-xs text-slate-400 mb-6">Expenses by category</p>
        {categoryData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <p className="text-xs">No expense logs recorded yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] ?? "#94a3b8"}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ fontSize: "10px", color: axisColor }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
