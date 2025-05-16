import React from 'react';

export function Button({ onClick, children, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 bg-[#F34951] text-white rounded-full shadow-md text-xl font-['Comic_Sans_MS'] hover:bg-[#E03840] focus:ring-2 focus:ring-[#F34951] focus:ring-opacity-50 disabled:opacity-50 ${className}`}
      {...props}
      aria-label={props['aria-label'] || 'Button'}
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
      className={`w-full px-4 py-3 border border-[#1E4147] rounded-xl font-['Comic_Sans_MS'] focus:ring-2 focus:ring-[#1E4147] focus:ring-opacity-50 ${className}`}
      {...props}
      aria-label={props['aria-label'] || 'Textarea'}
    />
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`border border-[#1E4147] p-8 rounded-3xl shadow-xl bg-[#FAE3B4] font-['Comic_Sans_MS'] ${className}`}
      {...props}
      aria-label={props['aria-label'] || 'Card'}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`font-['Comic_Sans_MS'] ${className}`} {...props} aria-label={props['aria-label'] || 'Card Content'}>
      {children}
    </div>
  );
}
