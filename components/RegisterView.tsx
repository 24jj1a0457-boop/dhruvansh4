
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { AppView } from '../types';

interface RegisterViewProps {
  onNavigate: (view: AppView) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', vehicleId: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'pending_users'), {
        ...formData,
        status: 'pending',
        timestamp: Date.now()
      });
      onNavigate('PENDING_MESSAGE');
    } catch (error) {
      alert('Error submitting registration: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <button onClick={() => onNavigate('LANDING')} className="text-slate-400 hover:text-white mb-6 text-sm flex items-center gap-2">
          ← Back to Selection
        </button>
        <h2 className="text-3xl font-black mb-2 text-white italic font-tech">REGISTRATION</h2>
        <p className="text-slate-400 mb-8 text-sm">Enter vehicle and contact details for verification.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none transition-all"
              placeholder="e.g. John Doe"
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
            <input 
              required
              type="email" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none transition-all"
              placeholder="operator@resqflow.gov"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Emergency Vehicle ID</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-cyan-500 outline-none transition-all"
              placeholder="AMB-502-TS"
              onChange={e => setFormData({...formData, vehicleId: e.target.value})}
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'PROCESSING...' : 'SUBMIT FOR APPROVAL'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;
