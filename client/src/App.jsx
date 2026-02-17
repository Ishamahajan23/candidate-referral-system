import { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ReferralForm from './components/ReferralForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCandidateAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('dashboard'); 
  };

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
}

export default App;
