import React from 'react';

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => (
  <div className="w-full">
    <label htmlFor={label} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-3 border-0 rounded-xl bg-slate-100 dark:bg-slate-800/80 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm shadow-sm"
    >
      <option value="all">All {label}s</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default FilterSelect;