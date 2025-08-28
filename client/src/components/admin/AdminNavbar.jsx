import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { MenuIcon, XIcon, ChevronDownIcon, UserIcon, LogOutIcon } from "lucide-react";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleMyProfile = () => {
    // TODO: Implement My Profile functionality
    console.log("My Profile clicked");
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
    setIsUserDropdownOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-black/70 backdrop-blur">
      <Link to="/admin" className="max-md:flex-1">
        <img src={assets.logo} alt="logo" className="w-48 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />

        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
          className="text-white hover:text-primary transition"
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/routes"
          className="text-white hover:text-primary transition"
        >
          Routes
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/about-us"
          className="text-white hover:text-primary transition"
        >
          About Us
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleDropdownToggle}
            className="flex items-center gap-2 text-white hover:text-primary transition"
          >
            <img
              src={assets.profile}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={handleMyProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-50 transition-colors text-left"
              >
                <UserIcon className="w-4 h-4" />
                My Profile
              </button>
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
