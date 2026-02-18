import React, { useState, useMemo } from 'react';
import { StatusBadge, SearchFilterBar } from '../constants';
import { ItemStatus, UserRole, Project } from '../types';

interface ReverseLogisticsProps {
  role: UserRole;
  project: Project | null;
}

interface ReturnBatch {
  id: string;
  sourceHub: string;
  dispatchAddress: string;
  trackingId: string;
  logisticsPartner: string;
  vehicleNo: string;
  expectedCounts: {
    locks: number;
    chargers: number;
    adaptors: number;
    rfid: number;
  };
  initiatedCounts: {
    locks: number;
    chargers: number;
    adaptors: number;
    rfid: number;
  };
  receivedCounts: {
    locks: number;
    chargers: number;
    adaptors: number;
    rfid: number;
  };
  status: ItemStatus;
  step: 'initiation' | 'pickup' | 'transit' | 'verification';
}

const ReverseLogistics: React.FC<ReverseLogisticsProps> = ({ role, project }) => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'tracking' | 'warehouse'>('dispatch');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'initiate' | 'pickup' | 'verify' | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<ReturnBatch | null>(null);

  const [newCounts, setNewCounts] = useState({ locks: 0, chargers: 0, adaptors: 0, rfid: 0 });
  const [logisticsInfo, setLogisticsInfo] = useState({ partner: '', tracking: '', vehicle: '' });

  const projectTotals = useMemo(() => {
    if (!project) return { locks: 0, chargers: 0, adaptors: 0, rfid: 0 };
    let locks = 0, chargers = 0, adaptors = 0, rfid = 0;

    project.shifts.forEach(s => {
      if (s.gpsLocks.enabled) locks += s.gpsLocks.quantity;
      if (s.chargers.enabled) chargers += s.chargers.quantity;
      if (s.adaptors.enabled) adaptors += s.adaptors.quantity;
      if (s.rfidMaster.enabled) rfid += s.rfidMaster.quantity;
      if (s.rfidUnique.enabled) rfid += s.rfidUnique.quantity;
    });

    project.manualRequirements.forEach(m => {
      if (m.type === 'GPS Lock' && m.subFields) {
        locks += m.subFields.locks;
        rfid += m.subFields.rfid;
        chargers += m.subFields.chargers;
        adaptors += m.subFields.adapters;
      } else if (m.nomenclature.toLowerCase().includes('lock')) {
        locks += m.quantity;
      }
    });
    return { locks, chargers, adaptors, rfid };
  }, [project]);

  const [batches, setBatches] = useState<ReturnBatch[]>([
    {
      id: `RET-${project?.code || 'PRJ'}-BULK`,
      sourceHub: `${project?.client || 'Client'} Regional Hub`,
      dispatchAddress: 'Main Operations Gate, HQ Building',
      trackingId: '-',
      logisticsPartner: '-',
      vehicleNo: '-',
      expectedCounts: projectTotals,
      initiatedCounts: { locks: 0, chargers: 0, adaptors: 0, rfid: 0 },
      receivedCounts: { locks: 0, chargers: 0, adaptors: 0, rfid: 0 },
      status: ItemStatus.PENDING,
      step: 'initiation'
    }
  ]);

  const canClientEdit = role === UserRole.CLIENT || role === UserRole.ADMIN;
  const canOpsLogWhEdit = role === UserRole.WAREHOUSE || role === UserRole.IIL_OPS || role === UserRole.ADMIN;

  const handleOpenModal = (type: 'initiate' | 'pickup' | 'verify', batch: ReturnBatch) => {
    setSelectedBatch(batch);
    setModalType(type);
    if (type === 'initiate') setNewCounts({ ...projectTotals });
    if (type === 'verify') setNewCounts({ ...batch.initiatedCounts });
    setIsModalOpen(true);
  };

  const processModalSubmit = () => {
    if (!selectedBatch) return;
    setBatches(prev => prev.map(b => {
      if (b.id === selectedBatch.id) {
        if (modalType === 'initiate') return { ...b, initiatedCounts: { ...newCounts }, step: 'pickup', status: ItemStatus.PENDING };
        if (modalType === 'pickup') return { ...b, logisticsPartner: logisticsInfo.partner, trackingId: logisticsInfo.tracking, vehicleNo: logisticsInfo.vehicle, step: 'transit', status: ItemStatus.IN_PROGRESS };
        if (modalType === 'verify') {
          const isMismatch = Object.keys(newCounts).some(key => (newCounts as any)[key] !== (b.initiatedCounts as any)[key]);
          return { ...b, receivedCounts: { ...newCounts }, step: 'verification', status: isMismatch ? ItemStatus.MISMATCH : ItemStatus.COMPLETED };
        }
      }
      return b;
    }));
    setIsModalOpen(false);
  };

  if (!project) return (
    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
      <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      <p className="text-sm font-black uppercase tracking-widest">Project Data Not Synchronized</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Workflow Header - Light Mode */}
      <div className="bg-white p-10 rounded-[2.5rem] text-navy-900 shadow-xl relative overflow-hidden border border-slate-200">
         <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 blur-[100px] rounded-full"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center shadow-xl shadow-sky-100 border border-sky-400/10">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               </div>
               <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-navy-900">Reverse Logistics Operations</h2>
                  <p className="text-xs font-black text-sky-500 uppercase tracking-widest mt-2 flex items-center gap-3">
                     <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                     Project Consolidation Hub: {project.client}
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Operation Modal - Light Version */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col h-[85vh] overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="px-10 py-8 bg-white text-navy-900 flex justify-between items-center shrink-0 border-b border-slate-100">
              <div>
                <h3 className="font-black uppercase tracking-[0.15em] text-xl">
                  {modalType === 'initiate' && "Hub Consolidation Verification"}
                  {modalType === 'pickup' && "Fleet Dispatch Manifest"}
                  {modalType === 'verify' && "Warehouse Receipt Audit"}
                </h3>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">Project: {project.code}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-navy-900 transition-all">✕</button>
            </div>
            
            {/* Modal Body */}
            <div className="p-10 space-y-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/30">
              {modalType === 'pickup' ? (
                <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Carrier / Fleet Partner</label>
                    <input type="text" className="w-full border-2 border-slate-200 bg-white rounded-2xl p-5 text-sm font-black text-navy-700 uppercase tracking-widest focus:border-sky-500 outline-none shadow-sm" placeholder="e.g. IIL FLEET" value={logisticsInfo.partner} onChange={e => setLogisticsInfo({...logisticsInfo, partner: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Consignment LR No.</label>
                      <input type="text" className="w-full border-2 border-slate-200 bg-white rounded-2xl p-5 text-sm font-black font-mono tracking-widest text-sky-700 focus:border-sky-500 outline-none shadow-sm" placeholder="TRK-XXXXX" value={logisticsInfo.tracking} onChange={e => setLogisticsInfo({...logisticsInfo, tracking: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Vehicle Number</label>
                      <input type="text" className="w-full border-2 border-slate-200 bg-white rounded-2xl p-5 text-sm font-black text-navy-700 uppercase tracking-widest focus:border-sky-500 outline-none shadow-sm" placeholder="REG-XX-XXXX" value={logisticsInfo.vehicle} onChange={e => setLogisticsInfo({...logisticsInfo, vehicle: e.target.value})} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="bg-white p-8 rounded-[2rem] flex items-center gap-8 shadow-sm border border-slate-100 text-navy-900">
                     <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bulk Consolidation Source</p>
                        <p className="text-xl font-black uppercase tracking-tight">{selectedBatch?.sourceHub}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">Verify Inventory Counts</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {['locks', 'chargers', 'adaptors', 'rfid'].map((key) => (
                        <div key={key} className="bg-white border-2 border-slate-100 p-6 rounded-[1.5rem] shadow-sm hover:border-sky-500 transition-all group">
                          <div className="flex justify-between items-center mb-4">
                            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">{key}</label>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Goal: {(projectTotals as any)[key]}</span>
                          </div>
                          <input 
                            type="number" 
                            className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-2xl font-black text-navy-700 focus:border-sky-500 focus:bg-white outline-none transition-all text-center"
                            value={(newCounts as any)[key]} 
                            onChange={e => setNewCounts({...newCounts, [key]: parseInt(e.target.value) || 0})} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-10 py-8 bg-white flex flex-col md:flex-row justify-end gap-6 border-t border-slate-100 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-10 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-navy-900 transition-all">Discard & Abort</button>
              <button 
                onClick={processModalSubmit} 
                className={`px-16 py-5 rounded-2xl text-[12px] font-black text-white uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${modalType === 'verify' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-100'}`}
              >
                {modalType === 'initiate' && "Acknowledge Consolidation"}
                {modalType === 'pickup' && "Authorize Transit Phase"}
                {modalType === 'verify' && "Execute Final Audit Receipt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 -mx-8 px-8">
        <div className="flex gap-16 overflow-x-auto no-scrollbar">
          {[
            { id: 'dispatch', label: '1. Hub Consolidation' },
            { id: 'tracking', label: '2. Transit Monitoring' },
            { id: 'warehouse', label: '3. Central Audit' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-5 pt-3 text-[11px] font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-sky-500' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-t-full shadow-lg"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="px-10 py-9 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tighter">
                {activeTab === 'dispatch' && "Project Consolidation Hub"}
                {activeTab === 'tracking' && "Bulk Return Tracking"}
                {activeTab === 'warehouse' && "Final Inbound Audit"}
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 opacity-80">Materials gathered at client headquarters for bulk return.</p>
            </div>
            <SearchFilterBar />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 tracking-widest">Hub Identity</th>
                <th className="px-10 py-7 tracking-widest">Project Return Manifest</th>
                <th className="px-10 py-7 tracking-widest">Logistics Chain</th>
                <th className="px-10 py-7 tracking-widest">Audit State</th>
                <th className="px-10 py-7 text-right tracking-widest">Operational Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.filter(b => {
                if (activeTab === 'dispatch') return b.step === 'initiation';
                if (activeTab === 'tracking') return b.step === 'pickup' || b.step === 'transit';
                if (activeTab === 'warehouse') return b.step === 'transit' || b.step === 'verification';
                return true;
              }).map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-10">
                    <div className="font-black text-[10px] text-sky-500 font-mono tracking-widest mb-2">{batch.id}</div>
                    <div className="text-navy-900 font-black uppercase text-base tracking-tight">{batch.sourceHub}</div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Ref: {batch.dispatchAddress}</p>
                  </td>
                  <td className="px-10 py-10">
                    <div className="grid grid-cols-2 gap-4 max-w-[280px]">
                      {Object.entries(activeTab === 'dispatch' ? batch.expectedCounts : (activeTab === 'tracking' ? batch.initiatedCounts : batch.receivedCounts)).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{k}:</span>
                          <span className="font-black text-xs text-navy-900 font-mono">{v}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    {batch.step !== 'initiation' && batch.step !== 'pickup' ? (
                      <div className="space-y-3">
                        <div className="text-navy-900 font-black text-xs uppercase tracking-widest">{batch.logisticsPartner}</div>
                        <div className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest">{batch.vehicleNo}</div>
                        <div className="text-[9px] font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-lg w-fit uppercase tracking-widest border border-sky-100">{batch.trackingId}</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 w-fit">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                        <span className="text-amber-800 text-[10px] font-black uppercase tracking-widest">Consolidating at Hub</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-10"><StatusBadge status={batch.status} /><p className="mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-70 italic">{batch.step}</p></td>
                  <td className="px-10 py-10 text-right">
                    {activeTab === 'dispatch' && canClientEdit && <button onClick={() => handleOpenModal('initiate', batch)} className="bg-sky-500 text-white text-[10px] font-black px-8 py-4 rounded-2xl uppercase tracking-widest hover:bg-sky-600 shadow-lg shadow-sky-100 active:scale-95 transition-all">Initiate Return</button>}
                    {activeTab === 'tracking' && canOpsLogWhEdit && batch.step === 'pickup' && <button onClick={() => handleOpenModal('pickup', batch)} className="bg-navy-900 text-white text-[10px] font-black px-8 py-4 rounded-2xl uppercase tracking-widest hover:bg-black shadow-lg shadow-slate-200 active:scale-95 transition-all">Assign Carrier</button>}
                    {activeTab === 'warehouse' && canOpsLogWhEdit && batch.step === 'transit' && <button onClick={() => handleOpenModal('verify', batch)} className="bg-emerald-600 text-white text-[10px] font-black px-8 py-4 rounded-2xl uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95 transition-all">Verify Receipt</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReverseLogistics;