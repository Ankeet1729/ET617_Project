// import React, { useState } from "react";

// interface LoginFormProps {
//   onLoginSuccess: (username: string, grade: number | null) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState<"success" | "error">("success");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessageType("success");
//         setMessage("Login successful! Redirecting...");
//         setTimeout(() => {
//           onLoginSuccess(data?.user?.username ?? username, (data?.user?.grade ?? null) as number | null);
//         }, 1000);
//       } else {
//         setMessageType("error");
//         setMessage(data.error || "Invalid username or password");
//       }
//     } catch (err) {
//       setMessageType("error");
//       setMessage("Unable to connect to server. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="auth-form">
//       <div className="form-group">
//         <label htmlFor="username">Username</label>
//         <input
//           id="username"
//           type="text"
//           className="form-input"
//           placeholder="Enter your username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//           disabled={isLoading}
//         />
//       </div>

//       <div className="form-group">
//         <label htmlFor="password">Password</label>
//         <input
//           id="password"
//           type="password"
//           className="form-input"
//           placeholder="Enter your password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           disabled={isLoading}
//         />
//       </div>

//       <button type="submit" className="submit-button" disabled={isLoading}>
//         {isLoading ? "Logging in..." : "Login"}
//       </button>

//       {message && (
//         <div className={`message ${messageType}`}>
//           {message}
//         </div>
//       )}
//     </form>
//   );
// };

// export default LoginForm;
import React, { useState } from "react";

interface LoginFormProps {
  onLoginSuccess: (username: string, grade: number | null) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Login successful — redirecting...");
        setTimeout(() => {
          onLoginSuccess(data?.user?.username ?? username, (data?.user?.grade ?? null) as number | null);
        }, 700);
      } else {
        setMessageType("error");
        setMessage(data?.error || "Invalid username or password");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" aria-label="Student login form">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="form-input"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="username"
          aria-required
        />
      </div>

      <div className="form-group" style={{ position: "relative" }}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="current-password"
          aria-required
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((s) => !s)}
          style={{
            position: "absolute",
            right: 10,
            top: 36,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            fontSize: 13,
            padding: "4px 6px",
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading || username.trim() === "" || password.trim() === ""}
        aria-busy={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <div
          className={`message ${messageType}`}
          role={messageType === "error" ? "alert" : "status"}
          style={{
            marginTop: "0.75rem",
            backgroundColor: messageType === "error" ? "rgba(254, 226, 226, 0.8)" : "rgba(220, 252, 231, 0.85)",
            color: messageType === "error" ? "var(--error)" : "var(--success)",
            border: `1px solid ${messageType === "error" ? "rgba(239,68,68,0.2)" : "rgba(6,95,70,0.08)"}`,
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default LoginForm;
