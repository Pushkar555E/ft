// src/components/Dashboard.jsx
// Root dashboard — orchestrates all child components

import { useState } from "react";
import Header from "./Header";
import MetricCards from "./MetricCards";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import Charts from "./Charts";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { transactions, loading, error, addTransaction, deleteTransaction, metrics } =
    useTransactions(currentUser?.uid);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview | history

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/[0.05] blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <Header onAdd={() => setShowForm(true)} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* ── Error Banner ─────────────────────────────────── */}
          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3.5 text-sm text-red-400 font-medium">
              ⚠ Database error: {error}
            </div>
          )}

          {/* ── Metric Cards ─────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <MetricCards metrics={metrics} />
          )}

          {/* ── Tab Navigation ───────────────────────────────── */}
          <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 w-fit shadow-xl backdrop-blur-md">
            {[
              { key: "overview", label: "Overview" },
              { key: "history",  label: "History"  },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all uppercase ${
                  activeTab === key
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab Panels ───────────────────────────────────── */}
          {loading ? (
            <div className="rounded-[32px] bg-white/[0.03] border border-white/5 h-72 animate-pulse" />
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
      </div>

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
