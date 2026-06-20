// src/hooks/useTransactions.js
// ─────────────────────────────────────────────────────────────
// Real-time Firestore listener hook using onSnapshot.
// Scoped per-user to prevent data leakage and sorted in-memory.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION = "transactions";

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Real-time listener ──────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query transactions belonging only to the authenticated user
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const data = snapshot.docs.map((docSnap) => {
            const docData = docSnap.data();
            let dateVal;
            if (docData.date) {
              if (typeof docData.date.toDate === "function") {
                dateVal = docData.date.toDate();
              } else {
                dateVal = new Date(docData.date);
              }
            } else {
              dateVal = new Date();
            }
            return {
              id: docSnap.id,
              ...docData,
              date: dateVal,
            };
          });

          // Sort in-memory: descending order (latest first)
          data.sort((a, b) => b.date.getTime() - a.date.getTime());

          setTransactions(data);
          setLoading(false);
        } catch (err) {
          console.error("Firestore parsing error:", err);
          setError("Error parsing transactions data: " + err.message);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore snapshot error:", err);
        setError("Database read failed: " + err.message);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts or userId changes
    return () => unsubscribe();
  }, [userId]);

  // ── Add transaction ─────────────────────────────────────────
  const addTransaction = async (txData) => {
    if (!userId) throw new Error("Unauthenticated write attempt.");
    try {
      await addDoc(collection(db, COLLECTION), {
        ...txData,
        userId,
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
