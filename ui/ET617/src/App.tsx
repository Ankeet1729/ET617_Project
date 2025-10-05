import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import "./App.css";

const App: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register" | "dashboard">("login");
  const [currentUser, setCurrentUser] = useState<string>("");

  // Check for existing login session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setMode("dashboard");
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setMode("dashboard");
    localStorage.setItem("currentUser", username);
  };

  const handleLogout = () => {
    setCurrentUser("");
    setMode("login");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentQuiz");
    localStorage.removeItem("selectedModule");
  };

  if (mode === "dashboard") {
    return <Dashboard username={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1 className="auth-title">ET617 Learning Platform</h1>
          <p className="auth-subtitle">
            {mode === "login" 
              ? "Welcome back! Please login to continue" 
              : "Create your account to get started"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <div className="auth-form-container">
          {mode === "login" ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;