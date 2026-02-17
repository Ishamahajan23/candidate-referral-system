import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ReferralForm from './components/ReferralForm';
import AuthWrapper from './components/AuthWrapper';
import './App.css';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCandidateAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('dashboard'); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-4">
        {activeTab === 'dashboard' && (
          <Dashboard key={refreshTrigger} />
        )}
        
        {activeTab === 'referral' && (
          <ReferralForm onCandidateAdded={handleCandidateAdded} />
        )}
      </main>
      
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 text-center">
          <p className="text-gray-300 text-sm">&copy; 2026 Worko Referrals. Built with React & Node.js</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
