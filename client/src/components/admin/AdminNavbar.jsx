import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { MenuIcon, ChevronDownIcon, UserIcon, LogOutIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, navigate } = useAppContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    try { 
      navigate("/"); 
    } catch (error) {
      // Ignore navigation errors
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-black/70 backdrop-blur">
      <Link to="/admin" className="max-md:flex-1">
        <img src={assets.logo} alt="logo" className="w-48 h-auto" />
      </Link>

      <div className="flex items-center gap-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleDropdownToggle}
            className="flex items-center gap-2 text-white hover:text-primary transition"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-white" />
            </div>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-50 transition-colors text-left"
              >
                <LogOutIcon className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      <MenuIcon
        onClick={() => setIsOpen(!isOpen)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  );
};

export default AdminNavbar;
