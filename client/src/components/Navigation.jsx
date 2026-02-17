import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              <span className="text-blue-600">Worko</span> Referrals
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-2">
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
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
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
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
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
            <button
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="mr-3">📊</span>
              Dashboard
            </button>
            
            <button
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer ${
                activeTab === 'referral'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => {
                setActiveTab('referral');
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="mr-3">👥</span>
              Refer Candidate
            </button>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
            <div className="px-4 space-y-3">
              <div className="text-sm text-gray-600">
                Welcome, {user?.name}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;