import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { logEvent } from '../utils/clickLogger';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Log page_view event on mount
  useEffect(() => {
    logEvent('anonymous', 'page_view', { page: 'register', path: window.location.pathname });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Log registration attempt started
    logEvent('anonymous', 'register_attempt', { email, status: 'started' });
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Log registration success
      logEvent(userCredential.user.uid, 'register_attempt', { email, status: 'success' });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      
      // Log registration failure
      logEvent('anonymous', 'register_attempt', { email, status: 'failure', error: err.message });
    }
  };

  const handleLoginLinkClick = () => {
    logEvent('anonymous', 'link_click', { target: '/login', label: 'Login here' });
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl mb-4 text-black">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mb-2 text-black"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="border p-2 w-full mb-2 text-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 w-full hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-sm text-black">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-500 hover:underline"
          onClick={handleLoginLinkClick}
        >
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Register;
