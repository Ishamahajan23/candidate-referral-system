import { createContext, useContext, useReducer, useEffect } from 'react';
import config from '../config/config';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token
          }
        });
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: data.message || 'Login failed'
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Network error. Please try again.'
      });
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token
          }
        });
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: data.message || 'Registration failed'
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Network error. Please try again.'
      });
    }
  };

  const logout = async () => {
    try {
      await fetch(`${config.API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token
          }
        });
      } else {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};