import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Set to true for admin access without auth
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [destinations, setDestinations] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [tripInstances, setTripInstances] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
  const MOCK_AUTH = import.meta.env.VITE_ENABLE_MOCK_AUTH === "true";

   
  const location = useLocation();
  const navigate = useNavigate(); 

  // simple auth with login
  // eslint-disable-next-line no-unused-vars
  const login = async (email, _password) => {
    if (!MOCK_AUTH) {
      toast.error("Mock auth disabled. No server connected.");
      return false;
    }
    const mockUser = {
      _id: "dev-user-1",
      username: email?.split("@")[0] || "devuser",
      firstName: "Dev",
      lastName: "User",
      email: email || "dev@example.com",
      role: "client", // change to "client" if you prefer
      image: "/src/assets/profile.png",
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsAdmin(mockUser.role === "client");
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    toast.success("Logged in (mock)");
    return true;
  };

  // logout
  const logout = () => {
    if (MOCK_AUTH) {
      localStorage.removeItem("mock_user");
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast.success("Logged out");
    // Ensure we leave any protected/admin routes
    try {
      navigate("/");
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (_e) {}
  };

  // register
  const register = async (userData) => {
    if (!MOCK_AUTH) {
      toast.error("Mock auth disabled. No server connected.");
      return false;
    }
    const mockUser = {
      _id: "dev-user-1",
      username: userData?.username || "devuser",
      firstName: userData?.firstName || "Dev",
      lastName: userData?.lastName || "User",
      email: userData?.email || "dev@example.com",
      role: "client",
      image: "/src/assets/profile.png",
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setIsAdmin(mockUser.role === "client");
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    toast.success("Registered (mock)");
    return true;
  };

  const getToken = async () => {
    if (MOCK_AUTH) return "mock-token";
    return "";
  };

  const fetchIsAdmin = async () => {
    if (MOCK_AUTH) {
      let admin = false;
      try {
        const raw = localStorage.getItem("mock_user");
        if (raw) {
          admin = JSON.parse(raw)?.role === "client";
        } else if (user) {
          admin = user?.role === "client";
        }
      // eslint-disable-next-line no-unused-vars
      } catch (_e) {
        admin = false;
      }
      setIsAdmin(admin);
      if (!admin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
      return admin;
    }

    try {
      const { data } = await axios.get("/api/admin/is-admin");
      const admin = Boolean(data?.isAdmin);
      setIsAdmin(admin);
      if (!admin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
      return admin;
    } catch (error) {
      console.error(error);
      const admin = user?.role === "client";
      setIsAdmin(Boolean(admin));
      if (!admin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
      return Boolean(admin);
    }
  };
  
    

  const value = {
    axios,
    navigate,
    user,
    isAuthenticated,
    isAdmin,
    getToken,
    fetchIsAdmin,
    login,
    logout,
    register,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
