import React, { useState } from 'react';
import { Project } from '../types';

interface MasterDataUploadProps {
  project: Project | null;
}

const MasterDataUpload: React.FC<MasterDataUploadProps> = ({ project }) => {
  const [selectedShiftId, setSelectedShiftId] = useState(project?.shifts[0]?.id || '');
  
  const [centers, setCenters] = useState([
    { name: 'DPS Rohini', code: 'C-001', geo: 'Verified' },
    { name: 'DAV Public School', code: 'C-002', geo: 'Pending' },
    { name: 'St. Xavier High', code: 'C-003', geo: 'Verified' }
  ]);

  const [devices, setDevices] = useState([
    { id: 'L-5001', nom: 'SmartLock v3', rfid: 'Active' },
    { id: 'L-5002', nom: 'SmartLock v3', rfid: 'Inactive' },
    { id: 'L-5003', nom: 'SmartLock v3', rfid: 'Active' }
  ]);

  return (
    <div className="space-y-12">
      {/* Shift Selector if multiple exist */}
      {project && project.shifts.length > 1 && (
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm flex items-center justify-between">
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deployment Context</h4>
                <p className="text-sm font-black text-navy-700 uppercase">Multiple Operational Shifts Detected</p>
            </div>
            <select 
                className="bg-sky-50 border border-sky-200 rounded-xl px-6 py-3 text-xs font-black text-sky-700 uppercase tracking-widest outline-none focus:ring-4 focus:ring-sky-100"
                value={selectedShiftId}
                onChange={e => setSelectedShiftId(e.target.value)}
            >
                {project.shifts.map(s => <option key={s.id} value={s.id}>{s.shiftName}</option>)}
            </select>
        </div>
      )}

      {/* Section A: Center Mapping */}
      <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="font-black text-navy-700 uppercase tracking-tighter text-xl">Center Repository Upload</h3>
          <button className="text-[10px] font-black text-sky-600 hover:underline uppercase tracking-widest">Download Template</button>
        </div>
        <div className="p-10">
          <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-16 flex flex-col items-center justify-center bg-slate-50/50 mb-10 group hover:border-sky-200 transition-all cursor-pointer">
             <input type="file" className="hidden" id="centerUpload" />
             <label htmlFor="centerUpload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 text-slate-400 group-hover:text-sky-500 transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <p className="text-sm font-black text-navy-700 uppercase tracking-tight">Select Center Mapping Payload</p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Supports .XLSX, .CSV (Max 25MB)</p>
             </label>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Center Name</th>
                  <th className="px-8 py-5">Center Code</th>
                  <th className="px-8 py-5 text-right">Geo Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {centers.map((c, i) => (
                  <tr key={i} className="hover:bg-sky-50/30 transition-colors">
                    <td className="px-8 py-6 text-navy-700 font-black uppercase">{c.name}</td>
                    <td className="px-8 py-6 text-slate-500 font-mono font-black">{c.code}</td>
                    <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${c.geo === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {c.geo}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section B: Device List */}
      <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="font-black text-navy-700 uppercase tracking-tighter text-xl">Hardware Inventory Pool</h3>
          <button className="text-[10px] font-black text-sky-600 hover:underline uppercase tracking-widest">Download Template</button>
        </div>
        <div className="p-10">
          <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-16 flex flex-col items-center justify-center bg-slate-50/50 mb-10 group hover:border-sky-200 transition-all cursor-pointer">
             <input type="file" className="hidden" id="deviceUpload" />
             <label htmlFor="deviceUpload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 text-slate-400 group-hover:text-sky-500 transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <p className="text-sm font-black text-navy-700 uppercase tracking-tight">Select Device Serial Index</p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Unique LockID Verification Required</p>
             </label>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">System Lock ID</th>
                  <th className="px-8 py-5">Device Nomenclature</th>
                  <th className="px-8 py-5 text-right">Auth Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {devices.map((d, i) => (
                  <tr key={i} className="hover:bg-sky-50/30 transition-colors">
                    <td className="px-8 py-6 text-navy-700 font-black font-mono text-base">{d.id}</td>
                    <td className="px-8 py-6 text-slate-500 uppercase font-black tracking-tight">{d.nom}</td>
                    <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${d.rfid === 'Active' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                            {d.rfid}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MasterDataUpload;