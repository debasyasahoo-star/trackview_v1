import React, { useState, useEffect, useMemo } from 'react';
import { StatusBadge } from '../constants';
import { ItemStatus, UserRole, Project } from '../types';

interface WarehouseReceivingProps {
  role: UserRole;
  project?: Project | null;
}

interface AuditItem {
  id: string;
  type: string;
  expected: number;
  received: number;
  status: ItemStatus;
  remarks: string;
}

const WAREHOUSE_NODES = [
  'Central Repository - Gurugram',
  'South Regional Hub - Hyderabad',
  'West Processing Unit - Mumbai',
  'East Logistic Node - Kolkata',
  'Manual Entry (Unlisted Node)'
];

const WarehouseReceiving: React.FC<WarehouseReceivingProps> = ({ role, project }) => {
  const canEdit = role === UserRole.WAREHOUSE || role === UserRole.ADMIN;
  const [selectedWarehouse, setSelectedWarehouse] = useState(WAREHOUSE_NODES[0]);
  const [manualWarehouse, setManualWarehouse] = useState('');
  const [receiverName, setReceiverName] = useState(role === UserRole.ADMIN ? 'ADMIN_ROOT' : 'WAREHOUSE_MGR');
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiveTime, setReceiveTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  
  const [receivingProofs, setReceivingProofs] = useState<string[]>([]);
  const [items, setItems] = useState<AuditItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState(0);

  const derivedItems = useMemo(() => {
    if (!project) return [];
    const list: AuditItem[] = [];
    project.manualRequirements.forEach((req) => {
      const baseId = `manual-${req.id}`;
      if (req.type === 'GPS Lock' && req.subFields) {
        list.push({ id: `${baseId}-locks`, type: `[MANUAL] ${req.nomenclature} (Locks)`, expected: req.subFields.locks, received: 0, status: ItemStatus.PENDING, remarks: 'Manual Hardware Override' });
        list.push({ id: `${baseId}-rfid`, type: `[MANUAL] ${req.nomenclature} (RFID)`, expected: req.subFields.rfid, received: 0, status: ItemStatus.PENDING, remarks: 'Manual Hardware Override' });
        list.push({ id: `${baseId}-chargers`, type: `[MANUAL] ${req.nomenclature} (Chargers)`, expected: req.subFields.chargers, received: 0, status: ItemStatus.PENDING, remarks: 'Manual Hardware Override' });
        list.push({ id: `${baseId}-adapters`, type: `[MANUAL] ${req.nomenclature} (Adapters)`, expected: req.subFields.adapters, received: 0, status: ItemStatus.PENDING, remarks: 'Manual Hardware Override' });
      } else {
        list.push({ id: baseId, type: `[MANUAL] ${req.nomenclature} (${req.type})`, expected: req.quantity, received: 0, status: ItemStatus.PENDING, remarks: 'Manual Provision' });
      }
    });
    project.shifts.forEach(shift => {
      const prefix = `${shift.shiftName}`;
      if (shift.gpsLocks.enabled) list.push({ id: `${shift.id}-gps`, type: `${prefix}: ${shift.gpsLocks.nomenclature} (GPS Locks)`, expected: shift.gpsLocks.quantity, received: 0, status: ItemStatus.PENDING, remarks: 'Project Baseline' });
      if (shift.chargers.enabled) list.push({ id: `${shift.id}-chargers`, type: `${prefix}: ${shift.chargers.nomenclature} (Rapid Chargers)`, expected: shift.chargers.quantity, received: 0, status: ItemStatus.PENDING, remarks: 'Project Baseline' });
      if (shift.adaptors.enabled) list.push({ id: `${shift.id}-adaptors`, type: `${prefix}: ${shift.adaptors.nomenclature} (IO Adaptors)`, expected: shift.adaptors.quantity, received: 0, status: ItemStatus.PENDING, remarks: 'Project Baseline' });
      if (shift.rfidMaster.enabled) list.push({ id: `${shift.id}-rfidM`, type: `${prefix}: ${shift.rfidMaster.nomenclature} (Master RFID)`, expected: shift.rfidMaster.quantity, received: 0, status: ItemStatus.PENDING, remarks: 'Security Protocol' });
      if (shift.rfidUnique.enabled) list.push({ id: `${shift.id}-rfidU`, type: `${prefix}: ${shift.rfidUnique.nomenclature} (Unique Tags)`, expected: shift.rfidUnique.quantity, received: 0, status: ItemStatus.PENDING, remarks: 'Security Protocol' });
    });
    return list;
  }, [project]);

  useEffect(() => { setItems(derivedItems); }, [derivedItems]);

  const handleEdit = (index: number) => {
    if (!canEdit) return;
    setEditingIndex(index);
    setEditValue(items[index].received);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      const newItems = [...items];
      const val = editValue;
      newItems[editingIndex].received = val;
      newItems[editingIndex].status = val >= items[editingIndex].expected ? ItemStatus.COMPLETED : (val > 0 ? ItemStatus.IN_PROGRESS : ItemStatus.MISMATCH);
      setItems(newItems);
      setEditingIndex(null);
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f: File) => f.name);
      setReceivingProofs([...receivingProofs, ...names]);
    }
  };

  if (!project) return (
    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
      <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      <p className="text-sm font-black uppercase tracking-widest">Initialization Pending</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-700">
        <div className="px-10 py-9 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-3xl font-black text-navy-700 uppercase tracking-tighter">Inbound Material Verification</h3>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${canEdit ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              Current Mode: <span className="text-navy-700 font-extrabold">{canEdit ? 'Operational Edit' : 'Read-Only Audit'}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="bg-sky-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-sky-600 cursor-pointer flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Upload Proof Document
              <input type="file" multiple className="hidden" onChange={handleProofUpload} />
            </label>
            <button className="bg-navy-700 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all hover:bg-black">
              Finalize Audit Record
            </button>
          </div>
        </div>

        {receivingProofs.length > 0 && (
          <div className="px-10 py-5 bg-sky-50 border-b border-slate-100 flex flex-wrap gap-4">
            {receivingProofs.map((p, i) => (
              <span key={i} className="text-[9px] font-black text-sky-700 bg-white border border-sky-200 px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                {p}
              </span>
            ))}
          </div>
        )}

        <div className="p-10 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Warehouse Node</label>
              <select 
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-xs font-black text-navy-700 uppercase tracking-tight outline-none focus:border-sky-500 focus:bg-white transition-all appearance-none cursor-pointer"
                value={selectedWarehouse}
                disabled={!canEdit}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                {WAREHOUSE_NODES.map(wh => <option key={wh} value={wh}>{wh}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Receiving Officer</label>
              <input 
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-xs font-black text-navy-700 outline-none focus:border-sky-500 focus:bg-white transition-all"
                value={receiverName}
                disabled={!canEdit}
                onChange={(e) => setReceiverName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Date of Entry</label>
              <input 
                type="date"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-xs font-black text-navy-700 outline-none focus:border-sky-500 focus:bg-white transition-all"
                value={receiveDate}
                disabled={!canEdit}
                onChange={(e) => setReceiveDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Time of Entry</label>
              <input 
                type="time"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-4 text-xs font-black text-navy-700 outline-none focus:border-sky-500 focus:bg-white transition-all"
                value={receiveTime}
                disabled={!canEdit}
                onChange={(e) => setReceiveTime(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-[2rem] border border-slate-200 shadow-inner">
            <table className="w-full text-left">
              <thead className="bg-slate-100/50 text-[10px] font-black text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="px-10 py-7 tracking-widest">Material Requirement</th>
                  <th className="px-10 py-7 tracking-widest text-center">Expected Qty</th>
                  <th className="px-10 py-7 tracking-widest text-center">Received Qty</th>
                  <th className="px-10 py-7 tracking-widest">Audit Status</th>
                  <th className="px-10 py-7 text-right tracking-widest">Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, i) => (
                  <tr key={item.id} className="hover:bg-sky-50/10 transition-all group">
                    <td className="px-10 py-8">
                      <p className="font-black text-navy-700 uppercase tracking-tight text-base mb-1">{item.type}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{item.remarks}</p>
                    </td>
                    <td className="px-10 py-8 text-center text-slate-400 font-mono font-black">{item.expected}</td>
                    <td className="px-10 py-8 text-center">
                      {editingIndex === i ? (
                        <input 
                          type="number" 
                          className="w-32 border-2 border-sky-500 bg-white p-4 rounded-xl font-mono font-black text-sky-700 outline-none text-center shadow-lg"
                          value={editValue}
                          onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                          autoFocus
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className={`font-mono font-black text-2xl tracking-tighter ${item.received === 0 ? 'text-slate-300' : (item.received === item.expected ? 'text-emerald-600' : 'text-navy-700')}`}>{item.received}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8"><StatusBadge status={item.status} /></td>
                    <td className="px-10 py-8 text-right">
                      {canEdit ? (
                        editingIndex === i ? (
                          <button onClick={handleSave} className="bg-emerald-600 text-white text-[10px] font-black px-7 py-3.5 rounded-xl uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-95 transition-all hover:bg-emerald-700">Submit Count</button>
                        ) : (
                          <button onClick={() => handleEdit(i)} className="bg-sky-500 text-white text-[10px] font-black px-7 py-3.5 rounded-xl uppercase tracking-widest shadow-xl shadow-sky-200 active:scale-95 transition-all hover:bg-sky-600">Update Audit</button>
                        )
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-slate-300">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-[10px] font-black uppercase tracking-widest">Locked</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Overall Completion', val: `${Math.round((items.filter(it => it.status === ItemStatus.COMPLETED).length / items.length) * 100 || 0)}%`, color: 'text-sky-700' },
          { label: 'Deltas Detected', val: `${items.filter(it => it.status === ItemStatus.MISMATCH || (it.received > 0 && it.received < it.expected)).length} CAT`, color: 'text-rose-700' },
          { label: 'Total Expected Units', val: items.reduce((acc, curr) => acc + curr.expected, 0), color: 'text-navy-700' },
          { label: 'Total Received Units', val: items.reduce((acc, curr) => acc + curr.received, 0), color: 'text-emerald-700' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-9 rounded-[2.5rem] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center transition-all hover:shadow-lg">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-80">{stat.label}</p>
             <p className={`text-2xl font-black ${stat.color} tracking-tighter uppercase`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseReceiving;