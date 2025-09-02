import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [tripInstances, setTripInstances] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  const navigate = useNavigate();

  // Simple authentication functions
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success("Login successful!");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully!");
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post("/api/auth/register", userData);
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success("Registration successful!");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error("Registration failed");
      return false;
    }
  };

  // Initialize authentication from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Verify token and get user data
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const { data } = await axios.get("/api/auth/verify");
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        setIsAdmin(data.user.role === "admin");
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const fetchIsAdmin = async () => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/admin/is-admin");
      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.error(error);
      setIsAdmin(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const { data } = await axios.get("/api/destinations");

      if (data.success) {
        setDestinations(data.destinations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTripInstances = async () => {
    try {
      const { data } = await axios.get("/api/trip-instances");

      if (data.success) {
        setTripInstances(data.tripInstances);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Note: Removed movie favorites functionality as it's not relevant for minibus bookings
  useEffect(() => {
    fetchDestinations();
    fetchTripInstances();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchIsAdmin();
    }
  }, [isAuthenticated, user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    navigate,
    isAdmin,
    destinations,
    tripInstances,
    fetchDestinations,
    fetchTripInstances,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
