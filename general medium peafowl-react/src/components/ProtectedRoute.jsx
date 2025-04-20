import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }
  
  return children;
};

export default ProtectedRoute;