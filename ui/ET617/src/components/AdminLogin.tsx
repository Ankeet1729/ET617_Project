import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface AdminLoginProps {
  onAdminLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Admin login successful — redirecting...");
        localStorage.setItem("isAdmin", "true");
        setTimeout(() => onAdminLogin(true), 700);
      } else {
        setMessageType("error");
        setMessage(data?.error || "Login failed");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 480,
      margin: "0 auto",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      padding: "1.25rem",
      borderRadius: 12,
      boxShadow: "0 10px 30px rgba(2,6,23,0.06)"
    }}>
      <h2 style={{ margin: 0, marginBottom: 8, color: "var(--text-primary)" }}>Admin Panel</h2>
      <p style={{ marginTop: 0, marginBottom: 12, color: "var(--text-secondary)" }}>Restricted access for administrators.</p>

      <form onSubmit={handleSubmit} aria-label="Admin login form">
        <div className="form-group">
          <label htmlFor="admin-user">Username</label>
          <input
            id="admin-user"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="root"
            required
            disabled={isLoading}
            className="form-input"
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin"
            required
            disabled={isLoading}
            className="form-input"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>

      {message && (
        <div
          className={`message ${messageType}`}
          role={messageType === "error" ? "alert" : "status"}
          style={{
            marginTop: 12,
            backgroundColor: messageType === "error" ? "rgba(254, 226, 226, 0.85)" : "rgba(220, 252, 231, 0.9)",
            color: messageType === "error" ? "var(--error)" : "var(--success)",
            border: `1px solid ${messageType === "error" ? "rgba(239,68,68,0.12)" : "rgba(6,95,70,0.06)"}`
          }}
        >
          {message}
        </div>
      )}

      <p style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: 13 }}>Default: <strong>root</strong> / <strong>admin</strong></p>
    </div>
  );
};

export default AdminLogin;
