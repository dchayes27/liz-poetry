import React from 'react';

export function Button({ onClick, children, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 bg-[#2563EB] text-white rounded-full shadow-md text-xl font-sans hover:bg-[#1D4ED8] focus:ring-2 focus:ring-[#2563EB] focus:ring-opacity-50 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Textarea({ value, onChange, placeholder, className = "", ...props }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl font-sans focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`border border-gray-300 p-8 rounded-3xl shadow-xl bg-white font-sans ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`font-sans ${className}`} {...props}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, className = "" }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className="bg-red-500 h-3 rounded-full"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
