import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  // const MOCK_AUTH = import.meta.env.VITE_ENABLE_MOCK_AUTH === "true";

   
  const location = useLocation();
  const navigate = useNavigate(); 

  // simple auth with login
  // eslint-disable-next-line no-unused-vars
  // const login = async (email, _password) => {
  //   if (!MOCK_AUTH) {
  //     toast.error("Mock auth disabled. No server connected.");
  //     return false;
  //   }
  //   const mockUser = {
  //     _id: "dev-user-1",
  //     username: email?.split("@")[0] || "devuser",
  //     firstName: "Dev",
  //     lastName: "User",
  //     email: email || "dev@example.com",
  //     role: "client", // change to "client" if you prefer
  //     image: "/src/assets/profile.png",
  //   };
  //   setUser(mockUser);
  //   setIsAuthenticated(true);
  //   setIsAdmin(mockUser.role === "client");
  //   localStorage.setItem("mock_user", JSON.stringify(mockUser));
  //   toast.success("Logged in (mock)");
  //   return true;
  // };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password }, { withCredentials: true })
      console.log(data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === "admin");
      toast.success("logged in");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "login failed");
      return false;
    }
  };

  // // logout
  // const logout = () => {
  //   if (MOCK_AUTH) {
  //     localStorage.removeItem("mock_user");
  //   }
  //   setUser(null);
  //   setIsAuthenticated(false);
  //   setIsAdmin(false);
  //   toast.success("Logged out");
  //   // Ensure we leave any protected/admin routes
  //   try {
  //     navigate("/");
  //   // eslint-disable-next-line no-unused-vars, no-empty
  //   } catch (_e) {}
  // };

  // logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, {withCredentials: true});
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.success("logged out");
      navigate("/");
    } catch(error) {
      toast.error("logout issue");
    }
  };

  // register
  // const register = async (userData) => {
  //   if (!MOCK_AUTH) {
  //     toast.error("Mock auth disabled. No server connected.");
  //     return false;
  //   }
  //   const mockUser = {
  //     _id: "dev-user-1",
  //     username: userData?.username || "devuser",
  //     firstName: userData?.firstName || "Dev",
  //     lastName: userData?.lastName || "User",
  //     email: userData?.email || "dev@example.com",
  //     role: "client",
  //     image: "/src/assets/profile.png",
  //   };
  //   setUser(mockUser);
  //   setIsAuthenticated(true);
  //   setIsAdmin(mockUser.role === "client");
  //   localStorage.setItem("mock_user", JSON.stringify(mockUser));
  //   toast.success("Registered (mock)");
  //   return true;
  // };

  // register
  const register = async({ email, username, password }) => {
    try {
      const { data } = await api.post("/auth/register", { username, email, password }, {withCredentials: true});
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === "admin");
      toast.success("registered");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "register fail");
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.post("/auth/me", { withCredentials: true });
        setUser(data.user);
        setIsAuthenticated(true);
        setIsAdmin(data.user.role === "admin");
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    fetchMe();
  }, []);

  const value = {
    api,
    navigate,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    register,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
