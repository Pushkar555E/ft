// src/components/Dashboard.jsx
// Root dashboard — orchestrates all child components

import { useState } from "react";
import Header from "./Header";
import MetricCards from "./MetricCards";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import Charts from "./Charts";
import { useTransactions } from "../hooks/useTransactions";

export default function Dashboard() {
  const { transactions, loading, error, addTransaction, deleteTransaction, metrics } =
    useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview | history

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header onAdd={() => setShowForm(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Error Banner ─────────────────────────────────── */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            ⚠ Firebase error: {error}. Check your config in <code>src/config/firebase.js</code>.
          </div>
        )}

        {/* ── Metric Cards ─────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <MetricCards metrics={metrics} />
        )}

        {/* ── Tab Navigation ───────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 rounded-xl p-1 w-fit">
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "history",  label: "🧾 History"  },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab Panels ───────────────────────────────────── */}
        {loading ? (
          <div className="rounded-2xl bg-gray-200 dark:bg-gray-800 h-64 animate-pulse" />
        ) : activeTab === "overview" ? (
          <>
            <Charts transactions={transactions} />
            <TransactionList
              transactions={transactions.slice(0, 5)}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        )}
      </main>

      {/* ── Transaction Form Modal ───────────────────────── */}
      {showForm && (
        <TransactionForm
          onAdd={addTransaction}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
