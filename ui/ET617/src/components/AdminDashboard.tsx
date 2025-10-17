import React, { useState, useEffect } from "react";
import StudentsPanel from "./StudentsPanel";
import QuizzesPanel from "./QuizzesPanel";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState<"students" | "quizzes">("students");

  const handleLogout = async () => {
    await fetch("http://localhost:5000/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("isAdmin");
    onLogout();
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Panel Dashboard</h1>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <div className="panel-selector">
        <button
          className={activePanel === "students" ? "active" : ""}
          onClick={() => setActivePanel("students")}
        >
          Students
        </button>
        <button
          className={activePanel === "quizzes" ? "active" : ""}
          onClick={() => setActivePanel("quizzes")}
        >
          Quizzes
        </button>
      </div>

      <main className="admin-content">
        {activePanel === "students" && <StudentsPanel />}
        {activePanel === "quizzes" && <QuizzesPanel />}
      </main>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: Arial, sans-serif;
        }
        .admin-header {
          background: #667eea;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .logout-btn {
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }
        .panel-selector {
          display: flex;
          background: white;
          border-bottom: 1px solid #eee;
          padding: 0 2rem;
        }
        .panel-selector button {
          flex: 1;
          padding: 1rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1.1rem;
          border-bottom: 3px solid transparent;
        }
        .panel-selector button.active {
          color: #667eea;
          border-bottom-color: #667eea;
          font-weight: bold;
        }
        .admin-content {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
