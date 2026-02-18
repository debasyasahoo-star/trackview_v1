import React, { useState } from 'react';
import { ConfirmationModal } from '../constants';

interface Vehicle {
  id: string;
  plateNo: string;
}

interface DispatchStep {
  id: string;
  vendorName: string;
  isOtherVendor: boolean;
  destination: string;
  vendorCode: string;
  liaisonName: string;
  vehicles: Vehicle[];
  documents: string[];
}

interface DispatchSetupProps {
  projectCode: string;
}

const TRACKED_VENDORS = [
  "SafeExam Logistics India",
  "IIL Fleet Services",
  "SecureTransit India",
  "BlueDart Exam Solutions",
  "Global Courier Hub"
];

const DispatchSetup: React.FC<DispatchSetupProps> = ({ projectCode }) => {
  const [steps, setSteps] = useState<DispatchStep[]>([
    { 
      id: 'DS-01', 
      vendorName: '', 
      isOtherVendor: false, 
      destination: '', 
      vendorCode: '', 
      liaisonName: '', 
      vehicles: [{ id: 'v1', plateNo: '' }], 
      documents: [] 
    }
  ]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const addStep = () => {
    const nextId = `DS-0${steps.length + 1}`;
    setSteps([...steps, { 
      id: nextId, 
      vendorName: '', 
      isOtherVendor: false,
      destination: '', 
      vendorCode: '', 
      liaisonName: '', 
      vehicles: [{ id: 'v1', plateNo: '' }], 
      documents: [] 
    }]);
  };

  const addVehicle = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].vehicles.push({ id: `v-${Date.now()}`, plateNo: '' });
    setSteps(newSteps);
  };

  const updateVehicle = (stepIndex: number, vehicleIndex: number, val: string) => {
    const newSteps = [...steps];
    newSteps[stepIndex].vehicles[vehicleIndex].plateNo = val;
    setSteps(newSteps);
  };

  const removeVehicle = (stepIndex: number, vehicleIndex: number) => {
    const newSteps = [...steps];
    if (newSteps[stepIndex].vehicles.length > 1) {
      newSteps[stepIndex].vehicles.splice(vehicleIndex, 1);
      setSteps(newSteps);
    }
  };

  const updateStep = (index: number, field: keyof DispatchStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleVendorSelection = (index: number, val: string) => {
    const isOther = val === 'OTHER_MANUAL';
    const newSteps = [...steps];
    newSteps[index] = { 
      ...newSteps[index], 
      vendorName: isOther ? '' : val, 
      isOtherVendor: isOther 
    };
    setSteps(newSteps);
  };

  const handleFileUpload = (index: number, files: FileList | null) => {
    if (!files) return;
    const fileNames = Array.from(files).map(f => f.name);
    updateStep(index, 'documents', [...steps[index].documents, ...fileNames]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleFinalSubmit = () => {
    setIsConfirmOpen(false);
    alert("Global Dispatch Sequence Finalized and Locked.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <ConfirmationModal 
        isOpen={isConfirmOpen}
        title="Finalize Dispatch Sequence"
        onConfirm={handleFinalSubmit}
        onCancel={() => setIsConfirmOpen(false)}
        message="Please review the consignment summary below before locking the fleet deployment."
      >
        <div className="mt-6 space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {steps.map((s) => (
            <div key={s.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">{s.id}</span>
                {s.isOtherVendor && <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-black uppercase tracking-widest">Manual Tracking Only</span>}
              </div>
              <p className="text-sm font-black text-navy-700 uppercase tracking-tight">{s.vendorName || 'UNSPECIFIED VENDOR'}</p>
              <div className="mt-3 space-y-2">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Destination: <span className="text-navy-700">{s.destination || 'N/A'}</span></p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fleet:</span>
                  {s.vehicles.map((v) => (
                    <span key={v.id} className="text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-black text-navy-700">
                      {v.plateNo || '??-??-??-????'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ConfirmationModal>

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end bg-white p-10 rounded-[2.5rem] border border-gray-200 shadow-sm gap-6">
        <div>
          <h2 className="text-4xl font-black text-navy-700 uppercase tracking-tighter">Fleet Dispatch Setup</h2>
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2 italic">Phase Deployment Control • Multi-Vehicle Support</p>
        </div>
        <div className="bg-navy-900 text-white p-7 rounded-[2rem] border border-slate-800 shadow-2xl min-w-[280px]">
          <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1.5 opacity-80">Project Code</p>
          <p className="text-xl font-black font-mono tracking-[0.15em] text-sky-100 uppercase">{projectCode || 'AWAITING_AUTH'}</p>
        </div>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <section key={step.id} className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="px-10 py-7 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <span className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-lg font-black shadow-xl shadow-sky-100">0{index + 1}</span>
                <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Consignment Phase</h3>
                    <p className="text-base font-black text-navy-700 font-mono tracking-widest">{step.id}</p>
                </div>
              </div>
              {steps.length > 1 && (
                <button 
                  onClick={() => removeStep(index)}
                  className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-all hover:bg-rose-50 px-6 py-3 rounded-xl border border-rose-100"
                >
                  Delete Phase
                </button>
              )}
            </div>
            
            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Vendor Selection */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Carrier Partner</label>
                  <div className="space-y-4">
                    <select 
                        className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-sm font-black text-navy-700 uppercase tracking-tight focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 outline-none transition-all cursor-pointer"
                        value={step.isOtherVendor ? 'OTHER_MANUAL' : step.vendorName}
                        onChange={(e) => handleVendorSelection(index, e.target.value)}
                    >
                        <option value="">-- SELECT FROM LIST --</option>
                        {TRACKED_VENDORS.map(v => <option key={v} value={v}>{v}</option>)}
                        <option value="OTHER_MANUAL">OTHERS (UNLISTED / MANUAL TRACKING)</option>
                    </select>

                    {step.isOtherVendor && (
                        <div className="animate-in slide-in-from-top-4 duration-300">
                             <div className="bg-amber-50 border-2 border-amber-100 p-4 rounded-2xl mb-4 flex items-center gap-4">
                                <svg className="w-6 h-6 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">System warning: Unlisted vendor selected. Dispatch tracking has to be manually entered as this vendor is not on the automated list.</p>
                             </div>
                             <input 
                                type="text" 
                                className="w-full border-2 border-sky-500 bg-white rounded-2xl p-5 text-sm font-black text-navy-700 uppercase tracking-widest outline-none shadow-lg shadow-sky-50"
                                placeholder="ENTER VENDOR NAME..."
                                value={step.vendorName}
                                onChange={(e) => updateStep(index, 'vendorName', e.target.value)}
                            />
                        </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Carrier / Vendor Code</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-sm font-black font-mono tracking-[0.2em] text-sky-700 focus:border-sky-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    placeholder="VNDR-CODE-00"
                    value={step.vendorCode}
                    onChange={(e) => updateStep(index, 'vendorCode', e.target.value)}
                  />
                </div>

                {/* Vehicles Section */}
                <div className="md:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest">Fleet Deployment Vehicles</label>
                    <button 
                      onClick={() => addVehicle(index)}
                      className="text-[9px] font-black text-sky-600 hover:text-sky-800 uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      Add Vehicle
                    </button>
                  </div>
                  <div className="space-y-3">
                    {step.vehicles.map((v, vIdx) => (
                      <div key={v.id} className="flex gap-2 animate-in slide-in-from-right-2">
                        <input 
                          type="text" 
                          className="flex-1 border-2 border-slate-100 bg-slate-50 rounded-xl p-4 text-xs font-extrabold text-navy-700 uppercase tracking-[0.15em] focus:border-sky-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                          placeholder="VEHICLE PLATE NO"
                          value={v.plateNo}
                          onChange={(e) => updateVehicle(index, vIdx, e.target.value)}
                        />
                        {step.vehicles.length > 1 && (
                          <button 
                            onClick={() => removeVehicle(index, vIdx)}
                            className="w-12 h-12 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center border border-slate-100"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Delivery Address / Node</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-sm font-extrabold text-navy-700 uppercase tracking-wide focus:border-sky-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    placeholder="ENTER FULL DESTINATION ADDRESS..."
                    value={step.destination}
                    onChange={(e) => updateStep(index, 'destination', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Recipient Details</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-2xl p-5 text-sm font-extrabold text-navy-700 uppercase tracking-wide focus:border-sky-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                    placeholder="OFFICER NAME / CONTACT"
                    value={step.liaisonName}
                    onChange={(e) => updateStep(index, 'liaisonName', e.target.value)}
                  />
                </div>
                
                {/* Documents */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3">Dispatch Documents (LR, DC, Security Logs)</label>
                  <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-white hover:border-sky-200 transition-all group relative cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      id={`file-${step.id}`} 
                      onChange={(e) => handleFileUpload(index, e.target.files)}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-slate-50 text-sky-500">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <p className="text-sm font-black text-navy-700 uppercase tracking-[0.2em]">Upload Dispatch Artifacts</p>
                      <p className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-widest opacity-60">Verified Formats Only (Max 15MB)</p>
                    </div>
                  </div>
                  {step.documents.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-6">
                      {step.documents.map((doc, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border-2 border-slate-100 text-[10px] font-black text-navy-700 uppercase tracking-widest animate-in zoom-in-95 shadow-sm hover:border-sky-500 transition-colors">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {doc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <button 
          onClick={addStep}
          className="flex-1 py-8 bg-white border-4 border-dashed border-slate-100 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.25em] hover:bg-slate-50 hover:border-sky-100 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-6 text-slate-400 hover:text-sky-500 group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          </div>
          Initialize Additional Dispatch Phase
        </button>
        <button 
          onClick={() => setIsConfirmOpen(true)}
          className="flex-[2] py-8 bg-sky-500 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.35em] hover:bg-sky-600 transition-all shadow-2xl shadow-sky-200 active:scale-95 ring-8 ring-sky-50 ring-offset-4 ring-offset-transparent"
        >
          Submit & Lock Dispatch Sequence
        </button>
      </div>
    </div>
  );
};

export default DispatchSetup;