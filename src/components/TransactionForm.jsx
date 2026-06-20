// src/components/TransactionForm.jsx
// Modal form to log a new credit or debit transaction

import { useState } from "react";
import { CATEGORIES } from "../utils/helpers";

const DEFAULT_FORM = {
  amount: "",
  type: "debit",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

export default function TransactionForm({ onAdd, onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const filteredCategories = CATEGORIES.filter((c) => c.type === form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Auto-select first matching category when type changes
      ...(name === "type" && {
        category: CATEGORIES.find((c) => c.type === value)?.label || "",
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: new Date(form.date),
        note: form.note.trim(),
      });
      onClose();
    } catch (err) {
      setError("Failed to save transaction. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // ── Backdrop ──────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal panel ────────────────────────────────────── */}
      <div className="w-full max-w-md rounded-[32px] bg-slate-900/90 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-base font-extrabold text-white tracking-tight">New Transaction</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          
          {/* Type toggle */}
          <div className="flex rounded-xl bg-white/[0.03] border border-white/5 p-1 gap-1">
            {["debit", "credit"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({
                  ...p, type: t,
                  category: CATEGORIES.find((c) => c.type === t)?.label || ""
                }))}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  form.type === t
                    ? t === "credit"
                      ? "bg-emerald-500 text-white shadow shadow-emerald-500/10"
                      : "bg-rose-500 text-white shadow shadow-rose-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "credit" ? "Income" : "Expense"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 text-base font-extrabold focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition text-sm font-semibold [&>option]:bg-slate-900"
            >
              {filteredCategories.map((c) => (
                <option key={c.label} value={c.label} className="bg-slate-900 text-white">
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition text-sm"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Note <span className="normal-case font-normal text-slate-500">(optional)</span>
            </label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. Monthly rent, Zomato order…"
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition text-sm font-semibold"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl font-medium">
              ⚠ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all text-xs uppercase tracking-wider border border-white/10 ${
              form.type === "credit"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/10"
                : "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-500/10"
            } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]`}
          >
            {submitting ? "Saving log…" : `Save ${form.type === "credit" ? "Income" : "Expense"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
