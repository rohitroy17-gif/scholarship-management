import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase.config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "firebase/auth";
//authprovder
export const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Create new user
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login existing user
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Google login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setLoading(false);
      return result.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return null;
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      setUser({ ...auth.currentUser }); // Update local state
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        createUser,
        loginUser,
        googleLogin,
        updateUserProfile,
        logOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuthContext = () => useContext(AuthContext);

