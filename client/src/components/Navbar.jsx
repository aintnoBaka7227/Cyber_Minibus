import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, TicketPlus, XIcon, LogOut, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAppContext();

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
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
        >
          Home
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/routes"
        >
          Routes
        </Link>
        <Link
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/about-us"
        >
          About Us
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {!isAuthenticated ? (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-black"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-1 sm:px-7 sm:py-2 border border-primary text-primary hover:bg-primary hover:text-black transition rounded-full font-medium cursor-pointer"
            >
              Register
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-gray-300/20 hover:bg-white/20 transition"
            >
              <img 
                src={user?.image || "/src/assets/profile.png"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{user?.username || user?.firstName || "User"}</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    navigate("/my-profile");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800 flex items-center gap-2"
                >
                  <User width={15} />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/my-bookings");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800 flex items-center gap-2"
                >
                  <TicketPlus width={15} />
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800 flex items-center gap-2"
                >
                  <LogOut width={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <MenuIcon
        onClick={() => setIsOpen(!isOpen)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  );
};

export default Navbar;
