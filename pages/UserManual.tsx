import React from 'react';
import { Link } from 'react-router-dom';

const UserManual: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-10 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
            <Link to="/login" className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <h1 className="text-xl font-black text-navy-700 tracking-tighter uppercase">TrackView <span className="text-sky-500">Standard Operating Procedures</span></h1>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Reference: PRD-SOP-2024-V2.6</span>
            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
            <p className="text-[10px] font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">v2.6.0-PRD</p>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto mt-16 px-6 space-y-32">
        {/* Section 1: Dynamic Requirements Synchronization */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-3 bg-sky-500 rounded-full mb-12"></div>
            <h2 className="text-6xl font-black text-navy-700 tracking-tighter uppercase leading-[0.9]">End-to-End Inventory <br/>Synchronization</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                <div className="lg:col-span-2 space-y-6">
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                        TrackView v2.6 enforces a strict <b>Master Requirement Protocol</b>. Every item specified in the Requirements Module—whether part of a Shift Baseline or a Manual Entry—is automatically projected onto the Warehouse Audit Console.
                    </p>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium">
                        This ensures zero "shadow inventory" and forces the warehouse team to reconcile every single hardware component defined by the operations team.
                    </p>
                </div>
                <div className="bg-navy-900 p-8 rounded-[2rem] text-white shadow-2xl">
                    <h4 className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-6">SOP Quick Reference</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4 text-[11px] font-bold uppercase opacity-70"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Shift Hardware Audit</li>
                        <li className="flex items-center gap-4 text-[11px] font-bold uppercase opacity-70"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Manual Entry Expansion</li>
                        <li className="flex items-center gap-4 text-[11px] font-bold uppercase opacity-70"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Proof of Receipt (PoR)</li>
                        <li className="flex items-center gap-4 text-[11px] font-bold uppercase opacity-70"><div className="w-2 h-2 rounded-full bg-sky-500"></div> Admin Global Access</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 2: Detailed Requirements Specification */}
        <section className="space-y-12">
            <h3 className="text-3xl font-black text-navy-700 uppercase tracking-tight border-l-[12px] border-sky-500 pl-8">01. Hardware Specifications</h3>
            <div className="space-y-10">
                <p className="text-xl text-slate-600 font-medium">The <b>Requirements Entry</b> console allows for granular control over deployment needs:</p>
                
                <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-16">
                    {/* Shift Categories */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <span className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl font-black">A</span>
                            <h4 className="text-xl font-black text-navy-700 uppercase">Standard Shift Baseline</h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            For every shift (e.g. Morning, Evening, Night), enabling a category like <b>GPS Locks, RFID Master Cards, or IO Adaptors</b> creates a corresponding audit row in the Warehouse Receiving page.
                        </p>
                    </div>

                    {/* Manual Entry Expansion */}
                    <div className="space-y-8 border-t border-slate-100 pt-12">
                        <div className="flex items-center gap-6">
                            <span className="w-14 h-14 rounded-2xl bg-navy-900 text-white flex items-center justify-center text-xl font-black">B</span>
                            <h4 className="text-xl font-black text-navy-700 uppercase">Manual Entry Logic</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="p-8 bg-sky-50/50 rounded-3xl border border-sky-100">
                                <h5 className="text-xs font-black text-sky-700 uppercase tracking-widest mb-4">GPS Lock Selection</h5>
                                <p className="text-xs text-sky-800 font-bold leading-relaxed uppercase">
                                    Selecting "GPS Lock" from the manual material dropdown automatically expands into <b>four sub-fields</b>: Locks, RFID, Chargers, and Adapters. This allows for bulk hardware provisioning outside of standard shifts.
                                </p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
                                <h5 className="text-xs font-black text-navy-700 uppercase tracking-widest mb-4">Other Material Logic</h5>
                                <p className="text-xs text-slate-600 font-bold leading-relaxed uppercase">
                                    For items like "Trunks" or "Cables", a single <b>Total Quantity</b> field is used. This is pushed to the warehouse as a single consolidated audit unit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3: Warehouse Receiving Operations */}
        <section className="space-y-12">
            <h3 className="text-3xl font-black text-navy-700 uppercase tracking-tight border-l-[12px] border-sky-500 pl-8">02. Warehouse Inbound Audit</h3>
            <div className="space-y-10">
                <p className="text-xl text-slate-600 font-medium">The <b>Warehouse Receiving</b> module reconciles physical arrival with digital requirements.</p>
                
                <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl space-y-12">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-navy-700 uppercase">Automated List Population</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            The Audit List is no longer static. It is a real-time reflection of the <b>Requirements Module</b>. If "Morning Shift: RFID Unique Tags" is enabled, it WILL appear here. If "Manual: Packaging" is added, it WILL appear here.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 pt-12">
                        <div className="space-y-6">
                            <h4 className="text-lg font-black text-navy-700 uppercase">Proof of Receiving (PoR)</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Users must click <b>"Upload Proof Document"</b> to attach photos, delivery challans, or digital signatures related to the inbound shipment. These artifacts are stored in the project audit log.
                            </p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
                            <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">Audit Accuracy Protocol</h5>
                            <ul className="text-[10px] text-emerald-700 font-bold uppercase space-y-2">
                                <li>• Enter Exact Counts</li>
                                <li>• Check nomenclature labels</li>
                                <li>• Verify node timestamp</li>
                                <li>• Document any mismatches</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Support Footer */}
        <section className="bg-sky-500 p-16 rounded-[4rem] text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full"></div>
            <div className="relative z-10 space-y-10">
                <h3 className="text-4xl font-black uppercase tracking-widest">Global Operations Desk</h3>
                <p className="text-sky-100 font-bold uppercase tracking-[0.2em] text-sm max-w-2xl mx-auto leading-relaxed">
                    If you encounter a synchronization delay between Requirements and Warehouse modules, or if you require an Administrative Override, use the priority line.
                </p>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                    <div className="bg-white/10 px-10 py-6 rounded-3xl border border-white/20 backdrop-blur-md">
                        <span className="block text-[10px] font-black text-sky-200 uppercase mb-2 tracking-widest">Priority Ops Desk</span>
                        <span className="text-lg font-mono font-black">support.ops@iil-global.com</span>
                    </div>
                    <div className="bg-white/10 px-10 py-6 rounded-3xl border border-white/20 backdrop-blur-md">
                        <span className="block text-[10px] font-black text-sky-200 uppercase mb-2 tracking-widest">Emergency Tech NOC</span>
                        <span className="text-lg font-mono font-black">+91 1800-SYN-LOCK</span>
                    </div>
                </div>
            </div>
        </section>

        <footer className="pt-20 border-t border-slate-200 text-center pb-20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">TrackView Standard Operating Procedures • Confidential Documentation • © 2024 Intelligent Identification Ltd.</p>
        </footer>
      </div>
    </div>
  );
};

export default UserManual;