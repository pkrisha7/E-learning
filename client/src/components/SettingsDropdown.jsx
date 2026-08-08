import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SettingsDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative inline-block text-left z-50" ref={dropdownRef}>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 px-4 py-2 rounded-2xl font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center text-[10px] font-extrabold shadow-xs">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
        <span>Settings</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="font-extrabold text-slate-900 text-sm truncate">{user.name}</p>
            <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1.5 ${
              user.role === 'admin'
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : user.role === 'instructor'
                ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                : 'bg-sky-100 text-sky-700 border border-sky-200'
            }`}>
              {user.role} Account
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-1.5 text-xs font-semibold text-slate-700">
            <Link
              to="/courses"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 hover:text-sky-600 transition-colors"
            >
              <span>📚</span> Browse Courses
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 hover:text-sky-600 transition-colors"
            >
              <span>📊</span> Student Dashboard
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 hover:text-sky-600 transition-colors"
            >
              <span>👤</span> My Profile
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-rose-50 text-rose-600 transition-colors"
              >
                <span>🛡️</span> Admin Console
              </Link>
            )}

            {user.role === 'instructor' && (
              <Link
                to="/tutor"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-cyan-50 text-cyan-600 transition-colors"
              >
                <span>👨‍🏫</span> Instructor Studio
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
