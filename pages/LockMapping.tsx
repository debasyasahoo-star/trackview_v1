import React, { useState } from 'react';
import { Project } from '../types';
import { SearchFilterBar } from '../constants';

interface LockMappingProps {
  project: Project | null;
}

const LockMapping: React.FC<LockMappingProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'excel'>('manual');
  const [selectedShiftId, setSelectedShiftId] = useState(project?.shifts[0]?.id || '');
  const [mappings, setMappings] = useState([
    { lockId: 'L-5001', centerCode: 'C-001', centerName: 'DPS Rohini', status: 'Mapped', shift: 'Morning' },
    { lockId: 'L-5002', centerCode: 'C-001', centerName: 'DPS Rohini', status: 'Mapped', shift: 'Morning' },
    { lockId: 'L-5003', centerCode: 'C-002', centerName: 'DAV Public School', status: 'Mapped', shift: 'Evening' }
  ]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Shift Filter for Mapping */}
      {project && project.shifts.length > 1 && (
        <div className="bg-navy-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-slate-800">
           <div>
              <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1.5 opacity-80">Shift Mapping Context</p>
              <h2 className="text-xl font-black uppercase tracking-tighter">Inventory Association Layer</h2>
           </div>
           <select 
                className="bg-sky-500 border-none rounded-xl px-8 py-4 text-xs font-black text-white uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-500/30 cursor-pointer shadow-lg"
                value={selectedShiftId}
                onChange={e => setSelectedShiftId(e.target.value)}
            >
                {project.shifts.map(s => <option key={s.id} value={s.id}>{s.shiftName}</option>)}
            </select>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex bg-slate-50/50 border-b border-slate-100 p-2">
            <button 
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'manual' ? 'bg-white text-sky-500 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Manual Entry Node
            </button>
            <button 
                onClick={() => setActiveTab('excel')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'excel' ? 'bg-white text-sky-500 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
            >
                Bulk Mapping Protocol
            </button>
        </div>

        <div className="p-10">
            {activeTab === 'manual' ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Assign Lock ID</label>
                            <select className="w-full border-2 border-slate-100 p-4 rounded-xl text-xs font-black text-navy-700 uppercase bg-white outline-none focus:border-sky-500 transition-all">
                                <option>L-5004</option>
                                <option>L-5005</option>
                                <option>L-5006</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Target Center Node</label>
                            <select className="w-full border-2 border-slate-100 p-4 rounded-xl text-xs font-black text-navy-700 uppercase bg-white outline-none focus:border-sky-500 transition-all">
                                <option>C-001 | DPS Rohini</option>
                                <option>C-002 | DAV Public School</option>
                                <option>C-003 | St. Xavier High</option>
                            </select>
                        </div>
                        <button className="bg-sky-500 text-white text-[10px] font-black py-4 rounded-xl shadow-xl shadow-sky-100 hover:bg-sky-600 uppercase tracking-widest transition-all active:scale-95">Link Device</button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Device Association Registry</h4>
                            <SearchFilterBar />
                        </div>
                        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-inner">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50/50 text-[9px] font-black text-slate-500 uppercase border-b border-slate-100">
                                  <tr>
                                      <th className="px-8 py-5">Serial</th>
                                      <th className="px-8 py-5">Center ID</th>
                                      <th className="px-8 py-5">Node Name</th>
                                      <th className="px-8 py-5">Operational Shift</th>
                                      <th className="px-8 py-5 text-right">System Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50 text-xs">
                                  {mappings.map((m, i) => (
                                      <tr key={i} className="hover:bg-sky-50/20 transition-colors group">
                                          <td className="px-8 py-6 font-mono text-navy-700 font-black text-base">{m.lockId}</td>
                                          <td className="px-8 py-6 text-slate-400 font-black">{m.centerCode}</td>
                                          <td className="px-8 py-6 text-navy-700 font-black uppercase tracking-tight">{m.centerName}</td>
                                          <td className="px-8 py-6">
                                              <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-sky-100">{m.shift}</span>
                                          </td>
                                          <td className="px-8 py-6 text-right">
                                              <button className="text-rose-500 font-black hover:text-rose-700 text-[10px] uppercase tracking-widest transition-colors">Unlink</button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in duration-500">
                    <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-24 flex flex-col items-center bg-slate-50/50 group hover:border-sky-200 transition-all cursor-pointer">
                        <input type="file" className="hidden" id="mappingUpload" />
                        <label htmlFor="mappingUpload" className="cursor-pointer flex flex-col items-center group">
                            <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center mb-8 text-slate-400 group-hover:text-sky-500 transition-all group-hover:scale-110">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                            <p className="font-black text-navy-700 text-xl tracking-tighter uppercase">Drop Bulk Mapping Manifest</p>
                            <p className="text-[10px] text-slate-400 mt-3 text-center max-w-sm font-black uppercase tracking-widest opacity-70">Excel Schema: <b>device_id, center_code, shift_id</b></p>
                        </label>
                    </div>
                    
                    <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] flex items-start gap-6 animate-in slide-in-from-top-4">
                         <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-200">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-rose-800 uppercase tracking-[0.2em] mb-3">Validation Protocol Exceptions (12)</p>
                            <ul className="text-xs text-rose-600 space-y-2 font-bold uppercase tracking-tight list-inside list-disc opacity-90">
                                <li>Index 45: Lock Serial <span className="font-mono bg-rose-100 px-2 rounded">L-5999</span> unrecognized in project inventory pool.</li>
                                <li>Index 102: Destination Node <span className="font-mono bg-rose-100 px-2 rounded">C-XXX</span> resolution failed.</li>
                            </ul>
                         </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LockMapping;