import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { logEvent } from "../utils/clickLogger";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setCurrentUser } = useAuth();

  useEffect(() => {
    logEvent("anonymous", "page_view", { page: "login", path: window.location.pathname });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    logEvent("anonymous", "login_attempt", { email, status: "started" });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      logEvent(userCredential.user.uid, "login_attempt", { email, status: "success" });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed. Please check your credentials.");
      setLoading(false);
      logEvent("anonymous", "login_attempt", { email, status: "failure", error: err?.message });
    }
  };

  const handleSignupClick = () => {
    logEvent("anonymous", "link_click", { target: "/register", label: "Sign up here" });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-900 px-4">
      
      {/* Left side image card */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://play-lh.googleusercontent.com/Ip0nzZ3nBnGOlTrVo39M1i2LtXldaIbW3EzplBSmQXsc_DuPWfxJbj1Mn6wuNYCZAf4"
            alt="CodeMitra"
            className="w-full h-full object-contain p-2"
          />
          {/* subtle overlay for contrast */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      {/* Right side login form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h2>

          {error && (
            <div className="mb-4 text-sm text-red-300 bg-red-900/20 p-3 rounded">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-md transition ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 font-semibold hover:underline"
              onClick={handleSignupClick}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
