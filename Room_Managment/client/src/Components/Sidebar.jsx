
// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { motion, AnimatePresence } from 'framer-motion';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [user, setUser] = useState({});
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [expandedMenus, setExpandedMenus] = useState({});

//   useEffect(() => {
//     const token = Cookies.get('token');
//     const userData = Cookies.get('user');
    
//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         setIsLoggedIn(false);
//       }
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setIsMobileOpen(false);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     Cookies.remove('token');
//     Cookies.remove('user');
//     setIsLoggedIn(false);
//     setUser({});
//     navigate('/login', { replace: true });
//   };

//   const toggleMenu = (menuName) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuName]: !prev[menuName]
//     }));
//   };

//   // Icon components for better performance
//   const Icons = {
//     Dashboard: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//       </svg>
//     ),
//     Bookings: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//       </svg>
//     ),
//     ActiveBookings: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     History: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     Profile: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//       </svg>
//     ),
//     MyRooms: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//       </svg>
//     ),
//     AllUsers: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//       </svg>
//     ),
//     AllOwners: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//       </svg>
//     ),
//     Login: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//       </svg>
//     ),
//     Logout: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//       </svg>
//     ),
//   };

//   // Navigation items configuration
//   const navigationConfig = {
//     guest: [
//       { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
//     ],
//     common: [
//       { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard, roles: ['user', 'owner', 'admin'] },
//       { name: 'Bookings', path: '/bookings', icon: Icons.Bookings, roles: ['user', 'owner', 'admin'] },
//       { name: 'Active Bookings', path: '/active-bookings', icon: Icons.ActiveBookings, roles: ['user', 'owner', 'admin'] },
//       { name: 'History', path: '/history', icon: Icons.History, roles: ['user', 'owner', 'admin'] },
//       { name: 'Profile', path: '/profile', icon: Icons.Profile, roles: ['user', 'owner', 'admin'] },
//     ],
//     owner: [
//       { name: 'My Rooms', path: '/owner/rooms', icon: Icons.MyRooms, roles: ['owner', 'admin'] },
//     ],
//     admin: [
//       { name: 'All Users', path: '/admin/users', icon: Icons.AllUsers, roles: ['admin'] },
//       { name: 'All Owners', path: '/admin/owners', icon: Icons.AllOwners, roles: ['admin'] },
//     ],
//   };

//   const getFilteredItems = () => {
//     if (!isLoggedIn) {
//       return navigationConfig.guest;
//     }

//     const userRole = user.role;
//     let items = [];

//     items = items.concat(
//       navigationConfig.common.filter(item => item.roles.includes(userRole))
//     );

//     if (userRole === 'owner') {
//       items = items.concat(navigationConfig.owner);
//     }
//     if (userRole === 'admin') {
//       items = items.concat(navigationConfig.admin);
//     }

//     return items;
//   };

//   const getProfilePhotoUrl = () => {
//     return user.profilePhoto || null;
//   };

//   const sidebarVariants = {
//     open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
//     closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
//   };

//   const itemVariants = {
//     hover: { scale: 1.05, x: 5, transition: { type: "spring", stiffness: 400, damping: 10 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <>
//       {/* Mobile menu button with animation - Yellow to Tomato Red gradient */}
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </motion.button>

//       {/* Sidebar - Light theme with Black, Yellow, and Tomato Red */}
//       <AnimatePresence mode="wait">
//         {(isMobileOpen || window.innerWidth >= 1024) && (
//           <motion.div
//             initial="closed"
//             animate="open"
//             exit="closed"
//             variants={sidebarVariants}
//             onHoverStart={() => setIsHovered(true)}
//             onHoverEnd={() => setIsHovered(false)}
//             className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:shadow-xl overflow-hidden border-r border-gray-200"
//           >
//             {/* Decorative gradient orbs - Yellow and Tomato Red */}
//             <div className="absolute top-0 -left-20 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//             <div className="absolute top-0 -right-20 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
//             {/* User Info Section */}
//             <div className="relative p-6 border-b border-gray-200">
//               <div className="flex items-center space-x-4">
//                 {/* Profile Photo with advanced fallback - Yellow to Tomato Red gradient */}
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-500 to-red-500 flex-shrink-0 shadow-lg ring-2 ring-yellow-200"
//                 >
//                   {isLoggedIn && getProfilePhotoUrl() ? (
//                     <img
//                       src={getProfilePhotoUrl()}
//                       alt={user.name || 'User'}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.style.display = 'none';
//                         const parent = e.target.parentElement;
//                         if (parent) {
//                           parent.innerHTML = `
//                             <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-red-500">
//                               <span class="text-2xl font-bold text-white">${ user.name?.charAt(0).toUpperCase() || 'U'}</span>
//                             </div>
//                           `;
//                         }
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-red-500">
//                       <span className="text-2xl font-bold text-white">
//                         {isLoggedIn ? user.name?.charAt(0).toUpperCase() : 'G'}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Online status indicator - Tomato Red */}
//                   {isLoggedIn && (
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"
//                     />
//                   )}
//                 </motion.div>
                
//                 {/* User Info Text with animation - Black text */}
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="flex-1 min-w-0"
//                 >
//                   <h3 className="font-semibold text-gray-900 truncate text-lg">
//                     {isLoggedIn ? user.name || 'User' : 'Guest User'}
//                   </h3>
//                   <div className="flex items-center space-x-2">
//                     <span className={`inline-block w-2 h-2 rounded-full ${isLoggedIn ? 'bg-red-500' : 'bg-gray-400'} animate-pulse`}></span>
//                     <p className="text-xs text-gray-600 capitalize ml-1">
//                       {isLoggedIn ? user.role || 'User' : 'Not logged in'}
//                     </p>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Quick stats (only for logged in users) - commented out as in original */}
//               {isLoggedIn && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="mt-4 grid grid-cols-3 gap-2"
//                 >
//                   {/* Stats are commented out in original, keeping same */}
//                 </motion.div>
//               )}
//             </div>

//             {/* Navigation */}
//             <nav className="relative flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
//               <ul className="space-y-2">
//                 {getFilteredItems().map((item, index) => (
//                   <motion.li
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <NavLink
//                       to={item.path}
//                       className={({ isActive }) =>
//                         `relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
//                           isActive
//                             ? 'text-white'
//                             : 'text-gray-700 hover:text-gray-900'
//                         }`
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           {/* Active/Background indicator - Yellow to Tomato Red gradient */}
//                           {isActive && (
//                             <motion.div
//                               layoutId="activeNav"
//                               className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl shadow-lg"
//                               initial={false}
//                               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                             />
//                           )}
                          
//                           {/* Hover background - Light Yellow */}
//                           <div className="absolute inset-0 bg-yellow-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          
//                           {/* Icon with animation */}
//                           <motion.span
//                             whileHover="hover"
//                             whileTap="tap"
//                             variants={itemVariants}
//                             className={`relative z-10 flex-shrink-0 transition-transform group-hover:scale-110 ${
//                               isActive ? 'text-white' : 'text-gray-600 group-hover:text-red-500'
//                             }`}
//                           >
//                             <item.icon />
//                           </motion.span>
                          
//                           {/* Label */}
//                           <span className={`relative z-10 font-medium truncate ${
//                             isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
//                           }`}>
//                             {item.name}
//                           </span>

//                           {/* Notification badge - commented out as in original */}
//                         </>
//                       )}
//                     </NavLink>
//                   </motion.li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Login/Logout Button */}
//             <div className="relative p-4 border-t border-gray-200">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
//                 className={`flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-all duration-300 ${
//                   isLoggedIn
//                     ? 'text-gray-700 hover:text-red-500 hover:bg-red-50'
//                     : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
//                 }`}
//               >
//                 <span className="flex-shrink-0">
//                   {isLoggedIn ? <Icons.Logout /> : <Icons.Login />}
//                 </span>
//                 <span className="font-medium">
//                   {isLoggedIn ? 'Logout' : 'Login'}
//                 </span>
                
//                 {/* Tooltip on hover */}
//                 <motion.span
//                   initial={{ opacity: 0, x: 10 }}
//                   whileHover={{ opacity: 1, x: 0 }}
//                   className="absolute right-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md"
//                 >
//                   {isLoggedIn ? 'Sign out' : 'Sign in'}
//                 </motion.span>
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Overlay for mobile with blur effect */}
//       <AnimatePresence>
//         {isMobileOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 lg:hidden"
//             onClick={() => setIsMobileOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Custom scrollbar styles */}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 20px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #EAB308;
//           border-radius: 20px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #EF4444;
//         }

//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -30px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
        
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
        
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;










///////Final Perfect

// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { motion, AnimatePresence } from 'framer-motion';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(true);
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [user, setUser] = useState({});
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

//   // Handle window resize
//   useEffect(() => {
//     const handleResize = () => {
//       const desktop = window.innerWidth >= 1024;
//       setIsDesktop(desktop);
      
//       // When switching to desktop, close mobile menu if it was open
//       if (desktop && isMobileOpen) {
//         setIsMobileOpen(false);
//       }
      
//       // When switching to mobile, ensure desktop state is managed properly
//       if (!desktop) {
//         // Optional: close any desktop-specific states
//       }
//     };

//     window.addEventListener('resize', handleResize);
    
//     // Initial check
//     handleResize();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, [isMobileOpen]);

//   useEffect(() => {
//     const token = Cookies.get('token');
//     const userData = Cookies.get('user');
    
//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         setIsLoggedIn(false);
//       }
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setIsMobileOpen(false);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     Cookies.remove('token');
//     Cookies.remove('user');
//     setIsLoggedIn(false);
//     setUser({});
//     navigate('/login', { replace: true });
//   };

//   const toggleMenu = (menuName) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuName]: !prev[menuName]
//     }));
//   };

//   // Icon components for better performance
//   const Icons = {
//     Dashboard: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//       </svg>
//     ),
//     Bookings: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//       </svg>
//     ),
//     ActiveBookings: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     History: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     Profile: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//       </svg>
//     ),
//     MyRooms: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//       </svg>
//     ),
//     AllUsers: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//       </svg>
//     ),
//     AllOwners: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//       </svg>
//     ),
//     Login: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//       </svg>
//     ),
//     Logout: (props) => (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//       </svg>
//     ),
//   };

//   // Navigation items configuration
//   const navigationConfig = {
//     guest: [
//       { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
//     ],
//     common: [
//       { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard, roles: ['user', 'owner', 'admin'] },
//       { name: 'Bookings', path: '/bookings', icon: Icons.Bookings, roles: ['user', 'owner', 'admin'] },
//       { name: 'Active Bookings', path: '/active-bookings', icon: Icons.ActiveBookings, roles: ['user', 'owner', 'admin'] },
//       { name: 'History', path: '/history', icon: Icons.History, roles: ['user', 'owner', 'admin'] },
//       { name: 'Profile', path: '/profile', icon: Icons.Profile, roles: ['user', 'owner', 'admin'] },
//     ],
//     owner: [
//       { name: 'My Rooms', path: '/owner/rooms', icon: Icons.MyRooms, roles: ['owner', 'admin'] },
//     ],
//     admin: [
//       { name: 'All Users', path: '/admin/users', icon: Icons.AllUsers, roles: ['admin'] },
//       { name: 'All Owners', path: '/admin/owners', icon: Icons.AllOwners, roles: ['admin'] },
//     ],
//   };

//   const getFilteredItems = () => {
//     if (!isLoggedIn) {
//       return navigationConfig.guest;
//     }

//     const userRole = user.role;
//     let items = [];

//     items = items.concat(
//       navigationConfig.common.filter(item => item.roles.includes(userRole))
//     );

//     if (userRole === 'owner') {
//       items = items.concat(navigationConfig.owner);
//     }
//     if (userRole === 'admin') {
//       items = items.concat(navigationConfig.admin);
//     }

//     return items;
//   };

//   const getProfilePhotoUrl = () => {
//     return user.profilePhoto || null;
//   };

//   const sidebarVariants = {
//     open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
//     closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
//   };

//   const itemVariants = {
//     hover: { scale: 1.05, x: 5, transition: { type: "spring", stiffness: 400, damping: 10 } },
//     tap: { scale: 0.95 },
//   };

//   return (
//     <>
//       {/* Mobile menu button with animation - Only show on mobile */}
//       {!isDesktop && (
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsMobileOpen(!isMobileOpen)}
//           className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </motion.button>
//       )}

//       {/* Sidebar - Desktop always visible, mobile controlled by isMobileOpen */}
//       <AnimatePresence mode="wait">
//         {(isDesktop || isMobileOpen) && (
//           <motion.div
//             initial={isDesktop ? false : "closed"}
//             animate={isDesktop ? { x: 0 } : "open"}
//             exit="closed"
//             variants={!isDesktop ? sidebarVariants : {}}
//             onHoverStart={() => setIsHovered(true)}
//             onHoverEnd={() => setIsHovered(false)}
//             className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:shadow-xl overflow-hidden border-r border-gray-200 ${
//               isDesktop ? 'lg:translate-x-0' : ''
//             }`}
//           >
//             {/* Decorative gradient orbs - Yellow and Tomato Red */}
//             <div className="absolute top-0 -left-20 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//             <div className="absolute top-0 -right-20 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
//             {/* User Info Section */}
//             <div className="relative p-6 border-b border-gray-200">
//               <div className="flex items-center space-x-4">
//                 {/* Profile Photo with advanced fallback - Yellow to Tomato Red gradient */}
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: 5 }}
//                   className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-500 to-red-500 flex-shrink-0 shadow-lg ring-2 ring-yellow-200"
//                 >
//                   {isLoggedIn && getProfilePhotoUrl() ? (
//                     <img
//                       src={getProfilePhotoUrl()}
//                       alt={user.name || 'User'}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.style.display = 'none';
//                         const parent = e.target.parentElement;
//                         if (parent) {
//                           parent.innerHTML = `
//                             <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-red-500">
//                               <span class="text-2xl font-bold text-white">${user.name?.charAt(0).toUpperCase() || 'U'}</span>
//                             </div>
//                           `;
//                         }
//                       }}
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-red-500">
//                       <span className="text-2xl font-bold text-white">
//                         {isLoggedIn ? user.name?.charAt(0).toUpperCase() : 'G'}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Online status indicator - Tomato Red */}
//                   {isLoggedIn && (
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"
//                     />
//                   )}
//                 </motion.div>
                
//                 {/* User Info Text with animation - Black text */}
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="flex-1 min-w-0"
//                 >
//                   <h3 className="font-semibold text-gray-900 truncate text-lg">
//                     {isLoggedIn ? user.name || 'User' : 'Guest User'}
//                   </h3>
//                   <div className="flex items-center space-x-2">
//                     <span className={`inline-block w-2 h-2 rounded-full ${isLoggedIn ? 'bg-red-500' : 'bg-gray-400'} animate-pulse`}></span>
//                     <p className="text-xs text-gray-600 capitalize ml-1">
//                       {isLoggedIn ? user.role || 'User' : 'Not logged in'}
//                     </p>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Quick stats (only for logged in users) - commented out as in original */}
//               {isLoggedIn && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="mt-4 grid grid-cols-3 gap-2"
//                 >
//                   {/* Stats are commented out in original, keeping same */}
//                 </motion.div>
//               )}
//             </div>

//             {/* Navigation */}
//             <nav className="relative flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
//               <ul className="space-y-2">
//                 {getFilteredItems().map((item, index) => (
//                   <motion.li
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <NavLink
//                       to={item.path}
//                       className={({ isActive }) =>
//                         `relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
//                           isActive
//                             ? 'text-white'
//                             : 'text-gray-700 hover:text-gray-900'
//                         }`
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           {/* Active/Background indicator - Yellow to Tomato Red gradient */}
//                           {isActive && (
//                             <motion.div
//                               layoutId="activeNav"
//                               className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl shadow-lg"
//                               initial={false}
//                               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                             />
//                           )}
                          
//                           {/* Hover background - Light Yellow */}
//                           <div className="absolute inset-0 bg-yellow-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          
//                           {/* Icon with animation */}
//                           <motion.span
//                             whileHover="hover"
//                             whileTap="tap"
//                             variants={itemVariants}
//                             className={`relative z-10 flex-shrink-0 transition-transform group-hover:scale-110 ${
//                               isActive ? 'text-white' : 'text-gray-600 group-hover:text-red-500'
//                             }`}
//                           >
//                             <item.icon />
//                           </motion.span>
                          
//                           {/* Label */}
//                           <span className={`relative z-10 font-medium truncate ${
//                             isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
//                           }`}>
//                             {item.name}
//                           </span>

//                           {/* Notification badge - commented out as in original */}
//                         </>
//                       )}
//                     </NavLink>
//                   </motion.li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Login/Logout Button */}
//             <div className="relative p-4 border-t border-gray-200">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
//                 className={`flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-all duration-300 ${
//                   isLoggedIn
//                     ? 'text-gray-700 hover:text-red-500 hover:bg-red-50'
//                     : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
//                 }`}
//               >
//                 <span className="flex-shrink-0">
//                   {isLoggedIn ? <Icons.Logout /> : <Icons.Login />}
//                 </span>
//                 <span className="font-medium">
//                   {isLoggedIn ? 'Logout' : 'Login'}
//                 </span>
                
//                 {/* Tooltip on hover */}
//                 <motion.span
//                   initial={{ opacity: 0, x: 10 }}
//                   whileHover={{ opacity: 1, x: 0 }}
//                   className="absolute right-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md"
//                 >
//                   {isLoggedIn ? 'Sign out' : 'Sign in'}
//                 </motion.span>
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Overlay for mobile with blur effect - Only show on mobile when sidebar is open */}
//       <AnimatePresence>
//         {isMobileOpen && !isDesktop && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 lg:hidden z-30"
//             onClick={() => setIsMobileOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Custom scrollbar styles */}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 20px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #EAB308;
//           border-radius: 20px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #EF4444;
//         }

//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -30px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
        
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
        
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;











import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      if (desktop && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setIsLoggedIn(false);
    setUser({});
    navigate('/login', { replace: true });
  };

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Icon components for better performance
  const Icons = {
    Dashboard: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    Bookings: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    ActiveBookings: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    History: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Profile: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    MyRooms: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    AllUsers: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    AllOwners: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    // NEW: FAQ Icon
    FAQ: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Login: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
    Logout: (props) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  };

  // Navigation items configuration - ADDED FAQ
  const navigationConfig = {
    guest: [
      { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
    ],
    common: [
      { name: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard, roles: ['user', 'owner', 'admin'] },
      { name: 'Bookings', path: '/bookings', icon: Icons.Bookings, roles: ['user', 'owner', 'admin'] },
      { name: 'Active Bookings', path: '/active-bookings', icon: Icons.ActiveBookings, roles: ['user', 'owner', 'admin'] },
      { name: 'History', path: '/history', icon: Icons.History, roles: ['user', 'owner', 'admin'] },
      { name: 'FAQ', path: '/faq', icon: Icons.FAQ, roles: ['user', 'owner', 'admin'] },  // ← ADDED FAQ HERE
      { name: 'Profile', path: '/profile', icon: Icons.Profile, roles: ['user', 'owner', 'admin'] },
    ],
    owner: [
      { name: 'My Rooms', path: '/owner/rooms', icon: Icons.MyRooms, roles: ['owner', 'admin'] },
    ],
    admin: [
      { name: 'All Users', path: '/admin/users', icon: Icons.AllUsers, roles: ['admin'] },
      { name: 'All Owners', path: '/admin/owners', icon: Icons.AllOwners, roles: ['admin'] },
    ],
  };

  const getFilteredItems = () => {
    if (!isLoggedIn) {
      return navigationConfig.guest;
    }

    const userRole = user.role;
    let items = [];

    items = items.concat(
      navigationConfig.common.filter(item => item.roles.includes(userRole))
    );

    if (userRole === 'owner') {
      items = items.concat(navigationConfig.owner);
    }
    if (userRole === 'admin') {
      items = items.concat(navigationConfig.admin);
    }

    return items;
  };

  const getProfilePhotoUrl = () => {
    return user.profilePhoto || null;
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  const itemVariants = {
    hover: { scale: 1.05, x: 5, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 },
  };

  return (
    <>
      {/* Mobile menu button with animation - Only show on mobile */}
      {!isDesktop && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      )}

      {/* Sidebar - Desktop always visible, mobile controlled by isMobileOpen */}
      <AnimatePresence mode="wait">
        {(isDesktop || isMobileOpen) && (
          <motion.div
            initial={isDesktop ? false : "closed"}
            animate={isDesktop ? { x: 0 } : "open"}
            exit="closed"
            variants={!isDesktop ? sidebarVariants : {}}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:shadow-xl overflow-hidden border-r border-gray-200 ${
              isDesktop ? 'lg:translate-x-0' : ''
            }`}
          >
            {/* Decorative gradient orbs - Yellow and Tomato Red */}
            <div className="absolute top-0 -left-20 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-40 h-40 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            {/* User Info Section */}
            <div className="relative p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                {/* Profile Photo with advanced fallback - Yellow to Tomato Red gradient */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-500 to-red-500 flex-shrink-0 shadow-lg ring-2 ring-yellow-200"
                >
                  {isLoggedIn && getProfilePhotoUrl() ? (
                    <img
                      src={getProfilePhotoUrl()}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-red-500">
                              <span class="text-2xl font-bold text-white">${user.name?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500 to-red-500">
                      <span className="text-2xl font-bold text-white">
                        {isLoggedIn ? user.name?.charAt(0).toUpperCase() : 'G'}
                      </span>
                    </div>
                  )}
                  
                  {/* Online status indicator - Tomato Red */}
                  {isLoggedIn && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"
                    />
                  )}
                </motion.div>
                
                {/* User Info Text with animation - Black text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-gray-900 truncate text-lg">
                    {isLoggedIn ? user.name || 'User' : 'Guest User'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${isLoggedIn ? 'bg-red-500' : 'bg-gray-400'} animate-pulse`}></span>
                    <p className="text-xs text-gray-600 capitalize ml-1">
                      {isLoggedIn ? user.role || 'User' : 'Not logged in'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Quick stats (only for logged in users) - commented out as in original */}
              {isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 grid grid-cols-3 gap-2"
                >
                  {/* Stats are commented out in original, keeping same */}
                </motion.div>
              )}
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
              <ul className="space-y-2">
                {getFilteredItems().map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active/Background indicator - Yellow to Tomato Red gradient */}
                          {isActive && (
                            <motion.div
                              layoutId="activeNav"
                              className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl shadow-lg"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          
                          {/* Hover background - Light Yellow */}
                          <div className="absolute inset-0 bg-yellow-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Icon with animation */}
                          <motion.span
                            whileHover="hover"
                            whileTap="tap"
                            variants={itemVariants}
                            className={`relative z-10 flex-shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-white' : 'text-gray-600 group-hover:text-red-500'
                            }`}
                          >
                            <item.icon />
                          </motion.span>
                          
                          {/* Label */}
                          <span className={`relative z-10 font-medium truncate ${
                            isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {item.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Login/Logout Button */}
            <div className="relative p-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
                className={`flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-all duration-300 ${
                  isLoggedIn
                    ? 'text-gray-700 hover:text-red-500 hover:bg-red-50'
                    : 'text-gray-700 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
              >
                <span className="flex-shrink-0">
                  {isLoggedIn ? <Icons.Logout /> : <Icons.Login />}
                </span>
                <span className="font-medium">
                  {isLoggedIn ? 'Logout' : 'Login'}
                </span>
                
                {/* Tooltip on hover */}
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-4 text-xs bg-gray-800 text-white px-2 py-1 rounded-md"
                >
                  {isLoggedIn ? 'Sign out' : 'Sign in'}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile with blur effect - Only show on mobile when sidebar is open */}
      <AnimatePresence>
        {isMobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 lg:hidden z-30"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EAB308;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EF4444;
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};

export default Sidebar;