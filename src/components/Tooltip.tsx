import React, { useRef, useState, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className={`inline-block relative ${className}`} style={{ verticalAlign: 'middle' }}>
      <span
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        onTouchEnd={e => { e.stopPropagation(); setOpen(o => !o); }}
        tabIndex={0}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 text-yellow-400 font-bold text-xs cursor-pointer ml-1 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        aria-label="Show info"
      >
        ?
      </span>
      {open && (
        <div className="absolute left-1/2 z-50 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg border-2 border-yellow-400 shadow-lg whitespace-nowrap" style={{ minWidth: 120 }}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 