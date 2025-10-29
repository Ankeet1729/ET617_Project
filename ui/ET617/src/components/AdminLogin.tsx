// import React, { useState } from "react";

// interface AdminLoginProps {
//   onAdminLogin: (success: boolean) => void;
// }

// const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin }) => {
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
//       const res = await fetch("http://localhost:5000/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessageType("success");
//         setMessage("Admin login successful! Redirecting...");
//         localStorage.setItem("isAdmin", "true");
//         setTimeout(() => onAdminLogin(true), 1000);
//       } else {
//         setMessageType("error");
//         setMessage(data.error || "Login failed");
//       }
//     } catch (error) {
//       setMessageType("error");
//       setMessage("Server error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="admin-login-container">
//       <div className="login-card">
//         <h2>Admin Panel</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Username:</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="root"
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <div className="form-group">
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="admin"
//               required
//               disabled={isLoading}
//             />
//           </div>
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? "Logging in..." : "Login as Admin"}
//           </button>
//           {message && (
//             <div className={`message ${messageType}`}>
//               {message}
//             </div>
//           )}
//         </form>
//         <p className="hint">Default: root / admin</p>
//       </div>
//       <style jsx>{`
//         .admin-login-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//         }
//         .login-card {
//           background: white;
//           padding: 2rem;
//           border-radius: 10px;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//           width: 100%;
//           max-width: 400px;
//         }
//         .form-group {
//           margin-bottom: 1rem;
//         }
//         label {
//           display: block;
//           margin-bottom: 0.5rem;
//           font-weight: bold;
//           color: #333;
//         }
//         input {
//           width: 100%;
//           padding: 0.75rem;
//           border: 1px solid #ddd;
//           border-radius: 5px;
//           font-size: 1rem;
//         }
//         button {
//           width: 100%;
//           padding: 0.75rem;
//           background: #667eea;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           font-size: 1rem;
//           cursor: pointer;
//         }
//         button:disabled {
//           background: #ccc;
//           cursor: not-allowed;
//         }
//         .message {
//           margin-top: 1rem;
//           padding: 0.75rem;
//           border-radius: 5px;
//           text-align: center;
//         }
//         .message.success {
//           background: #d4edda;
//           color: #155724;
//         }
//         .message.error {
//           background: #f8d7da;
//           color: #721c24;
//         }
//         .hint {
//           text-align: center;
//           margin-top: 1rem;
//           color: #666;
//           font-size: 0.9rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AdminLogin;
import React, { useState } from "react";

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
      const res = await fetch("http://localhost:5000/admin/login", {
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
