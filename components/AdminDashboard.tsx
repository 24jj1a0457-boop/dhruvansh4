
import React, { useState, useEffect } from 'react';
import { db, firebaseConfig } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { initializeApp, deleteApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { PendingUser } from '../types';

const AdminDashboard: React.FC<{onLogout: () => void}> = ({ onLogout }) => {
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pending_users'), (snapshot) => {
      const users: PendingUser[] = [];
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() } as PendingUser));
      setPending(users);
    });
    return () => unsub();
  }, []);

  const approveUser = async (user: PendingUser) => {
    if (!confirm(`Approve ${user.fullName} for Vehicle ${user.vehicleId}?`)) return;
    setLoading(true);
    const tempPass = Math.random().toString(36).slice(-10) + '1@A';
    
    try {
      // 1. Create User in Auth using secondary app to avoid logging out current admin
      const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, user.email, tempPass);
      const uid = userCredential.user.uid;
      await deleteApp(secondaryApp);

      // 2. Add to Approved Collection
      await setDoc(doc(db, 'approved_users', uid), {
        uid: uid,
        fullName: user.fullName,
        email: user.email,
        vehicleId: user.vehicleId,
        status: 'idle',
        esp32Connected: false
      });

      // 3. Remove from Pending
      if (user.id) await deleteDoc(doc(db, 'pending_users', user.id));

      // 4. Send Email Logic (Simplified/Placeholder for EmailJS)
      console.log(`Sending Email to ${user.email} with Pass: ${tempPass}`);
      alert(`User Approved!\nCredentials sent to ${user.email}\nTemporary Password: ${tempPass}`);
      
      // Real EmailJS call would go here:
      // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      //   to_name: user.fullName,
      //   user_email: user.email,
      //   password: tempPass
      // });

    } catch (e: any) {
      alert('Approval error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const rejectUser = async (id: string | undefined) => {
    if (!id) return;
    if (confirm('Delete this registration request?')) {
      await deleteDoc(doc(db, 'pending_users', id));
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-black text-white italic font-tech">ADMIN<span className="text-red-500">CORE</span></h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Registration Control & Dispatcher Verification</p>
        </div>
        <button onClick={onLogout} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-all">SYSTEM LOGOUT</button>
      </header>

      <main className="flex-1">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            PENDING REQUESTS: {pending.length}
          </div>
        </div>

        {pending.length === 0 ? (
          <div className="glass rounded-3xl p-20 text-center">
            <div className="text-4xl mb-4 text-slate-700 italic">No Pending Verifications</div>
            <p className="text-slate-600 text-sm uppercase tracking-widest">Queue Clear • Operations Normal</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pending.map(user => (
              <div key={user.id} className="glass p-6 rounded-3xl border-l-4 border-amber-500 hover:bg-slate-800/80 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
                    <p className="text-cyan-400 font-tech text-[10px] tracking-tight">{user.vehicleId}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded">
                    {new Date(user.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-slate-400 text-sm mb-6 flex-1">
                  Contact: <span className="text-slate-200">{user.email}</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    disabled={loading}
                    onClick={() => approveUser(user)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all"
                  >
                    APPROVE
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => rejectUser(user.id)}
                    className="flex-1 bg-red-900/40 hover:bg-red-900/60 text-red-400 font-bold py-2 rounded-xl text-xs transition-all border border-red-900"
                  >
                    REJECT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-12 text-[10px] text-slate-700 flex justify-between uppercase font-tech">
        <div>ResqFlow Node v2.1 (ADMIN)</div>
        <div>Session Token Active</div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
