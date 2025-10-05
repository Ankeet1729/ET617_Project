// import React, { useState } from "react";

// interface LoginFormProps {
//   onLoginSuccess: (username: string) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: username, password }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Login successful!");
//         // Call the callback to navigate to dashboard
//         onLoginSuccess(username);
//       } else {
//         setMessage(`Login failed: ${data.error || "Unknown error"}`);
//       }
//     } catch (err) {
//       setMessage("Error connecting to server");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Login</h2>
//       <input
//         type="username"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">Login</button>
//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// export default LoginForm;
import React, { useState } from "react";

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
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
      const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          onLoginSuccess(username);
        }, 1000);
      } else {
        setMessageType("error");
        setMessage(data.error || "Invalid username or password");
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
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
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default LoginForm;