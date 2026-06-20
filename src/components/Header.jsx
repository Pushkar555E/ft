// src/components/Header.jsx
// Top navigation bar with branding, theme toggle, and add button

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header({ onAdd }) {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/10 border border-white/10">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2H9v-2h2v-2H9.5C8.67 10 8 9.33 8 8.5S8.67 7 9.5 7H11V5h2v2h2v2h-2v2h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H13v2z" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-white text-sm leading-tight tracking-tight">
              FinanceTracker
            </h1>
            <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">
              Professional money manager
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          
          {/* User Info (Desktop only) */}
          {currentUser && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[150px]">
                {currentUser.email}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Authorized
              </span>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Add transaction */}
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-md shadow-indigo-500/20 active:scale-95 border border-white/10"
          >
            <span className="text-sm font-semibold">+</span>
            <span>Add</span>
          </button>

          {/* Logout button */}
          {currentUser && (
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
