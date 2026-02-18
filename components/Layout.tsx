
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserRole, Project } from '../types';

interface LayoutProps {
  user: { role: UserRole; name: string };
  project: Project | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, project, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role={user.role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} project={project} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
          
          <footer className="mt-auto pt-8 border-t border-gray-200 text-[10px] text-gray-400 font-mono">
            AUDIT LOG: {new Date().toISOString()} | USER: {user.name} ({user.role}) | IP: 192.168.1.45 | AUTH_SUCCESS
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
