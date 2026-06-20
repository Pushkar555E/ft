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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ── Modal panel ────────────────────────────────────── */}
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Transaction</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          
          {/* Type toggle */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 gap-1">
            {["debit", "credit"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({
                  ...p, type: t,
                  category: CATEGORIES.find((c) => c.type === t)?.label || ""
                }))}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  form.type === t
                    ? t === "credit"
                      ? "bg-emerald-500 text-white shadow"
                      : "bg-rose-500 text-white shadow"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t === "credit" ? "💰 Income" : "💸 Expense"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              {filteredCategories.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Note <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. Monthly rent, Zomato order…"
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">
              ⚠ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all text-sm tracking-wide ${
              form.type === "credit"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-rose-500 hover:bg-rose-600"
            } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]`}
          >
            {submitting ? "Saving…" : `Save ${form.type === "credit" ? "Income" : "Expense"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
