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
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl overflow-hidden">
      
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-white/5 flex flex-col md:flex-row md:items-center gap-4">
        <h3 className="font-extrabold text-white text-base flex-1 tracking-tight">
          Recent Transactions
          <span className="ml-2 text-xs font-semibold text-slate-400">({filtered.length})</span>
        </h3>

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search transactions…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 text-xs rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition w-full sm:w-48 font-medium"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white/[0.03] border border-white/5 rounded-xl p-0.5">
            {[
              { key: "all",    label: "All" },
              { key: "credit", label: "Income" },
              { key: "debit",  label: "Expenses" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filter === key
                    ? key === "credit"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : key === "debit"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      {paginated.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1a2 2 0 00-2-2H2" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-300">No transactions recorded</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto">Create a new income or expense log using the Add button above.</p>
        </div>
      ) : (
        <ul className="divide-y divide-white/5">
          {paginated.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.01] transition-colors group"
            >
              {/* Category Icon Bubble */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base border border-white/10 flex-shrink-0 ${
                t.type === "credit"
                  ? "bg-emerald-500/10 shadow-[0_0_15px_-3px_rgba(52,211,153,0.1)]"
                  : "bg-rose-500/10 shadow-[0_0_15px_-3px_rgba(244,63,94,0.1)]"
              }`}>
                {getCategoryIcon(t.category)}
              </div>

              {/* Info details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white truncate">
                    {t.category}
                  </span>
                  <span className={`hidden sm:inline text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    t.type === "credit"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}>
                    {t.type === "credit" ? "Income" : "Expense"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {t.note || "—"} · {formatDate(t.date)}
                </p>
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <span className={`font-extrabold text-sm ${
                  t.type === "credit"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}>
                  {t.type === "credit" ? "+" : "−"}{formatINR(t.amount)}
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => onDelete(t.id)}
                title="Delete"
                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 text-xs flex-shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-white/5 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 disabled:hover:bg-white/[0.02] disabled:hover:text-slate-300 transition duration-150"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-white/5 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/[0.06] disabled:opacity-40 disabled:hover:bg-white/[0.02] disabled:hover:text-slate-300 transition duration-150"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
