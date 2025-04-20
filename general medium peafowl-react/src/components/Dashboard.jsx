import React from 'react';
import { useAuth } from './context/AuthContext';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-150/15 via-black to-black">
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-600/20 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">INKSCAPE</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              Hello, {user?.first_name || user?.email}
            </span>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-600/20">
          <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
          <p className="text-gray-300 mb-4">
            Welcome to INKSCAPE! You are now successfully logged in.
          </p>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-purple-600/10">
            <h3 className="text-lg font-medium text-white mb-2">Your Account Information</h3>
            <pre className="text-gray-400 overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;