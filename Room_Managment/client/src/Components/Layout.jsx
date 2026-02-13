// // src/Components/Layout.jsx
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';

// const Layout = () => {
//   return (
//     <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
//       <Sidebar />
//       <main className="flex-1 lg:ml-64 p-8 transition-all duration-300">
//         <Outlet /> {/* This renders the child routes */}
//       </main>
//     </div>
//   );
// };

// export default Layout;


import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;