import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', to = '/', showText = true, variant = 'light', className = '' }) {
  const sizeClasses = {
    sm: { box: 'w-8 h-8 rounded-lg', icon: 'w-5 h-5', text: 'text-lg' },
    md: { box: 'w-10 h-10 rounded-xl', icon: 'w-6 h-6', text: 'text-xl' },
    lg: { box: 'w-12 h-12 rounded-2xl', icon: 'w-7 h-7', text: 'text-2xl' },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const textColorClass = variant === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 group transition-transform duration-200 active:scale-95 ${className}`}>
      {/* Icon Mark Emblem */}
      <div className={`${currentSize.box} bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-md shadow-sky-500/25 group-hover:shadow-sky-500/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center`}>
        <div className="w-full h-full bg-transparent rounded-[inherit] flex items-center justify-center text-white">
          <svg
            className={`${currentSize.icon} transform group-hover:rotate-6 transition-transform duration-300`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4.5L21 9.5L12 14.5L3 9.5L12 4.5Z" />
            <path d="M7 11.8V15.5C7 16.5 9.2 18.5 12 18.5C14.8 18.5 17 16.5 17 15.5V11.8" />
            <path d="M21 9.5V15.5" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`${currentSize.text} font-extrabold tracking-tight ${textColorClass} flex items-center`}>
          Learn<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500">ly</span>
        </span>
      )}
    </Link>
  );
}
