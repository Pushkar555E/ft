// src/components/Charts.jsx
// Pie chart (spending by category) + Bar chart (monthly credit vs debit)
// Built with Recharts — install: npm install recharts

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { groupByMonth, groupByCategory, CATEGORY_COLORS, formatINR } from "../utils/helpers";
import { useTheme } from "../context/ThemeContext";

// ── Custom tooltip for currency formatting ──────────────────
const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-xl text-sm">
      {label && <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey || p.name} style={{ color: p.fill || p.stroke || p.color }}>
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Charts({ transactions }) {
  const { isDark } = useTheme();
  const monthlyData = groupByMonth(transactions);
  const categoryData = groupByCategory(transactions);

  const axisColor = isDark ? "#6b7280" : "#9ca3af";
  const gridColor = isDark ? "#1f2937" : "#f3f4f6";

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center py-16 text-gray-400 dark:text-gray-600">
        <p className="text-sm">Add transactions to see your analytics.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ── Bar Chart: Monthly Trend ──────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Monthly Overview</h3>
        <p className="text-xs text-gray-400 mb-4">Last 6 months income vs expenses</p>
        {monthlyData.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">Not enough data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => {
                  const [yr, mo] = v.split("-");
                  return new Date(yr, parseInt(mo) - 1).toLocaleString("en", { month: "short" });
                }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: axisColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                width={46}
              />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", color: axisColor }}
              />
              <Bar dataKey="credit" name="Income" fill="#34d399" radius={[6, 6, 0, 0]} />
              <Bar dataKey="debit"  name="Expenses" fill="#f87171" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Pie Chart: Spending Breakdown ─────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Spending Breakdown</h3>
        <p className="text-xs text-gray-400 mb-4">Expenses by category</p>
        {categoryData.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">No expense data yet.</p>
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
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", color: axisColor }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
