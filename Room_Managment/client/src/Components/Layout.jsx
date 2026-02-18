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


import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from './Sidebar';

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkLoginStatus = () => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');
    const loggedIn = !!(token && user);
    setIsLoggedIn(loggedIn);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Only render Sidebar if user is logged in */}
      {isLoggedIn && <Sidebar />}

      {/* Adjust main content margin based on login status */}
      <main className={`flex-1 p-8 transition-all duration-300 ${isLoggedIn ? 'lg:ml-64' : ''
        }`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;