import React, { useState } from 'react';
import { PowerIcon, UserGroupIcon, DocumentDuplicateIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import SetManager from './SetManager';
import StudentsPanel from './StudentsPanel';

// Define the type for the panel names for type safety
type AdminPanel = 'quizSets' | 'students';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // Default to showing the 'Quiz Sets' panel first
  const [activePanel, setActivePanel] = useState<AdminPanel>('quizSets');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('isAdmin');
      onLogout();
    }
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'quizSets':
        return <SetManager />;
      case 'students':
        return <StudentsPanel />;
      default:
        return <SetManager />;
    }
  };

  // Helper component for navigation buttons
  const NavButton = ({ panel, label, icon: Icon }: { 
    panel: AdminPanel; 
    label: string; 
    icon: React.ComponentType<{ className?: string }> 
  }) => {
  
    const isActive = activePanel === panel;
    return (
      <button
        onClick={() => setActivePanel(panel)}
        className={`
          flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
          ${isActive
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }
        `}
      >
        <Icon className="h-5 w-5 mr-2" />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <PowerIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Tab Navigation */}
          <nav className="flex space-x-4 p-4 border-b border-gray-200">
            <NavButton panel="quizSets" label="Quiz Set Management" icon={DocumentDuplicateIcon} />
            <NavButton panel="students" label="Student Management" icon={UserGroupIcon} />
          </nav>
          
          {/* Content Panel */}
          <div className="p-6">
            {renderPanel()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
