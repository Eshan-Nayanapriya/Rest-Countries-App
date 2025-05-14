import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authApi } from "../services/authApi";
import { removeFromStorage, STORAGE_KEYS } from "../utils/storage";

/**
 * Context for authentication state and operations
 */
const AuthContext = createContext(null);

/**
 * Custom hook to access the auth context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Provider component for authentication state
 * Manages user login state, token persistence, and auth operations
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load user data from API if they have a valid session
   */
  const loadUser = useCallback(async () => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.me();
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      console.error("Error loading user:", err);
      // Clear invalid token
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, check if user is logged in
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Login with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Login response
   */ const login = async (email, password) => {
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      setUser(res.data.user);

      // Clear any existing cached favorites since we're logging in
      removeFromStorage(STORAGE_KEYS.FAVORITE_COUNTRIES);

      return res;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Registration response
   */ const register = async (username, email, password) => {
    setError(null);
    try {
      const res = await authApi.register({ username, email, password });
      setUser(res.data.user);

      // Clear any existing cached favorites since we're registering a new user
      removeFromStorage(STORAGE_KEYS.FAVORITE_COUNTRIES);

      return res;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Logout the current user
   */ const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Error during logout:", err);
      // Continue with logout even if API call fails
    } finally {
      // Remove auth token
      removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
      // Clear favorites cache on logout
      removeFromStorage(STORAGE_KEYS.FAVORITE_COUNTRIES);
      setUser(null);
      setError(null);
    }
  };

  /**
   * Update user data in the context
   * @param {Object} updatedUser - Updated user object
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setUser: updateUser,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
