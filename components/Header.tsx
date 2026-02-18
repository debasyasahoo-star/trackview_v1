import React from 'react';
import { UserRole, Project } from '../types';

interface HeaderProps {
  user: { role: UserRole; name: string };
  project: Project | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, project, onLogout }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-10 py-5 flex items-center justify-between shadow-sm z-40">
      <div className="flex items-center gap-10">
        <div className="group">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-sky-500 transition-colors">Active Project</h2>
          <p className="text-sm font-extrabold text-navy-700 uppercase tracking-tight">{project?.name || 'Awaiting Project Initialization'}</p>
        </div>
        <div className="h-10 w-px bg-slate-200"></div>
        <div>
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Project Code</h2>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]"></div>
            <p className="text-sm font-black text-sky-700 font-mono tracking-widest bg-sky-50 px-3 py-0.5 rounded border border-sky-100 uppercase">
              {project?.code || 'X-NULL'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="text-right">
          <p className="text-xs font-black text-navy-700 uppercase tracking-tight mb-1">{user.name}</p>
          <span className="text-[10px] font-black text-white bg-navy-700 px-3 py-1 rounded-full uppercase tracking-widest">{user.role}</span>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-2.5 border-2 border-rose-200 text-rose-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 shadow-sm"
        >
          Secure Exit
        </button>
      </div>
    </header>
  );
};

export default Header;