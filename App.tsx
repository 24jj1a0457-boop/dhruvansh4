
import React, { useState, useEffect } from 'react';
import { AppView, ApprovedUser } from './types';
import LandingView from './components/LandingView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('LANDING');
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<ApprovedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        // Check if admin
        const adminSnap = await getDocs(query(collection(db, 'admins'), where('email', '==', currentUser.email)));
        if (!adminSnap.empty) {
          setUser(currentUser);
          setView('ADMIN_DASHBOARD');
        } else {
          // Check if approved user
          const userDoc = await getDoc(doc(db, 'approved_users', currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            setUserData(userDoc.data() as ApprovedUser);
            setView('USER_DASHBOARD');
          } else {
            // Logged in but not found (might have been deleted or admin removed)
            await auth.signOut();
            setView('LANDING');
          }
        }
      } else {
        setUser(null);
        if (view === 'USER_DASHBOARD' || view === 'ADMIN_DASHBOARD') {
          setView('LANDING');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-cyan-500 font-tech animate-pulse">RESQFLOW INITIALIZING...</div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'LANDING':
        return <LandingView onNavigate={setView} />;
      case 'USER_LOGIN':
        return <LoginView type="user" onNavigate={setView} />;
      case 'ADMIN_LOGIN':
        return <LoginView type="admin" onNavigate={setView} />;
      case 'REGISTER':
        return <RegisterView onNavigate={setView} />;
      case 'USER_DASHBOARD':
        return <UserDashboard data={userData} onLogout={() => auth.signOut()} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard onLogout={() => auth.signOut()} />;
      case 'PENDING_MESSAGE':
        return (
          <div className="h-screen flex items-center justify-center p-6 text-center">
            <div className="glass p-10 rounded-2xl max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Registration Received</h2>
              <p className="text-slate-400 mb-8">Your request is currently pending. Please wait for an administrator to approve your vehicle ID.</p>
              <button onClick={() => setView('LANDING')} className="px-6 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all">Back Home</button>
            </div>
          </div>
        );
      default:
        return <LandingView onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-cyan-500/30">
      {renderView()}
    </div>
  );
};

export default App;
