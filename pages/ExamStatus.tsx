
import React from 'react';
import { StatusBadge } from '../constants';

const ExamStatusPage: React.FC = () => {
  const data = [
    { lockId: 'L-5001', center: 'C-001', method: 'Passcode', unlockTime: '08:45 AM', lockTime: '-', status: 'Unlocked' },
    { lockId: 'L-5002', center: 'C-001', method: 'Dashboard', unlockTime: '08:47 AM', lockTime: '-', status: 'Unlocked' },
    { lockId: 'L-5003', center: 'C-002', method: 'RFID', unlockTime: '08:55 AM', lockTime: '-', status: 'Unlocked' },
    { lockId: 'L-5004', center: 'C-003', method: '-', unlockTime: '-', lockTime: '-', status: 'Locked' },
    { lockId: 'L-5005', center: 'C-004', method: '-', unlockTime: '-', lockTime: '-', status: 'Ready' },
  ];

  return (
    <section className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-gray-800">Live Exam Operation Status</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time update: Active</p>
        </div>
        <div className="flex gap-3">
             <input className="border border-gray-300 rounded px-3 py-1 text-xs" placeholder="Search Lock ID/Center..." />
             <button className="bg-gray-100 border border-gray-300 text-gray-600 px-3 py-1 text-xs font-bold rounded">Export PDF</button>
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Lock ID</th>
            <th className="px-6 py-4">Center Code</th>
            <th className="px-4 py-4">Unlock Method</th>
            <th className="px-4 py-4">Unlock Time</th>
            <th className="px-4 py-4">Lock Time</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-black text-gray-700 font-mono">{row.lockId}</td>
              <td className="px-6 py-4 text-gray-600 font-bold">{row.center}</td>
              <td className="px-4 py-4 text-gray-500">{row.method}</td>
              <td className="px-4 py-4 font-mono text-xs text-blue-600">{row.unlockTime}</td>
              <td className="px-4 py-4 font-mono text-xs text-red-600">{row.lockTime}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    row.status === 'Unlocked' ? 'bg-green-100 text-green-700' : 
                    row.status === 'Locked' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                }`}>
                    {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ExamStatusPage;
