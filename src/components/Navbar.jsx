import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme(); // এখানে সরাসরি ইমপোর্ট করা হলো
const  { user } = useAuth(); 


  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("accessToken");
      setUser(null);
      navigate("/login");
    } catch (error) {
       toast.error(error);
    }
  };

    const handlePrimaryClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };


  // Scroll effect for Glassmorphism
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/70 backdrop-blur-md shadow-sm dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left Side: Logo */}
          <Link onClick={handlePrimaryClick} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xl">
              D
            </div>
            <span className="font-poppins font-bold text-xl text-gray-900 dark:text-white">
              Docu<span className="text-blue-600">Craft</span>
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-600 hover:text-[#2563EB] dark:text-gray-300 dark:hover:text-white font-inter text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side: Theme Toggle & Login Button */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:scale-105 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>

            {/* Login Button */}
            {
              user ? <button
                onClick={handleLogout}
                className="bg-[#2563EB] hover:bg-[#4F46E5] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shadow-blue-500/20 hover:-translate-y-0.5"
              >
                Logout
              </button> : <Link
                to="/login"
                className="bg-[#2563EB] hover:bg-[#4F46E5] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shadow-blue-500/20 hover:-translate-y-0.5"
              >
                Login
              </Link>
            }


          </div>

        </div>
      </div>
    </nav>
  );
}