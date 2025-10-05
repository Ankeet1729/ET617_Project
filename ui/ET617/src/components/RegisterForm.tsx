// import React, { useState } from "react";

// const RegisterForm: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [grade, setGrade] = useState(1);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:5000/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: name, email, password, grade }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage("Registration successful!");
//       } else {
//         setMessage(`Registration failed: ${data.error || "Unknown error"}`);
//       }
//     } catch (err) {
//       setMessage("Error connecting to server");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Register</h2>
//       <input
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <label>
//         Grade:
//         <select
//           value={grade}
//           onChange={(e) => setGrade(Number(e.target.value))}
//           required
//         >
//           {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
//             <option key={g} value={g}>
//               {g}
//             </option>
//           ))}
//         </select>
//       </label>
//       <button type="submit">Register</button>
//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// export default RegisterForm;
import React, { useState } from "react";

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
      const res = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password, grade }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType("success");
        setMessage("Registration successful! You can now login.");
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setMessageType("error");
        setMessage(data.error || "Registration failed. Please try again.");
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
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
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
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default RegisterForm;