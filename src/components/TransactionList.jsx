// src/components/TransactionList.jsx
// Paginated, scannable transaction history list

import { useState } from "react";
import { CATEGORIES, formatINR, formatDate } from "../utils/helpers";

const PAGE_SIZE = 8;

function getCategoryIcon(category) {
  return CATEGORIES.find((c) => c.label === category)?.icon ?? "📌";
}

export default function TransactionList({ transactions, onDelete }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // all | credit | debit
  const [search, setSearch] = useState("");

  const filtered = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .filter((t) =>
      search
        ? t.category.toLowerCase().includes(search.toLowerCase()) ||
          (t.note && t.note.toLowerCase().includes(search.toLowerCase()))
        : true
    );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center gap-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-base flex-1">
          Recent Transactions
          <span className="ml-2 text-xs font-normal text-gray-400">({filtered.length})</span>
        </h3>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5">
          {[
            { key: "all",    label: "All" },
            { key: "credit", label: "Income" },
            { key: "debit",  label: "Expenses" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === key
                  ? key === "credit"
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : key === "debit"
                    ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                    : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      {paginated.length === 0 ? (
        <div className="py-16 text-center text-gray-400 dark:text-gray-600">
          <p className="text-4xl mb-3">🗂</p>
          <p className="text-sm font-medium">No transactions found.</p>
          <p className="text-xs mt-1">Add your first transaction using the button above.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 dark:divide-gray-800">
          {paginated.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              {/* Icon bubble */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                t.type === "credit"
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-rose-100 dark:bg-rose-900/30"
              }`}>
                {getCategoryIcon(t.category)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                    {t.category}
                  </span>
                  <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium ${
                    t.type === "credit"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                  }`}>
                    {t.type === "credit" ? "Income" : "Expense"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {t.note || "—"} · {formatDate(t.date)}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <span className={`font-bold text-sm ${
                  t.type === "credit"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500 dark:text-rose-400"
                }`}>
                  {t.type === "credit" ? "+" : "−"}{formatINR(t.amount)}
                </span>
              </div>

              {/* Delete (appears on hover) */}
              <button
                onClick={() => onDelete(t.id)}
                title="Delete"
                className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs flex-shrink-0"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
