// src/App.tsx
import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";

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
    // Save login state to localStorage
    localStorage.setItem("currentUser", username);
  };

  const handleLogout = () => {
    setCurrentUser("");
    setMode("login");
    // Clear login state from localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentQuiz");
    localStorage.removeItem("selectedModule");
  };

  if (mode === "dashboard") {
    return <Dashboard username={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div>
      <button onClick={() => setMode("login")}>Login</button>
      <button onClick={() => setMode("register")}>Register</button>
      {mode === "login" ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <RegisterForm />
      )}
    </div>
  );
};

export default App;
