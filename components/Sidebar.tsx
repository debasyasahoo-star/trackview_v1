import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const allRoles = Object.values(UserRole);
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', roles: allRoles },
    { label: 'Project Setup', path: '/admin/setup', roles: [UserRole.ADMIN] },
    { label: 'Requirements', path: '/requirements', roles: [UserRole.ADMIN, UserRole.IIL_OPS] },
    { label: 'Master Data', path: '/master-data', roles: [UserRole.ADMIN, UserRole.IIL_OPS] },
    { label: 'Warehouse Receiving', path: '/warehouse', roles: [UserRole.ADMIN, UserRole.WAREHOUSE, UserRole.IIL_OPS] },
    { label: 'Dispatch Setup', path: '/dispatch-setup', roles: [UserRole.ADMIN, UserRole.WAREHOUSE] },
    { label: 'Dispatch Tracking', path: '/dispatch-tracking', roles: allRoles },
    { label: 'Client Confirmation', path: '/client-confirmation', roles: [UserRole.ADMIN, UserRole.CLIENT] },
    { label: 'Lock Mapping', path: '/lock-mapping', roles: [UserRole.ADMIN, UserRole.IIL_OPS, UserRole.CLIENT] },
    { label: 'Reports', path: '/reports', roles: allRoles },
    { label: 'Reverse Logistics', path: '/returns', roles: allRoles },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-72 bg-white text-navy-700 flex flex-col shrink-0 border-r border-slate-200 shadow-xl z-50">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col group cursor-default">
          <div className="text-4xl font-black tracking-[-0.08em] text-navy-900 uppercase leading-none">
            Track
          </div>
          <div className="flex items-center mt-[-2px]">
            <div className="h-[4px] w-14 bg-sky-500 rounded-full"></div>
            <div className="text-3xl font-black tracking-tighter text-sky-500 lowercase ml-0.5 leading-none">
              view
            </div>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-4">Control Center Interface</p>
      </div>
      
      <nav className="flex-1 py-6 overflow-y-auto px-4 space-y-1">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-6 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${
                isActive 
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                : 'text-slate-500 hover:text-navy-700 hover:bg-slate-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Build Status</p>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">V2.4.0-PRD-01</p>
      </div>
    </aside>
  );
};

export default Sidebar;