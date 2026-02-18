import React from 'react';
import { Project, ProjectStatus } from '../types';
import { STEPS } from '../constants';

interface DashboardProps {
  project: Project | null;
}

const Dashboard: React.FC<DashboardProps> = ({ project }) => {
  if (!project) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </div>
        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Active Deployment</h2>
        <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-tight">Select a valid project from the administrative panel to begin.</p>
    </div>
  );

  const currentStepIndex = STEPS.indexOf(project.status);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Exam Deployment', value: project.examDate, color: 'text-sky-600' },
          { label: 'Total Centers', value: project.totalCenters.toLocaleString(), color: 'text-navy-900' },
          { label: 'Inventory Locks', value: project.totalLocks.toLocaleString(), color: 'text-navy-900' },
          { label: 'Current Phase', value: project.status, color: 'text-emerald-600' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-hover:text-sky-500 transition-colors">{card.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <section className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Operational Deployment Pipeline</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div 
                key={step} 
                className={`flex-1 min-w-[140px] flex flex-col items-center justify-center py-5 rounded-xl border transition-all duration-300 ${
                  isActive 
                  ? 'bg-sky-500 border-sky-500 shadow-xl shadow-sky-100 ring-4 ring-sky-50' 
                  : isCompleted 
                  ? 'bg-sky-50 border-sky-100' 
                  : 'bg-slate-50 border-slate-100 opacity-50'
                }`}
              >
                <div className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isActive ? 'text-sky-100' : isCompleted ? 'text-sky-400' : 'text-slate-400'}`}>
                  Node 0{index + 1}
                </div>
                <div className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-white' : isCompleted ? 'text-sky-800' : 'text-slate-400'}`}>
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h4 className="text-xs font-black text-navy-900 uppercase tracking-widest">Deployment Audit Logs</h4>
                <button className="text-[10px] font-black text-sky-600 hover:underline uppercase tracking-widest">Global Log</button>
            </div>
            <div className="p-8 flex-1">
                <ul className="space-y-8">
                    {[
                        { time: '10:45 AM', text: 'MASTER CENTER MAPPING (V2.0) VERIFIED', user: 'SUMIT R. (IIL OPS)', type: 'SECURITY' },
                        { time: '09:12 AM', text: 'HARDWARE REQUIREMENTS APPROVED', user: 'ANITA S. (ADMIN)', type: 'SYSTEM' },
                        { time: 'YESTERDAY', text: 'INITIAL PROJECT PROVISIONING COMPLETE', user: 'ROOT (ADMIN)', type: 'AUTH' }
                    ].map((ev, i) => (
                        <li key={i} className="flex items-start gap-6 group">
                            <div className="shrink-0 w-2.5 h-2.5 mt-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)] group-hover:scale-125 transition-transform"></div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[13px] font-black text-navy-900 uppercase tracking-tight">{ev.text}</span>
                                    <span className="text-[10px] font-black text-slate-300 font-mono">{ev.time}</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-[10px] text-slate-400 font-black tracking-widest">USER ID: {ev.user}</span>
                                    <span className="text-[10px] text-sky-500 font-black tracking-widest">NODE: {ev.type}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center text-center border border-slate-100">
            <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mb-8 border border-sky-100">
                <svg className="w-12 h-12 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-navy-900 tracking-widest mb-4 uppercase">Next Milestone</h3>
            <p className="text-xs text-slate-500 mb-10 leading-relaxed font-bold uppercase tracking-wide">Phase requirements confirmed. Inventory handover expected in <span className="text-sky-500 font-black">24 hours</span>.</p>
            <button className="w-full bg-navy-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-200 text-[10px] uppercase tracking-widest active:scale-95">
                ACCESS MASTER DATA INTERFACE
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;