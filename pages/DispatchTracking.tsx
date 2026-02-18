import React, { useState } from 'react';
import { Project } from '../types';

interface VehicleUpdate {
  timestamp: string;
  status: string;
  location: string;
  document?: string;
}

interface VehicleTracking {
  id: string;
  plateNo: string;
  status: string;
  updates: VehicleUpdate[];
}

interface PhaseTracking {
  id: string;
  vendorName: string;
  isOtherVendor: boolean;
  eta: string;
  vehicles: VehicleTracking[];
}

interface DispatchTrackingProps {
  project: Project | null;
}

const DispatchTracking: React.FC<DispatchTrackingProps> = ({ project }) => {
  // Mock data representing phases with individual vehicle telemetry
  const [phases, setPhases] = useState<PhaseTracking[]>([
    {
      id: 'DS-01',
      vendorName: 'SafeExam Logistics India',
      isOtherVendor: false,
      eta: '02:30 PM (Today)',
      vehicles: [
        {
          id: 'v1',
          plateNo: 'DL-01-AX-4432',
          status: 'In Transit',
          updates: [
            { timestamp: '11:20 AM', status: 'In Transit', location: 'Panipat Toll' },
            { timestamp: '09:00 AM', status: 'Dispatched', location: 'Central Hub' }
          ]
        },
        {
          id: 'v2',
          plateNo: 'HR-55-BT-1102',
          status: 'Arrived',
          updates: [
            { timestamp: '12:15 PM', status: 'Arrived', location: 'Destination Node' },
            { timestamp: '09:15 AM', status: 'Dispatched', location: 'Central Hub' }
          ]
        }
      ]
    },
    {
      id: 'DS-02',
      vendorName: 'Manual Express Logistics',
      isOtherVendor: true,
      eta: 'TBD',
      vehicles: [
        {
          id: 'v3',
          plateNo: 'UP-14-CZ-7788',
          status: 'Awaiting Update',
          updates: []
        },
        {
          id: 'v4',
          plateNo: 'UP-16-BD-9090',
          status: 'Awaiting Update',
          updates: []
        }
      ]
    }
  ]);

  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [activeVehicleIdx, setActiveVehicleIdx] = useState(0);

  const activePhase = phases[activePhaseIdx];
  const activeVehicle = activePhase.vehicles[activeVehicleIdx];

  // Manual update form state
  const [targetVehicleIdx, setTargetVehicleIdx] = useState(0);
  const [manualStatus, setManualStatus] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [manualDoc, setManualDoc] = useState<string | null>(null);

  const handleManualPush = () => {
    if (!manualStatus || !manualLocation) return;
    
    const newPhases = [...phases];
    const targetPhase = newPhases[activePhaseIdx];
    const targetVehicle = targetPhase.vehicles[targetVehicleIdx];

    targetVehicle.updates.unshift({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: manualStatus,
      location: manualLocation,
      document: manualDoc || undefined
    });
    targetVehicle.status = manualStatus;
    
    setPhases(newPhases);
    setManualStatus('');
    setManualLocation('');
    setManualDoc(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-4 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-navy-700 uppercase tracking-tighter">Fleet Consignment Tracking</h2>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-[11px] text-sky-600 font-black font-mono bg-sky-50 px-3 py-1 rounded uppercase tracking-widest border border-sky-100">Project Code: {project?.code || 'X-NULL'}</p>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Phase {activePhase.id} Monitoring</p>
          </div>
        </div>
        <div className="text-center md:text-right bg-navy-900 text-white px-8 py-5 rounded-2xl shadow-xl min-w-[240px]">
          <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest block mb-2 opacity-60">Vendor Manifest</span>
          <p className="text-sm font-black uppercase tracking-tight">{activePhase.vendorName}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Global ETA: {activePhase.eta}</p>
        </div>
      </div>

      {/* Consignment Phase Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 -mx-8 px-8 flex overflow-x-auto no-scrollbar gap-12 pt-4">
        {phases.map((phase, idx) => (
           <button
              key={phase.id}
              onClick={() => {
                setActivePhaseIdx(idx);
                setActiveVehicleIdx(0);
                setTargetVehicleIdx(0);
              }}
              className={`pb-5 pt-3 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap ${activePhaseIdx === idx ? 'text-sky-500' : 'text-slate-300 hover:text-slate-500'}`}
           >
              Phase {phase.id}
              {activePhaseIdx === idx && <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-t-full shadow-lg"></div>}
           </button>
        ))}
      </div>

      {/* Vehicle Selector (Sub-tabs) */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        {activePhase.vehicles.map((vh, idx) => (
          <button
            key={vh.id}
            onClick={() => setActiveVehicleIdx(idx)}
            className={`px-6 py-4 rounded-2xl border-2 transition-all flex items-center gap-4 shrink-0 ${activeVehicleIdx === idx ? 'bg-sky-500 border-sky-500 text-white shadow-xl shadow-sky-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeVehicleIdx === idx ? 'bg-sky-200' : 'bg-slate-300'}`}></div>
            <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Vehicle Plate</p>
              <p className="text-xs font-black font-mono tracking-widest">{vh.plateNo}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Phase Info & Manual Form */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 text-[40px] font-black text-slate-50 opacity-10 pointer-events-none">DATA</div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Active Vehicle Stats</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase">Current Status</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${activeVehicle.status.toLowerCase().includes('awaiting') ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                   {activeVehicle.status}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase">Updates Logged</span>
                <span className="text-lg font-black text-navy-700 font-mono">{activeVehicle.updates.length}</span>
              </div>
            </div>
          </div>

          {activePhase.isOtherVendor && (
            <div className="bg-navy-900 text-white p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Manual Fleet Update</h4>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Vehicle</label>
                  <select 
                    className="w-full bg-navy-800 border border-slate-800 rounded-xl p-4 text-xs font-black text-white uppercase tracking-widest focus:border-sky-500 outline-none cursor-pointer"
                    value={targetVehicleIdx}
                    onChange={e => setTargetVehicleIdx(parseInt(e.target.value))}
                  >
                    {activePhase.vehicles.map((v, i) => (
                      <option key={v.id} value={i}>{v.plateNo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Operation Status</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy-800 border border-slate-800 rounded-xl p-4 text-xs font-black text-white uppercase tracking-widest focus:border-sky-500 outline-none"
                    placeholder="e.g. LOADING COMPLETE"
                    value={manualStatus}
                    onChange={e => setManualStatus(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Geolocation Node</label>
                  <input 
                    type="text" 
                    className="w-full bg-navy-800 border border-slate-800 rounded-xl p-4 text-xs font-black text-white uppercase tracking-widest focus:border-sky-500 outline-none"
                    placeholder="e.g. AGRA BYPASS HUB"
                    value={manualLocation}
                    onChange={e => setManualLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Compliance Artifact</label>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="manualDoc"
                    onChange={e => setManualDoc(e.target.files?.[0]?.name || null)}
                  />
                  <label htmlFor="manualDoc" className="flex items-center justify-center gap-3 w-full bg-navy-800 border border-dashed border-slate-700 rounded-xl p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:border-sky-500 hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {manualDoc || 'UPLOAD SCAN LOG'}
                  </label>
                </div>
                <button 
                  onClick={handleManualPush}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-sky-900/40 transition-all active:scale-95"
                >
                  Push Update to Manifest
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Telemetry Feed */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="px-10 py-7 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black text-navy-700 uppercase tracking-widest">Telemetry Log: {activeVehicle.plateNo}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vehicle-Specific Operations Registry</p>
              </div>
              <button className="text-[10px] font-black text-sky-600 hover:underline uppercase tracking-widest">Live Sync</button>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6">Timestamp</th>
                    <th className="px-10 py-6">Operational Event</th>
                    <th className="px-10 py-6">Processing Node</th>
                    <th className="px-10 py-6 text-right">Artifact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeVehicle.updates.map((update, i) => (
                    <tr key={i} className="hover:bg-sky-50/30 transition-colors animate-in slide-in-from-top-2">
                      <td className="px-10 py-7 font-mono text-[11px] font-black text-slate-400">{update.timestamp}</td>
                      <td className="px-10 py-7">
                        <span className="text-sm font-black text-navy-700 uppercase tracking-tight">{update.status}</span>
                      </td>
                      <td className="px-10 py-7">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{update.location}</span>
                      </td>
                      <td className="px-10 py-7 text-right">
                        {update.document ? (
                          <button className="text-[9px] font-black text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all shadow-sm">
                            View Scan
                          </button>
                        ) : (
                          <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Auto-Log</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {activeVehicle.updates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center">
                        <div className="flex flex-col items-center gap-6 opacity-30 grayscale">
                          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <span className="text-xs font-black uppercase tracking-[0.4em] text-navy-700">Waiting for Telemetry Feed</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 bg-sky-500 p-8 rounded-[2.5rem] shadow-2xl shadow-sky-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform"></div>
              <div className="relative z-10">
                <h5 className="text-[10px] font-black text-sky-100 uppercase tracking-widest mb-1.5">Compliance Verification</h5>
                <p className="text-xl font-black text-white uppercase tracking-tighter">Node Integrity Nominal for {activeVehicle.plateNo}</p>
              </div>
              <button className="relative z-10 bg-white text-sky-600 font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-slate-50">
                Download Vehicle Audit
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchTracking;