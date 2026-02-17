import { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLogin ? <Login /> : <Register />}
      
      <div className="text-center ">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthWrapper;