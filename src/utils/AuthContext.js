// src/utils/AuthContext.js
import React, { useContext, useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      console.error('Logout error', err);
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Auth state change error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* ✅ Wait until Firebase auth is done */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
