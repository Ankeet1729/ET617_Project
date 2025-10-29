// import React, { useState } from 'react';
// import { PowerIcon, UserGroupIcon, DocumentDuplicateIcon, ChartBarIcon } from '@heroicons/react/24/outline';
// import SetManager from './SetManager';
// import StudentsPanel from './StudentsPanel';

// // Define the type for the panel names for type safety
// type AdminPanel = 'quizSets' | 'students';

// interface AdminDashboardProps {
//   onLogout: () => void;
// }

// const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
//   // Default to showing the 'Quiz Sets' panel first
//   const [activePanel, setActivePanel] = useState<AdminPanel>('quizSets');

//   const handleLogout = async () => {
//     try {
//       await fetch('http://localhost:5000/admin/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       localStorage.removeItem('isAdmin');
//       onLogout();
//     }
//   };

//   const renderPanel = () => {
//     switch (activePanel) {
//       case 'quizSets':
//         return <SetManager />;
//       case 'students':
//         return <StudentsPanel />;
//       default:
//         return <SetManager />;
//     }
//   };

//   // Helper component for navigation buttons
//   const NavButton = ({ panel, label, icon: Icon }: { 
//     panel: AdminPanel; 
//     label: string; 
//     icon: React.ComponentType<{ className?: string }> 
//   }) => {
  
//     const isActive = activePanel === panel;
//     return (
//       <button
//         onClick={() => setActivePanel(panel)}
//         className={`
//           flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
//           ${isActive
//             ? 'bg-indigo-600 text-white shadow-sm'
//             : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
//           }
//         `}
//       >
//         <Icon className="h-5 w-5 mr-2" />
//         {label}
//       </button>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//             <button
//               onClick={handleLogout}
//               className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//             >
//               <PowerIcon className="h-5 w-5 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="bg-white shadow rounded-lg">
//           {/* Tab Navigation */}
//           <nav className="flex space-x-4 p-4 border-b border-gray-200">
//             <NavButton panel="quizSets" label="Quiz Set Management" icon={DocumentDuplicateIcon} />
//             <NavButton panel="students" label="Student Management" icon={UserGroupIcon} />
//           </nav>
          
//           {/* Content Panel */}
//           <div className="p-6">
//             {renderPanel()}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState } from 'react';
import { PowerIcon, UserGroupIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import SetManager from './SetManager';
import StudentsPanel from './StudentsPanel';

type AdminPanel = 'quizSets' | 'students';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
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

  const NavButton = ({ panel, label, Icon }: { panel: AdminPanel; label: string; Icon: React.ComponentType<any> }) => {
    const isActive = activePanel === panel;
    return (
      <button
        onClick={() => setActivePanel(panel)}
        aria-pressed={isActive}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid',
          borderColor: isActive ? 'transparent' : 'var(--border)',
          background: isActive ? 'linear-gradient(90deg,var(--primary),var(--primary-dark))' : 'transparent',
          color: isActive ? 'white' : 'var(--text-primary)',
          cursor: 'pointer',
          fontWeight: 700,
          boxShadow: isActive ? '0 6px 18px rgba(37,99,235,0.12)' : 'none',
        }}
      >
        <Icon style={{ width: 18, height: 18, opacity: isActive ? 1 : 0.85 }} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,var(--background), #f8fbff)' }}>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(2,6,23,0.03)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0' }}>
          <div>
            <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Manage quiz sets and students</div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 10,
                background: 'linear-gradient(90deg,#fee2e2,#fecaca)',
                border: '1px solid rgba(239,68,68,0.12)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              <PowerIcon style={{ width: 16, height: 16 }} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '20px 0 60px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 8px 20px rgba(2,6,23,0.04)', overflow: 'hidden' }}>
          <nav style={{ display: 'flex', gap: 12, padding: 16, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <NavButton panel="quizSets" label="Quiz Set Management" Icon={DocumentDuplicateIcon} />
            <NavButton panel="students" label="Student Management" Icon={UserGroupIcon} />
          </nav>

          <div style={{ padding: 18 }}>
            {renderPanel()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
