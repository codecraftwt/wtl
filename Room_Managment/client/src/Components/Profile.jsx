// import React, { useState } from 'react';

// const Profile= () => {
//     const [isActive, setIsActive] = useState(true);

//     return (
//         <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-slate-800 dark:text-slate-100 font-['Plus_Jakarta_Sans']">
//             {/* Navigation / Header */}
//             <header className="bg-white dark:bg-slate-900 border-b border-primary/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
//                 <div className="flex items-center gap-8">
//                     <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-[#135bec] rounded-lg flex items-center justify-center">
//                             <span className="material-icons-outlined text-white text-xl">admin_panel_settings</span>
//                         </div>
//                         <span className="font-bold text-xl tracking-tight text-[#135bec]">CoreAdmin</span>
//                     </div>
//                     <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
//                         <a href="#" className="hover:text-[#135bec] transition-colors">Dashboard</a>
//                         <a href="#" className="text-[#135bec] border-b-2 border-[#135bec] pb-0.5">Profile</a>
//                         <a href="#" className="hover:text-[#135bec] transition-colors">Users</a>
//                         <a href="#" className="hover:text-[#135bec] transition-colors">Settings</a>
//                     </nav>
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <button className="p-2 text-slate-400 hover:text-[#135bec] transition-colors">
//                         <span className="material-icons-outlined">notifications</span>
//                     </button>
//                     <div className="h-8 w-8 rounded-full overflow-hidden bg-[#135bec]/10">
//                         <img
//                             className="w-full h-full object-cover"
//                             alt="User profile avatar"
//                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0SCEeLIXAvhMIxW4vsLwfK444PPK5Wx0PVBmtGuugqJ2k1gMSHXnV88OvXXGO8dGVM2nTHYtjTU3mob94YAWMsgzNIhAMOt9y8SYhHtctcXcghgIwnfQEx2USPRj_xroE4aw_Aja8AhKoralh5NDINWejZsovxN1_MgO98RcOOkgh0XCis-FeMwHsYs1v25sJhT2Nw5VMfPBa2H_ME6bEAMd7rSbeUkWbnK2OGMWXqi2RKkttNdW014oe_iCa-l34ro4xazNINPBc"
//                         />
//                     </div>
//                 </div>
//             </header>

//             <main className="max-w-7xl mx-auto px-6 py-8">
//                 {/* Breadcrumbs */}
//                 <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
//                     <span>Management</span>
//                     <span className="material-icons-outlined text-xs">chevron_right</span>
//                     <span className="text-slate-600 font-medium">Account Overview</span>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Column 1 & 2: Main Identity & System Information */}
//                     <div className="lg:col-span-2 space-y-8">
//                         {/* Profile Header Card */}
//                         <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#135bec]/10 shadow-sm p-8">
//                             <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//                                 <div className="relative group">
//                                     <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#135bec]/5">
//                                         <img
//                                             className="w-full h-full object-cover"
//                                             alt="User profile main portrait"
//                                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5MD3XIGeZV3n7OZrGdRTiL-xe43bvUyNyK1dHrH5pHZlVsXDfj9N-PiV9H2rDWUk00TEFq-dGwpjXJU0cPTkMLIZiQ_sO7BcE6s4gQD7GRRHcBs7W7eebkIOh9vU2g_GUA-gSFDw2QJpP73VbsDQGv3WN2xKKc-HlX5KCrj6BKw-KRL-szFiDISriAM1QlQ0W_lkUL7DXxnsh1HYfa7eMCwjQlZD2rbIIWe5UffLd1EH2DRWj-cAxaNlsUphNlzhe_Hm_3R4tagg1"
//                                         />
//                                     </div>
//                                     <button className="absolute bottom-1 right-1 bg-[#135bec] text-white p-2 rounded-full shadow-lg hover:bg-[#135bec]/90 transition-all">
//                                         <span className="material-icons-outlined text-sm">photo_camera</span>
//                                     </button>
//                                 </div>
//                                 <div className="flex-1 text-center md:text-left">
//                                     <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
//                                         <h1 className="text-3xl font-extrabold tracking-tight">Alexander Sterling</h1>
//                                         <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#135bec] text-white uppercase tracking-wider">
//                                             Super Admin
//                                         </span>
//                                     </div>
//                                     <p className="text-slate-500 mb-6 font-medium">a.sterling@company-domain.com</p>
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                                         <div className="bg-[#f6f6f8] dark:bg-slate-800/50 p-4 rounded-lg border border-[#135bec]/5">
//                                             <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tighter">Department</span>
//                                             <span className="font-semibold">System Operations</span>
//                                         </div>
//                                         <div className="bg-[#f6f6f8] dark:bg-slate-800/50 p-4 rounded-lg border border-[#135bec]/5">
//                                             <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tighter">Location</span>
//                                             <span className="font-semibold">San Francisco, CA</span>
//                                         </div>
//                                         <div className="bg-[#f6f6f8] dark:bg-slate-800/50 p-4 rounded-lg border border-[#135bec]/5 col-span-2 sm:col-span-1">
//                                             <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tighter">Member Since</span>
//                                             <span className="font-semibold">Jan 2022</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* System & Geographic Card */}
//                         <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#135bec]/10 shadow-sm overflow-hidden">
//                             <div className="p-6 border-b border-[#135bec]/5 flex items-center justify-between">
//                                 <h2 className="text-lg font-bold flex items-center gap-2">
//                                     <span className="material-icons-outlined text-[#135bec]">public</span>
//                                     System & Geographic Data
//                                 </h2>
//                             </div>
//                             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
//                                 {/* Left Side: System Status */}
//                                 <div className="space-y-6">
//                                     <div>
//                                         <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 block">
//                                             System Status
//                                         </label>
//                                         <div className="flex items-center justify-between p-4 bg-[#f6f6f8] dark:bg-slate-800/50 rounded-xl border border-[#135bec]/5">
//                                             <div>
//                                                 <p className="font-bold text-slate-800 dark:text-white">Active Account</p>
//                                                 <p className="text-sm text-slate-500">Enable or disable system access</p>
//                                             </div>
//                                             <button
//                                                 onClick={() => setIsActive(!isActive)}
//                                                 className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-[#135bec]' : 'bg-gray-300'
//                                                     }`}
//                                                 role="switch"
//                                             >
//                                                 <span
//                                                     className={`${isActive ? 'translate-x-5' : 'translate-x-0'
//                                                         } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//                                                 />
//                                             </button>
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 block">
//                                             Access Level
//                                         </label>
//                                         <div className="space-y-3">
//                                             <div className="flex items-center gap-3 text-sm">
//                                                 <span className="material-icons-outlined text-green-500">check_circle</span>
//                                                 <span className="font-medium">Database Read/Write Access</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 text-sm">
//                                                 <span className="material-icons-outlined text-green-500">check_circle</span>
//                                                 <span className="font-medium">User Management Privileges</span>
//                                             </div>
//                                             <div className="flex items-center gap-3 text-sm">
//                                                 <span className="material-icons-outlined text-slate-300">cancel</span>
//                                                 <span className="font-medium text-slate-400 italic">Billing Control Disabled</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Right Side: Geo Data */}
//                                 <div className="space-y-6">
//                                     <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block">
//                                         Geographic Information
//                                     </label>
//                                     <div className="grid grid-cols-2 gap-4 mb-4">
//                                         <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-[#135bec]/10">
//                                             <p className="text-[10px] uppercase font-bold text-slate-400">Latitude</p>
//                                             <p className="font-mono text-[#135bec] font-bold">37.7749° N</p>
//                                         </div>
//                                         <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-[#135bec]/10">
//                                             <p className="text-[10px] uppercase font-bold text-slate-400">Longitude</p>
//                                             <p className="font-mono text-[#135bec] font-bold">122.4194° W</p>
//                                         </div>
//                                     </div>

//                                     {/* Small Map Preview */}
//                                     <div className="h-32 w-full rounded-xl overflow-hidden relative border border-[#135bec]/10 group">
//                                         <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
//                                         <img
//                                             className="absolute inset-0 w-full h-full object-cover"
//                                             alt="Satellite map view of San Francisco"
//                                             src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa3sfKYaC3HevdXcf535Vv-Hx2tjajjR_Az8NSafwRk0jfA78jhrrB2GxGMVlrWtWQP63dYCpGYVEKBAst8BerHu5AwK9cU6RlrfsGiVM38XDPMbmm-n6f3PXmsowdThjLDgSZFpPFalZS_r4DX6FU9umimsyyKiM1OVeueN6Txfh1shsleckbbnTfIewy9Uw_NLSfyl6LrnIYCG4DjbMtus0g6-BHhZNgLYYuxrAs9gu1PzMYRGVcszzAIT8ihg_31J3SP8b0snxJ"
//                                         />
//                                         <div className="absolute inset-0 bg-black/10"></div>
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                             <div className="w-8 h-8 bg-[#135bec] rounded-full border-2 border-white shadow-xl animate-bounce flex items-center justify-center">
//                                                 <span className="material-icons-outlined text-white text-sm">place</span>
//                                             </div>
//                                         </div>
//                                         <button className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded shadow text-xs font-bold hover:bg-white transition-colors">
//                                             Expand Map
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Column 3: Security & Actions */}
//                     <div className="space-y-8">
//                         {/* Security Card */}
//                         <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#135bec]/10 shadow-sm overflow-hidden">
//                             <div className="p-6 border-b border-[#135bec]/5">
//                                 <h2 className="text-lg font-bold flex items-center gap-2">
//                                     <span className="material-icons-outlined text-[#135bec]">verified_user</span>
//                                     Security & Verification
//                                 </h2>
//                             </div>
//                             <div className="p-6 space-y-6">
//                                 <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
//                                             <span className="material-icons-outlined text-white text-sm">check</span>
//                                         </div>
//                                         <div>
//                                             <p className="text-sm font-bold text-green-800 dark:text-green-400 uppercase tracking-tight">
//                                                 Verified Account
//                                             </p>
//                                             <p className="text-xs text-green-700/70 dark:text-green-400/70">
//                                                 ID Verification Complete
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-4">
//                                     <div>
//                                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
//                                             Password
//                                         </label>
//                                         <div className="flex items-center justify-between bg-[#f6f6f8] dark:bg-slate-800/50 p-3 rounded-lg border border-[#135bec]/5">
//                                             <span className="text-slate-400 tracking-[0.3em] font-bold">••••••••••••</span>
//                                             <button className="text-[#135bec] text-xs font-bold hover:underline">
//                                                 Change
//                                             </button>
//                                         </div>
//                                         <p className="text-[10px] text-slate-400 mt-2 italic">Last updated 4 months ago</p>
//                                     </div>

//                                     <div className="pt-4 border-t border-[#135bec]/5">
//                                         <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
//                                             Two-Factor Auth
//                                         </label>
//                                         <button className="w-full py-3 px-4 bg-[#135bec] text-white rounded-lg font-bold text-sm shadow-md shadow-[#135bec]/20 hover:bg-[#135bec]/90 transition-all flex items-center justify-center gap-2">
//                                             <span className="material-icons-outlined text-sm">vibration</span>
//                                             Configure 2FA
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Session Activity Card */}
//                         <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#135bec]/10 shadow-sm overflow-hidden">
//                             <div className="p-6 border-b border-[#135bec]/5">
//                                 <h2 className="text-sm font-bold flex items-center gap-2">
//                                     <span className="material-icons-outlined text-[#135bec] text-lg">history</span>
//                                     Recent Sessions
//                                 </h2>
//                             </div>
//                             <div className="divide-y divide-[#135bec]/5">
//                                 <div className="p-4 flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-[#135bec]/10 rounded flex items-center justify-center">
//                                         <span className="material-icons-outlined text-[#135bec] text-sm">laptop_mac</span>
//                                     </div>
//                                     <div className="flex-1">
//                                         <p className="text-xs font-bold">macOS • Chrome</p>
//                                         <p className="text-[10px] text-slate-400">Current Session • San Francisco</p>
//                                     </div>
//                                 </div>
//                                 <div className="p-4 flex items-center gap-3 opacity-60">
//                                     <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
//                                         <span className="material-icons-outlined text-slate-500 text-sm">smartphone</span>
//                                     </div>
//                                     <div className="flex-1">
//                                         <p className="text-xs font-bold">iPhone 13 • App</p>
//                                         <p className="text-[10px] text-slate-400">Yesterday at 14:22 • Los Angeles</p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
//                                 <button className="text-red-500 text-xs font-bold w-full text-center hover:text-red-600 transition-colors uppercase tracking-widest">
//                                     Log out all other sessions
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Sticky Bottom Actions */}
//                 <div className="mt-12 flex items-center justify-end gap-4 pb-12">
//                     <button className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors">
//                         Cancel
//                     </button>
//                     <button className="px-8 py-2.5 rounded-lg bg-[#135bec] text-white font-bold shadow-lg shadow-[#135bec]/20 hover:scale-[1.02] transition-all">
//                         Save All Changes
//                     </button>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Profile;




// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// const Profile = () => {
//   const [isActive, setIsActive] = useState(true);
//   const [user, setUser] = useState({});

//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       setUser(JSON.parse(userData));
//     }
//   }, []);

//   return (
//     <div>
//       {/* Breadcrumbs */}
//       <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
//         <span>Management</span>
//         <span className="material-icons-outlined text-xs">chevron_right</span>
//         <span className="text-slate-600 font-medium">Account Overview</span>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Column 1 & 2: Main Identity & System Information */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Profile Header Card */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
//             <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-50">
//                   <img
//                     className="w-full h-full object-cover"
//                     alt="User profile"
//                     src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=135bec&color=fff&size=128`}
//                   />
//                 </div>
//                 <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all">
//                   <span className="material-icons-outlined text-sm">photo_camera</span>
//                 </button>
//               </div>
//               <div className="flex-1 text-center md:text-left">
//                 <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
//                   <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
//                     {user.name || 'Alexander Sterling'}
//                   </h1>
//                   <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
//                     {user.role || 'Super Admin'}
//                   </span>
//                 </div>
//                 <p className="text-slate-500 mb-6 font-medium">{user.email || 'a.sterling@company-domain.com'}</p>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                     <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tighter">
//                       Department
//                     </span>
//                     <span className="font-semibold text-slate-700">System Operations</span>
//                   </div>
//                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                     <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tighter">
//                       Location
//                     </span>
//                     <span className="font-semibold text-slate-700">San Francisco, CA</span>
//                   </div>
//                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
//                     <span className="text-xs text-slate-400 block mb-1 uppercase font-bold tracking-tighter">
//                       Member Since
//                     </span>
//                     <span className="font-semibold text-slate-700">Jan 2022</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* System & Geographic Card */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between">
//               <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
//                 <span className="material-icons-outlined text-blue-600">public</span>
//                 System & Geographic Data
//               </h2>
//             </div>
//             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
//               {/* Left Side: System Status */}
//               <div className="space-y-6">
//                 <div>
//                   <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 block">
//                     System Status
//                   </label>
//                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
//                     <div>
//                       <p className="font-bold text-slate-800">Active Account</p>
//                       <p className="text-sm text-slate-500">Enable or disable system access</p>
//                     </div>
//                     <button
//                       onClick={() => setIsActive(!isActive)}
//                       className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
//                         isActive ? 'bg-blue-600' : 'bg-slate-300'
//                       }`}
//                       role="switch"
//                     >
//                       <span
//                         className={`${
//                           isActive ? 'translate-x-5' : 'translate-x-0'
//                         } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//                       />
//                     </button>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 block">
//                     Access Level
//                   </label>
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 text-sm">
//                       <span className="material-icons-outlined text-green-600">check_circle</span>
//                       <span className="font-medium text-slate-700">Database Read/Write Access</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm">
//                       <span className="material-icons-outlined text-green-600">check_circle</span>
//                       <span className="font-medium text-slate-700">User Management Privileges</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-sm">
//                       <span className="material-icons-outlined text-slate-400">cancel</span>
//                       <span className="font-medium text-slate-400 italic">Billing Control Disabled</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side: Geo Data */}
//               <div className="space-y-6">
//                 <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block">
//                   Geographic Information
//                 </label>
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
//                     <p className="text-[10px] uppercase font-bold text-slate-400">Latitude</p>
//                     <p className="font-mono text-blue-600 font-bold">37.7749° N</p>
//                   </div>
//                   <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
//                     <p className="text-[10px] uppercase font-bold text-slate-400">Longitude</p>
//                     <p className="font-mono text-blue-600 font-bold">122.4194° W</p>
//                   </div>
//                 </div>

//                 {/* Small Map Preview */}
//                 <div className="h-32 w-full rounded-xl overflow-hidden relative border border-slate-200 group">
//                   <img
//                     className="absolute inset-0 w-full h-full object-cover"
//                     alt="Satellite map view of San Francisco"
//                     src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
//                   />
//                   <div className="absolute inset-0 bg-black/5"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-xl animate-bounce flex items-center justify-center">
//                       <span className="material-icons-outlined text-white text-sm">place</span>
//                     </div>
//                   </div>
//                   <button className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded shadow text-xs font-bold hover:bg-white transition-colors text-slate-700 border border-slate-200">
//                     Expand Map
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Column 3: Security & Actions */}
//         <div className="space-y-8">
//           {/* Security Card */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
//                 <span className="material-icons-outlined text-blue-600">verified_user</span>
//                 Security & Verification
//               </h2>
//             </div>
//             <div className="p-6 space-y-6">
//               <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
//                     <span className="material-icons-outlined text-white text-sm">check</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-green-800 uppercase tracking-tight">
//                       Verified Account
//                     </p>
//                     <p className="text-xs text-green-600">
//                       ID Verification Complete
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
//                     Password
//                   </label>
//                   <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
//                     <span className="text-slate-400 tracking-[0.3em] font-bold">••••••••••••</span>
//                     <button className="text-blue-600 text-xs font-bold hover:underline">
//                       Change
//                     </button>
//                   </div>
//                   <p className="text-[10px] text-slate-400 mt-2 italic">Last updated 4 months ago</p>
//                 </div>

//                 <div className="pt-4 border-t border-slate-200">
//                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
//                     Two-Factor Auth
//                   </label>
//                   <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
//                     <span className="material-icons-outlined text-sm">vibration</span>
//                     Configure 2FA
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Session Activity Card */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800">
//                 <span className="material-icons-outlined text-blue-600 text-lg">history</span>
//                 Recent Sessions
//               </h2>
//             </div>
//             <div className="divide-y divide-slate-200">
//               <div className="p-4 flex items-center gap-3">
//                 <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
//                   <span className="material-icons-outlined text-blue-600 text-sm">laptop_mac</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-slate-800">macOS • Chrome</p>
//                   <p className="text-[10px] text-slate-500">Current Session • San Francisco</p>
//                 </div>
//               </div>
//               <div className="p-4 flex items-center gap-3 opacity-60">
//                 <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
//                   <span className="material-icons-outlined text-slate-500 text-sm">smartphone</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-slate-800">iPhone 13 • App</p>
//                   <p className="text-[10px] text-slate-500">Yesterday at 14:22 • Los Angeles</p>
//                 </div>
//               </div>
//               <div className="p-4 flex items-center gap-3 opacity-60">
//                 <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
//                   <span className="material-icons-outlined text-slate-500 text-sm">tablet_mac</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-slate-800">iPad • Safari</p>
//                   <p className="text-[10px] text-slate-500">2 days ago • San Francisco</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-4 bg-slate-50">
//               <button className="text-red-600 text-xs font-bold w-full text-center hover:text-red-700 transition-colors uppercase tracking-widest">
//                 Log out all other sessions
//               </button>
//             </div>
//           </div>

//           {/* Account Actions Card */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800">
//                 <span className="material-icons-outlined text-blue-600 text-lg">settings</span>
//                 Account Actions
//               </h2>
//             </div>
//             <div className="p-4 space-y-3">
//               <button className="w-full py-2.5 px-4 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
//                 <span className="material-icons-outlined text-slate-400 text-sm">download</span>
//                 Download your data
//               </button>
//               <button className="w-full py-2.5 px-4 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-3">
//                 <span className="material-icons-outlined text-sm">delete_forever</span>
//                 Delete account
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sticky Bottom Actions */}
//       <div className="mt-12 flex items-center justify-end gap-4 pb-12">
//         <button className="px-6 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
//           Cancel
//         </button>
//         <button className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:scale-[1.02] transition-all">
//           Save All Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Profile = () => {
  const [isActive, setIsActive] = useState(true);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch user profile
  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        setFormData(data);
        setIsActive(data.isActive);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedData) => {
    try {
      setUpdating(true);
      const response = await fetch(`${BASE_URL}/user/update/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(prev => ({ ...prev, ...updatedData }));
        setFormData(prev => ({ ...prev, ...updatedData }));
        
        const cookieUser = Cookies.get('user');
        if (cookieUser) {
          const parsedUser = JSON.parse(cookieUser);
          Cookies.set('user', JSON.stringify({ ...parsedUser, ...updatedData }), {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict'
          });
        }
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setUpdating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Update user status
  const updateUserStatus = async (status) => {
    try {
      const response = await fetch(`${BASE_URL}/user/status/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: status })
      });

      if (response.ok) {
        setIsActive(status);
        setUser(prev => ({ ...prev, isActive: status }));
        
        const cookieUser = Cookies.get('user');
        if (cookieUser) {
          const parsedUser = JSON.parse(cookieUser);
          Cookies.set('user', JSON.stringify({ ...parsedUser, isActive: status }), {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict'
          });
        }
        setMessage({ type: 'success', text: `Account ${status ? 'activated' : 'deactivated'}` });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setIsActive(user.isActive);
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(parsedUser);
      setIsActive(parsedUser.isActive);
      
      if (parsedUser.id || parsedUser._id) {
        fetchUserProfile(parsedUser.id || parsedUser._id);
      }
    }
  }, []);

  const handleStatusToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    updateUserStatus(newStatus);
  };

  const handleSaveChanges = async () => {
    const changedFields = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== user[key] && ['name', 'email', 'location'].includes(key)) {
        changedFields[key] = formData[key];
      }
    });
    
    if (Object.keys(changedFields).length > 0) {
      await updateUserProfile(changedFields);
    } else {
      setEditMode(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-icons-outlined text-sm">edit</span>
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={updating}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {updating ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card - Col 1 & 2 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-blue-600">person</span>
              Basic Information
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="relative">
                  <img
                    className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
                    alt="Profile"
                    src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=135bec&color=fff&size=96`}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full text-lg font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Full Name"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-slate-800">{user.name || 'User Name'}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      placeholder="Email Address"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-slate-600">{user.email || 'email@example.com'}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Member Since</label>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric' 
                      }) : 'January 2022'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</label>
                  <p className="mt-1 text-xs text-slate-500">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-blue-600">location_on</span>
              Location Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">City</label>
                {editMode ? (
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location?.city || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="City"
                  />
                ) : (
                  <p className="mt-1 text-sm font-medium text-slate-800">{user.location?.city || 'San Francisco'}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">State</label>
                {editMode ? (
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location?.state || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="State"
                  />
                ) : (
                  <p className="mt-1 text-sm font-medium text-slate-800">{user.location?.state || 'CA'}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Latitude</label>
                {editMode ? (
                  <input
                    type="number"
                    name="location.latitude"
                    value={formData.location?.latitude || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Latitude"
                    step="0.0001"
                  />
                ) : (
                  <p className="mt-1 text-sm font-mono text-slate-800">{user.location?.latitude ? `${user.location.latitude}° N` : '37.7749° N'}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Longitude</label>
                {editMode ? (
                  <input
                    type="number"
                    name="location.longitude"
                    value={formData.location?.longitude || ''}
                    onChange={handleInputChange}
                    className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Longitude"
                    step="0.0001"
                  />
                ) : (
                  <p className="mt-1 text-sm font-mono text-slate-800">{user.location?.longitude ? `${user.location.longitude}° W` : '122.4194° W'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-blue-600">settings</span>
              Account Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">Account Status</p>
                  <p className="text-sm text-slate-500">Enable or disable account access</p>
                </div>
                <button
                  onClick={handleStatusToggle}
                  disabled={updating}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActive ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                >
                  <span
                    className={`${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Account ID</p>
                    <p className="text-xs text-slate-500 font-mono">{user.id || user._id || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Security & Actions */}
        <div className="space-y-6">
          {/* Security Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-blue-600">security</span>
              Security
            </h3>
            
            <div className="space-y-4">
              {/* Verification Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">Email Verification</p>
                  <p className="text-xs text-slate-500">
                    {user.isVerified ? 'Verified on ' + (user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : '') : 'Pending verification'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              {/* Password */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Password</p>
                    <p className="text-xs text-slate-500">••••••••••••</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Last updated {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : '4 months ago'}
                    </p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined text-blue-600">devices</span>
              Active Sessions
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="material-icons-outlined text-white text-sm">laptop_mac</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Current Session</p>
                  <p className="text-xs text-slate-600">macOS • Chrome</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
              </div>
              
              <div className="flex items-center gap-3 p-2 opacity-60">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="material-icons-outlined text-slate-500 text-sm">smartphone</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">iPhone 13</p>
                  <p className="text-xs text-slate-500">Last active: Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 opacity-60">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="material-icons-outlined text-slate-500 text-sm">tablet_mac</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">iPad</p>
                  <p className="text-xs text-slate-500">Last active: 2 days ago</p>
                </div>
              </div>
            </div>
            
            <button className="mt-4 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
              <span className="material-icons-outlined text-sm">logout</span>
              Log out all other sessions
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
              <span className="material-icons-outlined">warning</span>
              Danger Zone
            </h3>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between border border-slate-200">
                <span>Download your data</span>
                <span className="material-icons-outlined text-sm">download</span>
              </button>
              <button className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between border border-red-200">
                <span>Delete account</span>
                <span className="material-icons-outlined text-sm">delete_forever</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;