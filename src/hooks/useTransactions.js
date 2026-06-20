// src/hooks/useTransactions.js
// ─────────────────────────────────────────────────────────────
// Real-time Firestore listener hook using onSnapshot.
// Any write from ANY client (web or Android) instantly
// propagates to all connected listeners — no polling needed.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION = "transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Real-time listener ──────────────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, COLLECTION),
      orderBy("date", "desc")
    );

    // onSnapshot fires immediately with current data,
    // then again on every Firestore write — true real-time sync.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          // Firestore Timestamps → JS Date for consistent usage
          date: docSnap.data().date?.toDate?.() ?? new Date(docSnap.data().date),
        }));
        setTransactions(data);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  // ── Add transaction ─────────────────────────────────────────
  const addTransaction = async (txData) => {
    try {
      await addDoc(collection(db, COLLECTION), {
        ...txData,
        amount: parseFloat(txData.amount),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Add failed:", err);
      throw err;
    }
  };

  // ── Delete transaction ──────────────────────────────────────
  const deleteTransaction = async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
    } catch (err) {
      console.error("Delete failed:", err);
      throw err;
    }
  };

  // ── Derived metrics (memoised inline) ──────────────────────
  const totalIncome = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    metrics: { balance, totalIncome, totalExpenses },
  };
}
