"use client";
import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { mapAuthError } from "../util";
import { useRouter } from "next/navigation";

// Define the type for the context
type AuthContextType = {
  user: string | null;
  loginWithEmailAndPass: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPass: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

// Default values for the context
const authContextDefaultValues: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  loginWithEmailAndPass: async () => {},
  logout: () => {},
  signUpWithEmailAndPass: async () => {},
};

// Create the context
const AuthContext = createContext<AuthContextType>(authContextDefaultValues);

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to handle login with email and password
  const loginWithEmailAndPass = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;
      setUser(loggedInUser ? loggedInUser.email : null);
    } catch (error: any) {
      const errorCode = error.code;
      console.log(errorCode);
      const errorMessage = mapAuthError(errorCode);
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle sign-up with email and password
  const signUpWithEmailAndPass = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedInUser = userCredential.user;
      setUser(loggedInUser ? loggedInUser.email : null);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = mapAuthError(errorCode);
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        alert("Sign-out successfully!");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  // Provide the user state and the login/logout etc functions to the context
  const value: AuthContextType = {
    user,
    loginWithEmailAndPass,
    signUpWithEmailAndPass,
    logout,
    loading,
    error,
  };

  // Initialize Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("run");
      setUser(user ? user.email : null);
    });

    if (user) {
      router.push("/");
    } else {
      router.push("/login");
    }
    return () => unsubscribe(); // Cleanup on unmount
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
