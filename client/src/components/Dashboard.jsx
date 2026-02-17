import { useState, useEffect } from 'react';
import { getCandidates, getCandidatesStats } from '../utils/api';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchCandidates();
    fetchStats();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, statusFilter]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getCandidatesStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }

    setFilteredCandidates(filtered);
  };

  const updateCandidateStatus = async (candidateId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCandidates(prevCandidates =>
          prevCandidates.map(candidate =>
            candidate._id === candidateId 
              ? { ...candidate, status: newStatus }
              : candidate
          )
        );
        fetchStats();
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update candidate status');
      console.error('Error updating status:', err);
    }
  };

  const deleteCandidateHandler = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/candidates/${candidateId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setCandidates(prevCandidates =>
          prevCandidates.filter(candidate => candidate._id !== candidateId)
        );
        fetchStats();
      } else {
        setError(data.message || 'Failed to delete candidate');
      }
    } catch (err) {
      setError('Failed to delete candidate');
      console.error('Error deleting candidate:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Candidate Dashboard</h1>
        
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
              <p className="text-gray-600 text-sm">Total Candidates</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
              <h3 className="text-2xl font-bold text-yellow-800">{stats.pending}</h3>
              <p className="text-yellow-600 text-sm">Pending</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800">{stats.reviewed}</h3>
              <p className="text-blue-600 text-sm">Reviewed</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
              <h3 className="text-2xl font-bold text-green-800">{stats.hired}</h3>
              <p className="text-green-600 text-sm">Hired</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, job title, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'No candidates match your search criteria' 
                : 'No candidates found'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by adding some candidates using the referral form.'}
            </p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{candidate.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  candidate.status === 'Pending' 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : candidate.status === 'Reviewed'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {candidate.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Job Title:</span> {candidate.jobTitle}</p>
                <p><span className="font-medium">Email:</span> 
                  <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline ml-1">
                    {candidate.email}
                  </a>
                </p>
                <p><span className="font-medium">Phone:</span> 
                  <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:underline ml-1">
                    {candidate.phone}
                  </a>
                </p>
                <p><span className="font-medium">Referred:</span> {formatDate(candidate.createdAt)}</p>
                {candidate.resumeUrl && (
                  <p><span className="font-medium">Resume:</span>
                    <a 
                      href={candidate.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      View PDF ↗
                    </a>
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Update Status:</label>
                  <select
                    value={candidate.status}
                    onChange={(e) => updateCandidateStatus(candidate._id, e.target.value)}
                    className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
                
                <button
                  onClick={() => deleteCandidateHandler(candidate._id)}
                  className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Delete Candidate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;