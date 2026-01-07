
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { AppView } from '../types';

interface LoginViewProps {
  type: 'user' | 'admin';
  onNavigate: (view: AppView) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ type, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (type === 'admin') {
        const adminSnap = await getDocs(query(collection(db, 'admins'), where('email', '==', email)));
        if (adminSnap.empty) throw new Error("Unauthorized Admin Credentials.");
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className={`glass w-full max-w-md p-8 rounded-3xl shadow-2xl border-t-4 ${type === 'admin' ? 'border-red-500' : 'border-cyan-500'}`}>
        <button onClick={() => onNavigate('LANDING')} className="text-slate-400 hover:text-white mb-6 text-sm flex items-center gap-2">
          ← Back
        </button>
        <h2 className="text-3xl font-black mb-2 text-white italic font-tech uppercase">{type} LOGIN</h2>
        <p className="text-slate-400 mb-8 text-sm">Secure authorization required to proceed.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-xs rounded-lg">{error}</div>}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Account Email</label>
            <input 
              required
              type="email" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-white/50"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
            <input 
              required
              type={showPass ? 'text' : 'password'} 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-white/50"
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 bottom-3.5 text-slate-500 text-sm hover:text-white"
            >
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <button 
              type="button"
              onClick={() => {
                if(!email) alert('Please enter email first');
                else sendPasswordResetEmail(auth, email).then(() => alert('Reset link sent!'));
              }}
              className="text-slate-500 hover:text-cyan-400"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className={`w-full font-bold py-4 rounded-xl transition-all disabled:opacity-50 mt-4 ${type === 'admin' ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
