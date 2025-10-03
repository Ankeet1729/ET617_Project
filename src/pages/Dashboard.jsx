// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { logEvent } from '../utils/clickLogger';
import { motion } from 'framer-motion';
import { BookOpen, LogOut } from 'lucide-react';

function Dashboard() {
  const { currentUser, logout } = useAuth();

  const getUserId = () => currentUser?.uid || 'anonymous';

  useEffect(() => {
    const uid = getUserId();
    logEvent(uid, 'page_view', { 
      page: 'dashboard', 
      path: window.location.pathname 
    });
  }, [currentUser]);

  const handleLinkClick = (moduleNumber) => {
    const uid = getUserId();
    logEvent(uid, 'link_click', { 
      target: `/lesson/${moduleNumber}`, 
      label: `Go to Module ${moduleNumber} Lesson` 
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const modules = [1, 2, 3]; // total modules

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Top bar with user info */}
      <div className="absolute top-6 right-8 flex items-center gap-4">
        <span className="text-gray-300 text-sm">
          {currentUser?.email || 'Guest User'}
        </span>
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>

      {/* Dashboard Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
      >
        Welcome, {currentUser?.email?.split('@')[0] || 'Guest'} 👋
      </motion.h1>

      <p className="text-gray-300 mb-10 text-lg">
        Choose a module to continue your learning journey
      </p>

      {/* Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {modules.map((module, i) => (
          <motion.div
            key={module}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-primary/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-8 h-8 text-secondary" />
              <h2 className="text-2xl font-semibold text-white">
                Module {module}
              </h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Learn and explore interactive lessons in Module {module}.
            </p>
            <Link
              to={`/lesson/${module}`}
              onClick={() => handleLinkClick(module)}
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-lg font-medium hover:from-indigo-500 hover:to-cyan-400 transition-all shadow-md hover:shadow-lg"
            >
              Start Lesson →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
