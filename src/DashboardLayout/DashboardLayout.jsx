import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { theme, toggleTheme } = useTheme(); 

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    },
    {
      name: 'Invoice',
      path: '/dashboard/invoice',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
    {
      name: 'Quotation',
      path: '/dashboard/quotation',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    },
    {
      name: 'Agreement',
      path: '/dashboard/agreement',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    },
    {
      name: 'Saved',
      path: '/dashboard/saved-documents',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
    } catch (error) {
       toast.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden w-full relative transition-colors duration-300">
      
      {/* Mobile er jonno Background Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* ========================================== */}
      {/* Sidebar - Ekhane responsive classes add kora hoyeche */}
      {/* ========================================== */}
      <aside
        className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out absolute md:relative h-full
        ${isExpanded ? 'w-64 translate-x-0' : 'w-64 md:w-20 -translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col mt-4">
          <nav className="flex flex-col gap-2 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={!isExpanded ? item.name : ""}
                  onClick={() => window.innerWidth < 768 && setIsExpanded(false)} // Mobile e link a click korle menu bondho hobe
                  className={`flex items-center rounded-lg transition-colors overflow-hidden
                    ${isExpanded ? 'px-4 py-3 justify-start' : 'px-4 md:p-3 justify-start md:justify-center py-3'}
                    ${isActive
                      ? 'bg-[#E3EAF7] dark:bg-blue-900/30 text-[#0A2647] dark:text-blue-400 font-semibold' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white'
                    }
                  `}
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                  <span
                    className={`ml-4 whitespace-nowrap transition-opacity duration-300
                      ${isExpanded ? 'opacity-100' : 'opacity-100 md:opacity-0 md:hidden'}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button onClick={handleLogout}
            title={!isExpanded ? "Logout" : ""}
            className={`w-full flex items-center text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors rounded-lg
              ${isExpanded ? 'px-4 py-3 justify-start' : 'px-4 md:p-3 justify-start md:justify-center py-3'}
            `}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-100 md:opacity-0 md:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* Top Header + Content */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 z-10 border-b border-gray-200 dark:border-gray-800 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer ml-1 sm:ml-2">
              <div className="w-8 h-8 bg-[#0A2647] dark:bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xl">D</div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight hidden sm:block">Docu<span className="text-blue-600 dark:text-blue-400">Craft</span></h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:scale-105 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{user?.name || 'Loading...'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
            </div>
            
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-gray-200 dark:bg-gray-800 rounded-full border-2 border-[#0A2647] dark:border-blue-500 overflow-hidden cursor-pointer shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0A2647&color=fff`}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;