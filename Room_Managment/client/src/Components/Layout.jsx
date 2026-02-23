// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';

// const Layout = () => {
//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       <Sidebar />
//       <main className="flex-1 lg:ml-64 p-8 transition-all duration-300">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;


// import React, { useState, useEffect } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import Sidebar from './Sidebar';

// const Layout = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     checkLoginStatus();

//     const handleStorageChange = () => {
//       checkLoginStatus();
//     };
//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   const checkLoginStatus = () => {
//     const token = Cookies.get('token');
//     const user = Cookies.get('user');
//     const loggedIn = !!(token && user);
//     setIsLoggedIn(loggedIn);
//   };

//   return (
//     <div className="flex min-h-screen bg-slate-50">
//       {/* Only render Sidebar if user is logged in */}
//       {isLoggedIn && <Sidebar />}

//       {/* Adjust main content margin based on login status */}
//       <main className={`flex-1 p-8 transition-all duration-300 ${isLoggedIn ? 'lg:ml-64' : ''
//         }`}>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      const wasLoggedIn = isLoggedIn;
      checkLoginStatus();

      // Show welcome message when user logs in
      if (!wasLoggedIn && isLoggedIn) {
        setShowWelcomeMessage(true);
        setTimeout(() => setShowWelcomeMessage(false), 3000);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedIn]);

  const checkLoginStatus = () => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    const loggedIn = !!(token && user);
    setIsLoggedIn(loggedIn);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-red-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Yellow gradient orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
        />

        {/* Red gradient orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
        />

      </div>

      {/* Welcome message toast */}
      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
          >
            <span className="material-icons text-white">waving_hand</span>
            <div>
              <p className="font-semibold">Welcome back!</p>
              <p className="text-sm text-yellow-100">You're now logged in</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      {isLoggedIn && <Sidebar />}

      {/* Main Content */}
      <main
        className={`relative min-h-screen transition-all duration-300 ${isLoggedIn ? 'lg:ml-64' : ''
          }`}
      >
        {/* Content container with glass morphism effect */}
        <div className="relative z-10 p-4 md:p-8">
          {/* Optional: Page header indicator */}
          {!isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center md:text-left"
            >
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                Welcome to RoomFinder
              </h1>
              <p className="text-gray-600 mt-1">Find your perfect stay</p>
            </motion.div>
          )}

          {/* Outlet with fade animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Outlet />
          </motion.div>

          {/* Decorative footer pattern */}
          <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-red-500 opacity-20 pointer-events-none"></div>
        </div>
      </main>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(0);
          }
          33% {
            transform: translate(30px, -30px) scale(0.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.1);
          }
        }
        
        .animate-blob {
          animation: blob 15s infinite ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #EAB308;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #EF4444;
        }
        
        /* Glass morphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #EAB308 0%, #EF4444 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default Layout;