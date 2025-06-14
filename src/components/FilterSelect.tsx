import React from 'react';

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  color?: string; // e.g. '#ff7a00' for CS2
  className?: string;
}

export default function FilterSelect({ label, value, onChange, options, color = '#888', className = '' }: FilterSelectProps) {
  const outline = '#6B7280'; // Tailwind gray-500
  return (
    <div className={`relative ${className}`} style={{ minWidth: 140 }}>
      <label className="block text-xs font-bold mb-1 tracking-wide uppercase text-gray-300">{label}</label>
      <div className="relative">
        <select
          className="appearance-none w-full bg-gray-950 text-white font-semibold px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 border-2 border-gray-700 focus:border-gray-400 transition-all duration-150 shadow-geometric"
          value={value}
          onChange={onChange}
          style={{
            clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)',
            borderColor: outline,
            boxShadow: `0 0 0 2px ${outline}33`,
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Custom SVG Arrow */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <polygon points="5,8 10,13 15,8" fill={outline} />
          </svg>
        </span>
      </div>
    </div>
  );
} 