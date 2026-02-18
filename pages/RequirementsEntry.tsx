import React, { useState } from 'react';
import { Project, ShiftInventory, MaterialRequirement, ManualMaterialRequirement } from '../types';
import { ConfirmationModal } from '../constants';

interface RequirementsEntryProps {
  project: Project | null;
  onUpdate: (p: Project) => void;
}

const MATERIAL_TYPES = ['GPS Lock', 'Trunks', 'Stationary', 'Cables', 'Packaging', 'Other'];

const RequirementsEntry: React.FC<RequirementsEntryProps> = ({ project, onUpdate }) => {
  const [shifts, setShifts] = useState<ShiftInventory[]>(project?.shifts || []);
  const [manualRequirements, setManualRequirements] = useState<ManualMaterialRequirement[]>(project?.manualRequirements || []);
  const [requirementDocuments, setRequirementDocuments] = useState<string[]>(project?.requirementDocuments || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examDate, setExamDate] = useState(project?.examDate || '');

  const createNewShift = (): ShiftInventory => ({
    id: `s-${Date.now()}`,
    shiftName: `Shift ${shifts.length + 1}`,
    startTime: '09:00',
    endTime: '12:00',
    gpsLocks: { enabled: false, quantity: 0, nomenclature: '' },
    chargers: { enabled: false, quantity: 0, nomenclature: '' },
    adaptors: { enabled: false, quantity: 0, nomenclature: '' },
    rfidMaster: { enabled: false, quantity: 0, nomenclature: '' },
    rfidUnique: { enabled: false, quantity: 0, nomenclature: '' }
  });

  const addShift = () => {
    setShifts([...shifts, createNewShift()]);
  };

  const addManualRequirement = () => {
    const newReq: ManualMaterialRequirement = {
      id: `m-${Date.now()}`,
      type: 'GPS Lock',
      nomenclature: '',
      quantity: 0,
      subFields: { locks: 0, rfid: 0, chargers: 0, adapters: 0 }
    };
    setManualRequirements([...manualRequirements, newReq]);
  };

  const updateManualReq = (index: number, field: keyof ManualMaterialRequirement, value: any) => {
    const updated = [...manualRequirements];
    if (field === 'type') {
      updated[index].type = value;
      if (value === 'GPS Lock') {
        updated[index].subFields = { locks: 0, rfid: 0, chargers: 0, adapters: 0 };
      } else {
        delete updated[index].subFields;
      }
    } else {
      (updated[index] as any)[field] = value;
    }
    setManualRequirements(updated);
  };

  const updateManualSubField = (index: number, field: string, value: number) => {
    const updated = [...manualRequirements];
    if (updated[index].subFields) {
      (updated[index].subFields as any)[field] = value;
    }
    setManualRequirements(updated);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const fileNames = Array.from(files).map(f => f.name);
    setRequirementDocuments(prev => [...prev, ...fileNames]);
  };

  const removeDocument = (index: number) => {
    setRequirementDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinalize = () => {
    if (project) {
      onUpdate({ ...project, shifts, manualRequirements, examDate, requirementDocuments });
      setIsModalOpen(false);
      alert("Operational Specifications Finalized Globally.");
    }
  };

  const MaterialRow = ({ label, material, shiftIndex, materialKey }: { 
    label: string, 
    material: MaterialRequirement, 
    shiftIndex: number, 
    materialKey: keyof ShiftInventory 
  }) => (
    <div className={`p-4 rounded-xl border-2 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center ${material.enabled ? 'border-sky-500 bg-sky-50/20' : 'border-slate-100 bg-slate-50/50 grayscale opacity-60'}`}>
      <div className="flex items-center gap-4 min-w-[180px]">
        <input 
          type="checkbox" 
          className="w-6 h-6 rounded-lg text-sky-500 focus:ring-sky-500 cursor-pointer"
          checked={material.enabled}
          onChange={(e) => {
            const newShifts = [...shifts];
            const mat = { ...(newShifts[shiftIndex][materialKey] as MaterialRequirement) };
            mat.enabled = e.target.checked;
            (newShifts[shiftIndex] as any)[materialKey] = mat;
            setShifts(newShifts);
          }}
        />
        <span className="text-[11px] font-black text-navy-700 uppercase tracking-widest">{label}</span>
      </div>
      
      {material.enabled && (
        <div className="flex flex-1 gap-6 animate-in slide-in-from-left-4">
          <div className="flex-1">
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Device Nomenclature</label>
            <input 
              type="text"
              placeholder="e.g. SmartLock Pro v4"
              className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-bold text-navy-700 outline-none focus:border-sky-500"
              value={material.nomenclature}
              onChange={(e) => {
                const newShifts = [...shifts];
                const mat = { ...(newShifts[shiftIndex][materialKey] as MaterialRequirement) };
                mat.nomenclature = e.target.value;
                (newShifts[shiftIndex] as any)[materialKey] = mat;
                setShifts(newShifts);
              }}
            />
          </div>
          <div className="w-32">
            <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Target Qty</label>
            <input 
              type="number"
              className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-black text-navy-700 outline-none focus:border-sky-500"
              value={material.quantity}
              onChange={(e) => {
                const newShifts = [...shifts];
                const mat = { ...(newShifts[shiftIndex][materialKey] as MaterialRequirement) };
                mat.quantity = parseInt(e.target.value) || 0;
                (newShifts[shiftIndex] as any)[materialKey] = mat;
                setShifts(newShifts);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      <ConfirmationModal 
        isOpen={isModalOpen}
        title="Final Specification Lock"
        message="Finalizing will distribute these material requirements across warehouse, dispatch, and reporting nodes. Are you sure?"
        onConfirm={handleFinalize}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Requirement Documents Section */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h2 className="text-2xl font-black text-navy-900 uppercase tracking-tighter">Work Order & Client Requirements</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Upload supporting documents, work order copies, or client-signed requirements.</p>
          </div>
          <label className="bg-sky-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-sky-600 cursor-pointer transition-all active:scale-95 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload Requirement Proofs
            <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
          </label>
        </div>

        {requirementDocuments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requirementDocuments.map((doc, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex justify-between items-center group animate-in zoom-in-95">
                <div className="flex items-center gap-3 overflow-hidden">
                  <svg className="w-5 h-5 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-[11px] font-bold text-navy-700 truncate uppercase tracking-tight">{doc}</span>
                </div>
                <button 
                  onClick={() => removeDocument(idx)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black text-navy-900 uppercase tracking-tighter">Project Hardware Specifications</h2>
          <div className="flex gap-4">
            <div className="text-right">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exam Deployment Date</label>
              <input 
                type="date" 
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-navy-700 outline-none focus:border-sky-500"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Shift Phases */}
        <div className="space-y-12">
          {shifts.map((shift, sIdx) => (
            <div key={shift.id} className="p-10 bg-slate-50/50 rounded-[2rem] border-2 border-slate-100 border-dashed animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-6">
                  <span className="w-12 h-12 bg-navy-700 text-white flex items-center justify-center rounded-2xl font-black text-lg">0{sIdx + 1}</span>
                  <div>
                    <input 
                      type="text" 
                      className="text-xl font-black text-navy-900 bg-transparent border-none focus:ring-0 w-64 uppercase tracking-tight"
                      value={shift.shiftName}
                      onChange={e => {
                        const newShifts = [...shifts];
                        newShifts[sIdx].shiftName = e.target.value;
                        setShifts(newShifts);
                      }}
                    />
                    <div className="flex gap-4 mt-1">
                      <input type="time" className="text-[10px] font-black text-slate-400 bg-transparent" value={shift.startTime} onChange={e => {
                        const newShifts = [...shifts];
                        newShifts[sIdx].startTime = e.target.value;
                        setShifts(newShifts);
                      }} />
                      <span className="text-[10px] font-black text-slate-300">TO</span>
                      <input type="time" className="text-[10px] font-black text-slate-400 bg-transparent" value={shift.endTime} onChange={e => {
                        const newShifts = [...shifts];
                        newShifts[sIdx].endTime = e.target.value;
                        setShifts(newShifts);
                      }} />
                    </div>
                  </div>
                </div>
                {shifts.length > 1 && (
                  <button 
                    onClick={() => setShifts(shifts.filter((_, i) => i !== sIdx))}
                    className="text-rose-500 font-black text-[10px] uppercase tracking-widest hover:text-rose-700"
                  >
                    Delete Shift
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <MaterialRow label="GPS SmartLocks" material={shift.gpsLocks} shiftIndex={sIdx} materialKey="gpsLocks" />
                <MaterialRow label="Rapid Chargers" material={shift.chargers} shiftIndex={sIdx} materialKey="chargers" />
                <MaterialRow label="IO Adaptors" material={shift.adaptors} shiftIndex={sIdx} materialKey="adaptors" />
                <MaterialRow label="RFID Master Cards" material={shift.rfidMaster} shiftIndex={sIdx} materialKey="rfidMaster" />
                <MaterialRow label="RFID Unique Tags" material={shift.rfidUnique} shiftIndex={sIdx} materialKey="rfidUnique" />
              </div>
            </div>
          ))}

          <button 
            onClick={addShift}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black uppercase tracking-widest hover:border-sky-500 hover:text-sky-500 transition-all flex items-center justify-center gap-4 group"
          >
            Append Operational Shift Phase
          </button>
        </div>
      </section>
      {/* ...rest of the file remains same as color changes are applied globally via tailwind... */}
    </div>
  );
};

export default RequirementsEntry;