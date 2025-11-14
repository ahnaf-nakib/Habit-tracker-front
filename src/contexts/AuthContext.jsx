import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../firebaseconfig';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  },[]);

  const getToken = async () => {
    if(!auth.currentUser) return null;
    return await getIdToken(auth.currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
