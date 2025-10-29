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

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedGrade = localStorage.getItem("currentGrade");
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentGrade(savedGrade ? Number(savedGrade) : null);
      setMode("dashboard");
    }
  }, []);

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

  if (mode === "dashboard") {
    return (
      <Dashboard
        username={currentUser}
        grade={currentGrade}
        onLogout={handleLogout}
      />
    );
  }

  if (mode === "admin") {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="App">
      <header className="App-header container" role="banner">
        <div className="left">
          <h1>ET617 Learning Platform</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {mode === "login" ? "Welcome back! Please login to continue" : mode === "register" ? "Create your account to get started" : "Admin Panel Access"}
          </p>
        </div>

        <div className="right" aria-hidden={mode === "admin"}>
          <button className="secondary" onClick={() => setMode("login")}>Login</button>
          <button className="secondary" onClick={() => setMode("register")}>Register</button>
          {mode !== "login" && <button className="secondary" onClick={() => setMode("adminLogin")}>Admin Login</button>}
        </div>
      </header>

      <main className="container auth-container" role="main">
        <div className="auth-wrapper" aria-live="polite">
          <div className="auth-header">
            <div className="auth-title"> {mode === "login" ? "Student Login" : mode === "register" ? "Create account" : "Admin Login"} </div>
            <div className="auth-subtitle">Access quizzes, track progress and more.</div>
          </div>

          <div className="auth-form-container">
            {mode === "login" && (
              <>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
                <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "center" }}>
                  <button className="secondary" onClick={() => setMode("adminLogin")}>Admin Login</button>
                </div>
              </>
            )}
            {mode === "register" && (
              <RegisterForm onSwitchToLogin={() => setMode("login")} />
            )}
            {mode === "adminLogin" && (
              <AdminLogin onAdminLogin={handleAdminLoginSuccess} />
            )}
          </div>
        </div>

        {/* Optional side panel for wider screens - can be used for tips, logos, or images */}
        <aside className="auth-side" aria-hidden>
          <h2>Welcome</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Complete small quizzes to improve your score. The interface is optimized for readability and mobile devices.
          </p>
        </aside>
      </main>
    </div>
  );
};

export default App;
