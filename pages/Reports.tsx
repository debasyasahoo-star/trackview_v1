import React from 'react';
import { UserRole, Project } from '../types';

interface ReportsProps {
  role: UserRole;
  project: Project | null;
}

const Reports: React.FC<ReportsProps> = ({ role, project }) => {
  const canUpload = role === UserRole.ADMIN || role === UserRole.IIL_OPS;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {canUpload && (
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 border-b border-slate-100 pb-4">Phase A: System Log Synchronization</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <p className="text-sm font-black text-navy-700 uppercase tracking-tight">Upload IMZ Operation Artifacts</p>
                    <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-16 flex flex-col items-center bg-slate-50/50 group hover:border-sky-200 transition-all cursor-pointer">
                        <input type="file" className="hidden" id="reportUpload" />
                        <label htmlFor="reportUpload" className="cursor-pointer flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 text-slate-300 group-hover:text-sky-500 transition-all">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <p className="font-black text-navy-700 uppercase tracking-tight text-sm">Upload IMZ Telemetry Log</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Supports multiple shifts in a single payload</p>
                        </label>
                    </div>
                </div>

                <div className="bg-navy-900 p-10 rounded-[2.5rem] text-white border border-slate-800 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-6">Real-Time Insight Engine</p>
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                            <span className="text-[11px] font-black text-slate-500 uppercase">Operational Shifts</span>
                            <span className="text-2xl font-black text-white font-mono">{project?.shifts.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                            <span className="text-[11px] font-black text-slate-500 uppercase">Target Device Pool</span>
                            <span className="text-2xl font-black text-white font-mono">{project?.totalLocks.toLocaleString() || 0}</span>
                        </div>
                        <button className="w-full mt-4 bg-sky-500 text-white font-black px-8 py-5 rounded-2xl text-[11px] uppercase tracking-widest shadow-2xl shadow-sky-900/40 hover:bg-sky-600 active:scale-95 transition-all">Execute Compliance Audit</button>
                    </div>
                </div>
            </div>
        </section>
      )}

      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 className="font-black text-navy-700 uppercase tracking-tighter text-xl">Operational Audit Registry</h3>
            <div className="flex gap-4">
                <button className="bg-white border-2 border-slate-100 text-slate-500 text-[10px] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest hover:bg-slate-50 transition-all">Archive PDF</button>
                <button className="bg-sky-500 text-white text-[10px] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest shadow-lg shadow-sky-100 hover:bg-sky-600 active:scale-95 transition-all">Export Datashift</button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                        <th className="px-10 py-6 tracking-widest">Artifact Nomenclature</th>
                        <th className="px-10 py-6 tracking-widest">Generation Stamp</th>
                        <th className="px-10 py-6 tracking-widest">Classification</th>
                        <th className="px-10 py-6 tracking-widest">Audit Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                    {[
                        { name: 'Shift 1: Deployment Audit', date: '2024-06-16 12:00', type: 'Operational', status: 'Finalized' },
                        { name: 'Shift 2: Deployment Audit', date: '2024-06-16 18:00', type: 'Operational', status: 'Processing' },
                        { name: 'Global Material Reconciliation', date: '2024-06-17 10:00', type: 'Reconciliation', status: 'Ready' }
                    ].map((rep, i) => (
                        <tr key={i} className="hover:bg-sky-50/20 transition-colors group">
                            <td className="px-10 py-7 font-black text-sky-600 hover:underline cursor-pointer uppercase tracking-tight text-base">{rep.name}</td>
                            <td className="px-10 py-7 text-slate-400 font-mono text-[11px] font-black">{rep.date}</td>
                            <td className="px-10 py-7 text-slate-500 font-black uppercase text-[10px] tracking-widest">{rep.type}</td>
                            <td className="px-10 py-7">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${rep.status === 'Finalized' || rep.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'}`}>
                                    {rep.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;