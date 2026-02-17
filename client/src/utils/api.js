import config from '../config/config';

export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  if (options.body instanceof FormData) {
    delete requestOptions.headers['Content-Type'];
  }

  try {
    const response = await fetch(`${config.API_BASE_URL}${url}`, requestOptions);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.reload(); 
      return null;
    }

    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const candidatesAPI = {
  getAll: (searchParams = '') => apiRequest(`/api/candidates${searchParams}`),
  getStats: () => apiRequest('/api/candidates/stats'),
  create: (formData) => apiRequest('/api/candidates', {
    method: 'POST',
    body: formData
  }),
  updateStatus: (id, status) => apiRequest(`/api/candidates/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  delete: (id) => apiRequest(`/api/candidates/${id}`, {
    method: 'DELETE'
  })
};

export const getCandidates = async (searchParams = '') => {
  const { data } = await candidatesAPI.getAll(searchParams);
  return data.success ? data.data : [];
};

export const getCandidatesStats = async () => {
  const { data } = await candidatesAPI.getStats();
  return data.success ? data.data : null;
};

export const createCandidate = async (formData) => {
  const { data } = await candidatesAPI.create(formData);
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to create candidate');
};

export const updateCandidateStatus = async (id, status) => {
  const { data } = await candidatesAPI.updateStatus(id, status);
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to update candidate status');
};

export const deleteCandidate = async (id) => {
  const { data } = await candidatesAPI.delete(id);
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Failed to delete candidate');
};