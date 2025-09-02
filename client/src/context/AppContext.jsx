import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(true); // Set to true for admin access without auth
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // Use Clerk hooks but provide fallbacks
  const { user } = useUser() || {};
  const { getToken } = useAuth() || {};
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  const navigate = useNavigate();

  // Create a fallback user for admin panel
  const fallbackUser = {
    id: "admin-temp",
    firstName: "Admin",
    lastName: "User",
    imageUrl: "/src/assets/profile.png"
  };

  const fetchIsAdmin = async () => {
    // For now, bypass the API call and set admin to true
    setIsAdmin(true);
    
    /* Commented out original logic - uncomment when custom auth is ready
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.error(error);
    }
    */
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");

      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFavoriteMovies = async () => {
    // Bypass favorite movies for now
    setFavoriteMovies([]);
    
    /* Commented out original logic - uncomment when custom auth is ready
    try {
      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
    */
  };
  useEffect(() => {
    fetchShows();
    // Initialize admin access and empty favorites for non-auth mode
    fetchIsAdmin();
    fetchFavoriteMovies();
  }, []);
}
  // Remove the user-dependent useEffect for now
  /* Commented out - uncomment when custom auth is ready
  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [user]);
  */

  const value = {
    axios,
    fetchIsAdmin,
    user: user || fallbackUser, // Use fallback user if no Clerk user
    getToken: getToken || (() => Promise.resolve(null)), // Provide fallback getToken
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
