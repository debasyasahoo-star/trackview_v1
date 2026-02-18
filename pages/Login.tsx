import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, projectCode: string, passcode: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [projectCode, setProjectCode] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.IIL_OPS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectCode && password) {
      onLogin(role, projectCode, password);
    }
  };

  const features = [
    {
      title: "Global Fleet Control",
      desc: "Real-time GPS lock telemetry and transit monitoring across national networks.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      title: "Inbound Audit Integrity",
      desc: "Digital reconciliation of project requirements with automated discrepancy alerts.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Secure Auth Protocol",
      desc: "Multi-modal unlock authorization tracking via Passcode, RFID, and Remote Dashboard.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Reverse Logistics Hub",
      desc: "Automated return workflows and inventory recovery optimization for end-of-exam cycles.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-white text-navy-700 p-16 flex-col justify-between relative overflow-hidden border-r border-slate-200">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/5 blur-[120px] rounded-full -mr-96 -mt-96 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="mb-16">
            <div className="flex flex-col group cursor-default">
              <div className="text-6xl font-black tracking-[-0.08em] text-navy-900 uppercase leading-none">
                Track
              </div>
              <div className="flex items-center mt-[-4px]">
                <div className="h-[6px] w-24 bg-sky-500 rounded-full"></div>
                <div className="text-5xl font-black tracking-tighter text-sky-500 lowercase ml-1 leading-none">
                  view
                </div>
              </div>
            </div>
            <p className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Operational Command & Intelligence</p>
          </div>

          <h2 className="text-5xl font-black leading-[1.1] tracking-tighter mb-12 text-navy-900">
            Enterprise Grade <br />
            <span className="text-sky-500">Security Deployment</span> <br />
            Monitoring.
          </h2>

          <div className="grid grid-cols-1 gap-10 max-w-xl">
            {features.map((f, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-14 h-14 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-1.5 text-navy-800">{f.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-16 flex justify-between items-end border-t border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Powered By</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-navy-700">Intelligent Identification Ltd.</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Systems Nominal</p>
             </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-12 flex flex-col items-center">
            <div className="flex flex-col group cursor-default">
              <div className="text-5xl font-black tracking-[-0.08em] text-navy-900 uppercase leading-none">
                Track
              </div>
              <div className="flex items-center mt-[-2px]">
                <div className="h-[4px] w-20 bg-sky-500 rounded-full"></div>
                <div className="text-4xl font-black tracking-tighter text-sky-500 lowercase ml-1 leading-none">
                  view
                </div>
              </div>
            </div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mt-4">Exam Lock Operations System</p>
          </div>

          <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="mb-10">
              <h3 className="text-2xl font-black text-navy-900 uppercase tracking-tighter">Secure Login</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Authorized access only • Audit log active</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2.5">Platform Access Role</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-navy-700 focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all cursor-pointer appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%230ea5e9\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                >
                  <option value={UserRole.ADMIN}>Administrator (Root)</option>
                  <option value={UserRole.IIL_OPS}>IIL Operations Command</option>
                  <option value={UserRole.WAREHOUSE}>Warehouse Management</option>
                  <option value={UserRole.CLIENT}>Client Agency Portal</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2.5">Active Project Code</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-navy-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all uppercase"
                  placeholder="e.g. UPSC-2024-X"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-2.5">Security Passcode</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-black text-navy-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-sky-50 focus:border-sky-500 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                 <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                    <label htmlFor="remember" className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer">Stay Authenticated</label>
                 </div>
                 <button type="button" className="text-[10px] font-black text-sky-500 uppercase tracking-widest hover:underline">Forgot Key?</button>
              </div>

              <button 
                type="submit"
                className="w-full bg-sky-500 text-white font-black py-5 rounded-2xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 text-[11px] uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-3"
              >
                Establish Secure Session
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
               <Link 
                to="/manual" 
                className="inline-flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-navy-700 transition-colors"
              >
                  Standard Operating Procedures
                  <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center opacity-50 flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hardware Identity Validated • 256-bit Encrypted</p>
            <p className="text-[9px] font-mono text-slate-500">SESSION_ID: TV-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;