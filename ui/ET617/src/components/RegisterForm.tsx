import React, { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password, grade }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          onSwitchToLogin();
        }, 1200);
      } else {
        setMessageType("error");
        setMessage(data?.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" aria-label="Create account form">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          className="form-input"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          className="form-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password <small style={{ color: "var(--text-secondary)", fontWeight: 500, marginLeft: 6 }}>(min 6 chars)</small></label>
        <input
          id="password"
          type="password"
          className="form-input"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label htmlFor="grade">Grade Level</label>
        <select
          id="grade"
          className="form-select"
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value))}
          required
          disabled={isLoading}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
            <option key={g} value={g}>
              Grade {g}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </button>

      <div className="form-footer" style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
        <button type="button" className="secondary" onClick={onSwitchToLogin} style={{ padding: "8px 12px" }}>
          Back to Login
        </button>
      </div>

      {message && (
        <div
          className={`message ${messageType}`}
          role={messageType === "error" ? "alert" : "status"}
          style={{
            marginTop: "0.75rem",
            backgroundColor: messageType === "error" ? "rgba(254, 226, 226, 0.85)" : "rgba(220, 252, 231, 0.9)",
            color: messageType === "error" ? "var(--error)" : "var(--success)",
            border: `1px solid ${messageType === "error" ? "rgba(239,68,68,0.12)" : "rgba(6,95,70,0.06)"}`,
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
