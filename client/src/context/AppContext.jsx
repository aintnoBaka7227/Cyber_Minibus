import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Track initial auth loading
   
  const navigate = useNavigate(); 


  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password }, { withCredentials: true })
      console.log(data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === "admin");
      toast.success("logged in");
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "login failed");
      return null;
    }
  };

  
  // logout
  const logout = async () => {
    try {
      const { data } = await api.post("/auth/logout", {}, {withCredentials: true});
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      toast.success(data.message);
      navigate("/");
    } catch(error) {
      console.log(error);
      toast.error("logout issue");
    }
  };

  // register
  const register = async({ email, username, password }) => {
    try {
      const { data } = await api.post("/auth/register", { email, username, password, role: "client" }, {withCredentials: true});
      setUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.role === "admin");
      toast.success("registered");
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || "register fail");
      return null;
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/auth/me", { withCredentials: true });
        setUser(data.user);
        setIsAuthenticated(true);
        setIsAdmin(data.user.role === "admin");
        console.log(data);
      } catch (error) {
        console.log(error);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoadingAuth(false); // Auth check complete
      }
    };
    fetchMe();
  }, []);

  const value = {
    api,
    user,
    isAuthenticated,
    isAdmin,
    isLoadingAuth,
    navigate,
    login,
    logout,
    register,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
