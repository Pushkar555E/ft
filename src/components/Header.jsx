// src/components/Header.jsx
// Top navigation bar with branding, theme toggle, and add button

import { useTheme } from "../context/ThemeContext";

export default function Header({ onAdd }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            ₹
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 dark:text-white text-sm leading-tight tracking-tight">
              FinanceTracker
            </h1>
            <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">
              Personal money manager
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-base"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Add transaction */}
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-md hover:shadow-indigo-200 dark:hover:shadow-indigo-900 active:scale-95"
          >
            <span className="text-base leading-none">+</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </header>
  );
}
