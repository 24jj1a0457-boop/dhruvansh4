
import React, { useState, useEffect } from 'react';
import { ApprovedUser } from '../types';
import { db, auth } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

interface UserDashboardProps {
  data: ApprovedUser | null;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ data, onLogout }) => {
  const [localData, setLocalData] = useState<ApprovedUser | null>(data);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (data?.uid) {
      const unsub = onSnapshot(doc(db, 'approved_users', data.uid), (doc) => {
        setLocalData(doc.data() as ApprovedUser);
      });
      return () => unsub();
    }
  }, [data]);

  const toggleEmergency = async () => {
    if (!localData) return;
    setUpdating(true);
    const newStatus = localData.status === 'idle' ? 'emergency' : 'idle';
    try {
      await updateDoc(doc(db, 'approved_users', localData.uid), {
        status: newStatus
      });
    } catch (e) {
      alert('Failed to toggle status.');
    } finally {
      setUpdating(false);
    }
  };

  if (!localData) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col max-w-6xl mx-auto">
      <header className="flex justify-between items-start mb-12">
        <div>
          <div className="text-cyan-500 font-tech text-xs tracking-widest uppercase mb-2">Operator Active Session</div>
          <h1 className="text-4xl font-black italic text-white uppercase">{localData.fullName}</h1>
          <p className="text-slate-500 font-medium">Vehicle ID: <span className="text-slate-200">{localData.vehicleId}</span></p>
        </div>
        <button onClick={onLogout} className="px-5 py-2 glass rounded-lg hover:bg-red-500/20 text-xs font-bold transition-all">TERMINATE SESSION</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connection Status Card */}
        <div className="glass p-8 rounded-3xl flex items-center gap-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${localData.esp32Connected ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500 animate-pulse'}`}>
            {localData.esp32Connected ? '📡' : '⚠️'}
          </div>
          <div>
            <h3 className="font-bold text-lg">ESP32 Module</h3>
            <p className="text-slate-500 text-sm">Status: <span className={localData.esp32Connected ? 'text-emerald-400' : 'text-red-400'}>{localData.esp32Connected ? 'Online & Linked' : 'Offline / Syncing'}</span></p>
          </div>
        </div>

        {/* Current State Card */}
        <div className="glass p-8 rounded-3xl flex items-center gap-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${localData.status === 'emergency' ? 'bg-red-500/20 text-red-500' : 'bg-cyan-500/20 text-cyan-500'}`}>
             {localData.status === 'emergency' ? '🚨' : '🛡️'}
          </div>
          <div>
            <h3 className="font-bold text-lg">Deployment Status</h3>
            <p className="text-slate-500 text-sm uppercase font-tech">Current: <span className={localData.status === 'emergency' ? 'text-red-400' : 'text-cyan-400'}>{localData.status}</span></p>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold mb-2">Priority Control Override</h2>
          <p className="text-slate-500 text-sm max-w-sm">Use this button only during active emergency dispatch. Signal lights will automatically transition to priority clearance.</p>
        </div>

        <button 
          onClick={toggleEmergency}
          disabled={updating}
          className={`w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-8 ${
            localData.status === 'emergency' 
            ? 'bg-red-600 border-red-400 pulse text-white scale-110' 
            : 'bg-slate-800 border-slate-700 hover:border-cyan-500 text-slate-400'
          }`}
        >
          <span className="text-5xl mb-2">{localData.status === 'emergency' ? '🛑' : '🚨'}</span>
          <span className="font-black text-xl font-tech">{localData.status === 'emergency' ? 'STOP' : 'GO'}</span>
          <span className="text-[10px] mt-2 opacity-50 uppercase tracking-widest">{localData.status === 'emergency' ? 'Active Dispatch' : 'Standby Mode'}</span>
        </button>
      </div>

      <footer className="mt-auto pt-10 border-t border-white/5 flex flex-wrap gap-4 text-[10px] text-slate-600 font-tech uppercase">
        <div>Encryption: AES-256-GCM</div>
        <div>Uptime: 99.98%</div>
        <div>Server: V-HYD-04</div>
      </footer>
    </div>
  );
};

export default UserDashboard;
