import React, { useState, useEffect } from "react";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

const App: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register" | "dashboard" | "adminLogin" | "admin">("login");
  const [currentUser, setCurrentUser] = useState("");
  const [currentGrade, setCurrentGrade] = useState<number | null>(null);

  // Check for existing student login session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedGrade = localStorage.getItem("currentGrade");
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentGrade(savedGrade ? Number(savedGrade) : null);
      setMode("dashboard");
    }
  }, []);

  // Check for existing admin session on app load
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin) {
      setMode("admin");
    }
  }, []);

  const handleLoginSuccess = (username: string, grade: number | null) => {
    setCurrentUser(username);
    setCurrentGrade(grade);
    setMode("dashboard");
    localStorage.setItem("currentUser", username);
    if (grade !== null && grade !== undefined) {
      localStorage.setItem("currentGrade", String(grade));
    } else {
      localStorage.removeItem("currentGrade");
    }
  };

  const handleAdminLoginSuccess = (success: boolean) => {
    if (success) {
      setMode("admin");
    } else {
      setMode("login");
    }
  };

  const handleLogout = () => {
    setCurrentUser("");
    setCurrentGrade(null);
    setMode("login");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentGrade");
    localStorage.removeItem("currentQuiz");
    localStorage.removeItem("selectedModule");
    localStorage.removeItem("isAdmin");
  };

  const handleAdminLogout = () => {
    setMode("login");
    localStorage.removeItem("isAdmin");
  };

  // If in dashboard mode, render dashboard
  if (mode === "dashboard") {
    return (
      <Dashboard
        username={currentUser}
        grade={currentGrade}
        onLogout={handleLogout}
      />
    );
  }

  // If in admin mode, render admin dashboard
  if (mode === "admin") {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ET617 Learning Platform</h1>
        <p>{mode === "login" ? "Welcome back! Please login to continue" : mode === "register" ? "Create your account to get started" : "Admin Panel Access"}</p>
        {mode !== "adminLogin" && (
          <div className="mode-switcher">
            <button onClick={() => setMode("login")}>Login</button>
            <button onClick={() => setMode("register")}>Register</button>
            {mode !== "login" && <button onClick={() => setMode("adminLogin")}>Admin Login</button>}
          </div>
        )}
      </header>

      <main className="App-main">
        {mode === "login" && (
          <div>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
            <div className="admin-access">
              <button onClick={() => setMode("adminLogin")}>Admin Login</button>
            </div>
          </div>
        )}
        {mode === "register" && (
          <RegisterForm onSwitchToLogin={() => setMode("login")} />
        )}
        {mode === "adminLogin" && (
          <AdminLogin onAdminLogin={handleAdminLoginSuccess} />
        )}
      </main>
    </div>
  );
};

export default App;
