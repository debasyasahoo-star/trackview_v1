import React, { useState } from 'react';

const ClientConfirmation: React.FC = () => {
  const [items, setItems] = useState([
    { type: 'SmartLocks', dispatched: 4500, received: 4500, receiver: 'Anita S.', date: '2024-05-15' },
    { type: 'Chargers', dispatched: 250, received: 250, receiver: 'Anita S.', date: '2024-05-15' },
    { type: 'Adaptors', dispatched: 250, received: 250, receiver: 'Anita S.', date: '2024-05-15' },
    { type: 'RFID Cards', dispatched: 50, received: 50, receiver: 'Anita S.', date: '2024-05-15' }
  ]);

  const [signatureFile, setSignatureFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleUpdate = (index: number, val: number) => {
    const newItems = [...items];
    newItems[index].received = val;
    setItems(newItems);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignatureFile(e.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    if (!signatureFile) {
      alert("Please upload a digital signature scan to proceed.");
      return;
    }
    if (window.confirm("Submit acknowledgement? This will lock the received inventory for the project.")) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-24">
      {/* Heavy Contrast Header */}
      <div className="bg-navy-900 text-white p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-3">Inventory Receipt Audit</h2>
          <p className="text-[12px] font-black text-sky-400 uppercase tracking-[0.25em] opacity-90">Project Lifecycle Acknowledgement • Authorized Personnel Only</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border-2 border-slate-200 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-black text-navy-700 uppercase tracking-tight">Consignment Confirmation</h3>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
              Verify that the quantities received at the collection hub match the central dispatch manifest. Discrepancies must be noted before final sign-off.
            </p>
          </div>
          <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl flex items-center gap-4 shadow-sm min-w-[280px]">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Status</p>
                {submitted ? (
                  <span className="text-emerald-700 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Finalized & Logged
                  </span>
                ) : (
                  <span className="text-amber-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Awaiting Verification
                  </span>
                )}
             </div>
          </div>
        </div>
        
        <div className="overflow-x-auto rounded-[2.5rem] border-2 border-slate-100 shadow-inner">
            <table className="w-full text-left min-w-[900px]">
                <thead className="bg-navy-700 text-[10px] font-black text-slate-300 uppercase">
                    <tr>
                        <th className="px-10 py-8 tracking-widest">Material Item</th>
                        <th className="px-10 py-8 tracking-widest">Manifest Qty</th>
                        <th className="px-10 py-8 tracking-widest">Actual Received (Blank)</th>
                        <th className="px-10 py-8 tracking-widest">Receiving Officer</th>
                        <th className="px-10 py-8 tracking-widest">Timestamp</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.map((item, i) => (
                        <tr key={i} className="hover:bg-sky-50/20 transition-colors">
                            <td className="px-10 py-8 font-black text-navy-700 uppercase tracking-tight text-lg">{item.type}</td>
                            <td className="px-10 py-8">
                                <span className="font-mono font-black text-slate-400 text-base">{item.dispatched}</span>
                            </td>
                            <td className="px-10 py-8">
                                <input 
                                    type="number" 
                                    disabled={submitted}
                                    className="w-32 border-2 border-slate-300 bg-white p-4 rounded-2xl focus:ring-4 focus:ring-sky-50 focus:border-sky-500 font-mono font-black text-navy-700 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 text-center shadow-sm"
                                    value={item.received}
                                    onChange={e => handleUpdate(i, parseInt(e.target.value) || 0)}
                                />
                            </td>
                            <td className="px-10 py-8">
                                <input 
                                    type="text" 
                                    disabled={submitted}
                                    className="w-full min-w-[180px] border-2 border-slate-300 bg-white p-4 rounded-2xl focus:ring-4 focus:ring-sky-50 focus:border-sky-500 font-black text-navy-700 outline-none transition-all placeholder:text-slate-300 disabled:bg-slate-100 disabled:text-slate-400 uppercase tracking-tight"
                                    placeholder="Officer Name"
                                    value={item.receiver}
                                    onChange={e => {
                                        const n = [...items];
                                        n[i].receiver = e.target.value;
                                        setItems(n);
                                    }}
                                />
                            </td>
                            <td className="px-10 py-8">
                                <input 
                                    type="date" 
                                    disabled={submitted}
                                    className="border-2 border-slate-300 bg-white p-4 rounded-2xl focus:ring-4 focus:ring-sky-50 focus:border-sky-500 text-xs font-black text-navy-700 font-mono outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
                                    value={item.date}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Digital Signature Upload Block */}
        <section className="bg-slate-50 border-2 border-slate-300 border-dashed p-12 rounded-[3rem]">
           <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-lg">
                 <h4 className="text-lg font-black text-navy-700 uppercase tracking-tighter mb-3">Digital Signature Authentication</h4>
                 <p className="text-[12px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed">
                    Upload a scanned copy of the authorized signatory's signature. This artifact is mandatory for the legal validation of this material receipt audit.
                 </p>
              </div>
              
              <div className="shrink-0">
                 {signatureFile ? (
                   <div className="flex items-center gap-6 bg-white border-2 border-sky-500 px-8 py-6 rounded-[2rem] shadow-2xl animate-in zoom-in-95">
                      <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorized Scan</p>
                        <p className="text-sm font-black text-navy-700 truncate max-w-[200px]">{signatureFile}</p>
                      </div>
                      {!submitted && (
                        <button onClick={() => setSignatureFile(null)} className="ml-4 w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                   </div>
                 ) : (
                   <label className="bg-white border-4 border-slate-200 hover:border-sky-500 text-slate-400 hover:text-sky-500 px-12 py-8 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] cursor-pointer transition-all shadow-xl flex flex-col items-center gap-4 active:scale-95 group">
                      <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      Select Signature Scan
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                   </label>
                 )}
              </div>
           </div>
        </section>

        {/* Global Control Buttons */}
        <div className="flex justify-end gap-6 pt-4">
             {!submitted ? (
                 <>
                    <button className="bg-white border-2 border-slate-200 text-slate-400 font-black px-12 py-5 rounded-2xl text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all">Abort Audit</button>
                    <button 
                      onClick={handleSubmit} 
                      className="bg-sky-500 text-white font-black px-16 py-6 rounded-2xl shadow-2xl shadow-sky-100 hover:bg-sky-600 active:scale-95 transition-all text-[12px] uppercase tracking-[0.25em] flex items-center gap-4"
                    >
                      Authenticate & Commit Sign-off
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                 </>
             ) : (
                 <div className="flex items-center gap-6 bg-emerald-50 border-2 border-emerald-100 px-12 py-6 rounded-[2.5rem] text-emerald-700 animate-in fade-in slide-in-from-right-8">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-xl">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Manifest Sealed</p>
                      <p className="text-lg font-black uppercase tracking-tight">Receipt Successfully Witnessed & Finalized</p>
                    </div>
                 </div>
             )}
        </div>
      </div>
      
      <div className="text-center opacity-40">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] font-mono">NODE_LOG: ACK_V2_SEALED • UID_{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
      </div>
    </div>
  );
};

export default ClientConfirmation;