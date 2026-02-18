import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { StatusBadge } from '../constants';

interface AdminProjectSetupProps {
  projects: Project[];
  onAddProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
  onSelectProject: (p: Project) => void;
}

const AdminProjectSetup: React.FC<AdminProjectSetupProps> = ({ projects, onAddProject, onUpdateProject, onSelectProject }) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    client: '', 
    code: '', 
    projectPasscode: '', 
    adminPasscode: '' 
  });

  const handleAction = () => {
    if (!form.name || !form.client || !form.code || !form.projectPasscode || !form.adminPasscode) {
      alert("Validation Error: All fields, including security passcodes, are mandatory for system integrity.");
      return;
    }

    if (editingProjectId) {
      const existing = projects.find(p => p.id === editingProjectId);
      if (existing) {
        const updated: Project = {
          ...existing,
          name: form.name.trim(),
          client: form.client.trim(),
          code: form.code.toUpperCase().trim(),
          projectPasscode: form.projectPasscode.trim(),
          adminPasscode: form.adminPasscode.trim()
        };
        onUpdateProject(updated);
        alert(`REGISTRY_SYNC: Project "${updated.code}" updated successfully. New credentials are now live for all roles.`);
      }
      setEditingProjectId(null);
    } else {
      // Check for duplicate codes before adding
      if (projects.some(p => p.code === form.code.toUpperCase().trim())) {
        alert("Registry Conflict: A project with this code already exists.");
        return;
      }

      const newProject: Project = {
        id: Date.now().toString(),
        name: form.name.trim(),
        client: form.client.trim(),
        code: form.code.toUpperCase().trim(),
        examDate: 'TBD',
        status: ProjectStatus.REQUIREMENTS,
        totalCenters: 0,
        totalLocks: 0,
        shifts: [],
        manualRequirements: [],
        projectPasscode: form.projectPasscode.trim(),
        adminPasscode: form.adminPasscode.trim()
      };
      onAddProject(newProject);
      alert(`PROVISION_SUCCESS: Node "${newProject.code}" established in the master registry.`);
    }
    
    // Reset form
    setForm({ name: '', client: '', code: '', projectPasscode: '', adminPasscode: '' });
  };

  const startEdit = (p: Project) => {
    console.debug(`[ADMIN] Initiating modification for project: ${p.code}`);
    setEditingProjectId(p.id);
    setForm({
      name: p.name,
      client: p.client,
      code: p.code,
      projectPasscode: p.projectPasscode,
      adminPasscode: p.adminPasscode
    });
    // Scroll to form for immediate visual focus
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
    setForm({ name: '', client: '', code: '', projectPasscode: '', adminPasscode: '' });
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const p = projects.find(proj => proj.id === projectId);
    if (p) {
      onUpdateProject({ ...p, status: newStatus });
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Configuration Console */}
      <section className={`bg-white rounded-[2.5rem] border-2 shadow-sm overflow-hidden transition-all duration-300 ${editingProjectId ? 'border-sky-500 ring-4 ring-sky-50 bg-sky-50/10' : 'border-slate-100'}`}>
        <div className={`px-10 py-8 border-b border-slate-100 flex justify-between items-center ${editingProjectId ? 'bg-sky-50' : 'bg-slate-50/50'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${editingProjectId ? 'bg-sky-600 animate-pulse' : 'bg-navy-900'}`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {editingProjectId ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                 )}
               </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-navy-700 uppercase tracking-tighter">
                {editingProjectId ? 'Modify Project Registry' : 'Establish New Project Node'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                {editingProjectId ? 'UPDATING SYSTEM CONFIGURATION & SECURITY KEYS' : 'DEFINE GLOBAL IDENTIFIERS AND BASELINE ACCESS PROTOCOLS'}
              </p>
            </div>
          </div>
          {editingProjectId && (
            <button 
              onClick={cancelEdit}
              className="px-6 py-2.5 bg-white border-2 border-slate-200 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
            >
              Cancel Modification
            </button>
          )}
        </div>
        
        <div className="p-10 space-y-12">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">Project Name</label>
              <input 
                className="w-full border-2 border-slate-200 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-navy-700 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 outline-none transition-all placeholder:text-slate-300"
                placeholder="e.g. UPSC CSE 2025"
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">Client Agency</label>
              <input 
                className="w-full border-2 border-slate-200 bg-slate-50/50 rounded-2xl p-4 text-sm font-bold text-navy-700 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 outline-none transition-all placeholder:text-slate-300"
                placeholder="Enter Organization Name"
                value={form.client}
                onChange={e => setForm({...form, client: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">Registry Code (Unique)</label>
              <input 
                className="w-full border-2 border-slate-200 bg-slate-50/50 rounded-2xl p-4 text-sm font-black font-mono tracking-widest text-sky-700 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 outline-none transition-all placeholder:text-slate-300 uppercase"
                placeholder="OSS"
                value={form.code}
                onChange={e => setForm({...form, code: e.target.value})}
              />
            </div>
          </div>

          {/* Security Credential Plane */}
          <div className={`p-10 rounded-[2.5rem] border-2 border-dashed space-y-10 transition-colors ${editingProjectId ? 'bg-sky-50 border-sky-300' : 'bg-slate-50 border-slate-200'}`}>
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${editingProjectId ? 'bg-sky-600' : 'bg-navy-900'}`}>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                   <h3 className="text-base font-black text-navy-900 uppercase tracking-tight">Access Control Keys</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Set unique authentication keys for different access tiers</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">Standard Tier Passcode</label>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Required for OPS, WAREHOUSE, and CLIENT roles</p>
                  <input 
                    type="text"
                    className="w-full border-2 border-slate-200 bg-white rounded-2xl p-5 text-sm font-bold text-navy-700 focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all shadow-sm"
                    placeholder="Enter standard key"
                    value={form.projectPasscode}
                    onChange={e => setForm({...form, projectPasscode: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[11px] font-black text-sky-700 uppercase tracking-widest">Root Administrator Passcode</label>
                  <p className="text-[9px] text-sky-400 font-bold uppercase tracking-wider">Restricted key for full system overrides</p>
                  <input 
                    type="text"
                    className="w-full border-2 border-sky-200 bg-white rounded-2xl p-5 text-sm font-black text-sky-700 focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all shadow-sm"
                    placeholder="Enter root admin key"
                    value={form.adminPasscode}
                    onChange={e => setForm({...form, adminPasscode: e.target.value})}
                  />
                </div>
             </div>
          </div>
        </div>
        
        <div className={`px-10 py-8 flex gap-4 border-t border-slate-100 ${editingProjectId ? 'bg-sky-50' : 'bg-slate-50/80'}`}>
          <button 
            onClick={handleAction}
            className={`flex-1 text-[11px] font-black px-12 py-5 rounded-2xl uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 ${editingProjectId ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-navy-900 text-white hover:bg-black'}`}
          >
            {editingProjectId ? 'Synchronize Registry Changes' : 'Authorize & Establish Node'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </button>
          <button 
            onClick={editingProjectId ? cancelEdit : () => setForm({ name: '', client: '', code: '', projectPasscode: '', adminPasscode: '' })}
            className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-400 text-[11px] font-black rounded-2xl uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all shadow-sm"
          >
            Reset Snapshot
          </button>
        </div>
      </section>

      {/* Registry Database */}
      <section className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-navy-700 uppercase tracking-tighter">Master Project Registry</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit and update deployment metadata and security credentials</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-10 py-7">Project Identity</th>
                <th className="px-10 py-7">Registry Code</th>
                <th className="px-10 py-7">Current Phase</th>
                <th className="px-10 py-7 text-right">System Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map(p => (
                <tr key={p.id} className={`hover:bg-sky-50/10 transition-all group ${editingProjectId === p.id ? 'bg-sky-50 ring-2 ring-inset ring-sky-200' : ''}`}>
                  <td className="px-10 py-8">
                    <p className={`text-lg font-black uppercase tracking-tight transition-colors ${editingProjectId === p.id ? 'text-sky-600' : 'text-navy-700'}`}>{p.name}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Client Agency: {p.client}</p>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-mono text-sm font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100 uppercase tracking-widest">
                      {p.code}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <select 
                        className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black text-navy-700 uppercase tracking-widest outline-none focus:border-sky-500 transition-all cursor-pointer shadow-sm"
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as ProjectStatus)}
                      >
                        {Object.values(ProjectStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <StatusBadge status={p.status} />
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => startEdit(p)}
                        className={`p-3 rounded-xl border-2 transition-all shadow-sm ${editingProjectId === p.id ? 'bg-sky-500 border-sky-500 text-white animate-pulse' : 'bg-white border-slate-100 text-slate-400 hover:text-sky-500 hover:border-sky-500 hover:shadow-md'}`}
                        title="Modify System Parameters"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => onSelectProject(p)}
                        className="bg-sky-500 text-white text-[10px] font-black px-8 py-3.5 rounded-xl uppercase tracking-widest hover:bg-sky-600 shadow-xl shadow-sky-100 active:scale-95 transition-all"
                      >
                        Enter Node
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30 grayscale">
                      <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <span className="text-xs font-black uppercase tracking-[0.4em]">Empty Registry Cache</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminProjectSetup;