
import { useAuth } from '../context/AuthContext';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-blue-600">Worko</span> Referrals
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="mr-2">📊</span>
                Dashboard
              </button>
              
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'referral'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('referral')}
              >
                <span className="mr-2">👥</span>
                Refer Candidate
              </button>
            </div>

            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;