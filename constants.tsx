import React from 'react';
import { ProjectStatus, ItemStatus } from './types';

export const STEPS = [
  ProjectStatus.REQUIREMENTS,
  ProjectStatus.WAREHOUSE,
  ProjectStatus.DISPATCH,
  ProjectStatus.CENTERS,
  ProjectStatus.EXAM,
  ProjectStatus.REPORTS,
  ProjectStatus.RETURNS
];

export const StatusBadge: React.FC<{ status: ItemStatus | string }> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case ItemStatus.COMPLETED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ItemStatus.IN_PROGRESS:
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case ItemStatus.PENDING:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case ItemStatus.MISMATCH:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest ${getColors()}`}>
      {status}
    </span>
  );
};

export const SearchFilterBar: React.FC<{ onSearch?: (v: string) => void }> = ({ onSearch }) => (
  <div className="flex gap-2 items-center">
    <div className="relative">
      <input 
        type="text" 
        placeholder="SEARCH RECORDS..." 
        className="pl-8 pr-3 py-2 bg-white border border-slate-200 rounded text-[10px] font-bold focus:ring-2 focus:ring-sky-500 outline-none w-48 uppercase tracking-widest transition-all"
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <button className="px-4 py-2 border border-slate-200 bg-white rounded text-[10px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-2 uppercase tracking-widest transition-colors">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
      Filter
    </button>
    <button className="px-4 py-2 bg-navy-700 text-white rounded text-[10px] font-black hover:bg-black flex items-center gap-2 uppercase tracking-widest transition-colors shadow-sm">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      Export
    </button>
  </div>
);

export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  children?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, title, message, children, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="px-10 py-8 bg-navy-700 text-white flex items-center gap-6">
          <div className="w-12 h-12 rounded-[1.25rem] bg-sky-500 flex items-center justify-center shadow-lg shrink-0">
             <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <h3 className="font-black text-base uppercase tracking-widest">{title}</h3>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1 opacity-70">Security Protocol Verification</p>
          </div>
        </div>
        <div className="px-10 py-10">
          <p className="text-sm text-slate-700 font-bold leading-relaxed uppercase tracking-tight">{message}</p>
          {children}
        </div>
        <div className="px-10 py-8 bg-slate-50 flex justify-end gap-5 border-t border-slate-100">
          <button onClick={onCancel} className="px-8 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">Abort</button>
          <button onClick={onConfirm} className="px-10 py-3.5 bg-sky-500 text-white text-[11px] font-black rounded-xl uppercase tracking-widest hover:bg-sky-600 shadow-xl active:scale-95 transition-all">Execute Final Lock</button>
        </div>
      </div>
    </div>
  );
};