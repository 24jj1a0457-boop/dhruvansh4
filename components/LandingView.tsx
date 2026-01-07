
import React from 'react';
import { AppView } from '../types';

interface LandingViewProps {
  onNavigate: (view: AppView) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10 text-center space-y-2 mb-12">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white font-tech italic">
          RESQ<span className="text-cyan-500">FLOW</span>
        </h1>
        <p className="text-slate-400 font-medium tracking-[0.2em] uppercase text-sm">Emergency Vehicle Priority Engine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
        <button 
          onClick={() => onNavigate('USER_LOGIN')}
          className="glass p-8 rounded-2xl group hover:border-cyan-500/50 transition-all duration-300 flex flex-col items-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 text-3xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
            👤
          </div>
          <h3 className="text-xl font-bold">User Login</h3>
          <p className="text-slate-400 text-sm">Access vehicle dashboard and signal priority controls.</p>
        </button>

        <button 
          onClick={() => onNavigate('REGISTER')}
          className="glass p-8 rounded-2xl group hover:border-white/40 transition-all duration-300 flex flex-col items-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white text-3xl group-hover:bg-white group-hover:text-black transition-colors">
            📝
          </div>
          <h3 className="text-xl font-bold text-white">Fresh Registration</h3>
          <p className="text-slate-400 text-sm">Request approval for a new emergency vehicle entry.</p>
        </button>

        <button 
          onClick={() => onNavigate('ADMIN_LOGIN')}
          className="glass p-8 rounded-2xl group hover:border-red-500/50 transition-all duration-300 flex flex-col items-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 text-3xl group-hover:bg-red-500 group-hover:text-white transition-colors">
            🛡️
          </div>
          <h3 className="text-xl font-bold">Admin Portal</h3>
          <p className="text-slate-400 text-sm">Centralized control for user approval and system monitoring.</p>
        </button>
      </div>

      <div className="absolute bottom-10 text-xs text-slate-500 uppercase tracking-widest font-tech">
        System Ver 2.4.0 • Secured by Protocol X
      </div>
    </div>
  );
};

export default LandingView;
