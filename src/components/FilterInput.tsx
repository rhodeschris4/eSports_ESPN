import React from 'react';

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  color?: string;
  className?: string;
  min?: number;
}

export default function FilterInput({ label, value, onChange, type = 'text', placeholder = '', color = '#888', className = '', min }: FilterInputProps) {
  const outline = '#6B7280'; // Tailwind gray-500
  return (
    <div className={`relative ${className}`} style={{ minWidth: 140 }}>
      <label className="block text-xs font-bold mb-1 tracking-wide uppercase text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full bg-gray-950 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 border-2 border-gray-700 focus:border-gray-400 transition-all duration-150 shadow-geometric"
        style={{
          clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)',
          borderColor: outline,
          boxShadow: `0 0 0 2px ${outline}33`,
        }}
      />
    </div>
  );
} 