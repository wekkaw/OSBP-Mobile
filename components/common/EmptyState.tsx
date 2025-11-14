import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <div className="text-center p-8 rounded-2xl bg-slate-500/5 my-4">
      <div className="mx-auto w-16 h-16 text-slate-400 dark:text-slate-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;