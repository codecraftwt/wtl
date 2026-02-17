// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// const Profile = () => {
//   const [isActive, setIsActive] = useState(true);
//   const [user, setUser] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   // Fetch all countries
//   const fetchAllCountries = async () => {
//     try {
//       const response = await fetch('https://api.countrystatecity.in/v1/countries', {
//         method: 'GET', // GET is the default method
//         headers: {
//           'X-CSCAPI-KEY': 'e42d26fd2748415b32f2dc6a2cb00d9662c4425c4130ce446ceb0b4936001ded'
//         }
//       });

//       const countries = await response.json();
//       console.log('All Countries:', countries);
//       return countries;
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     }
//   };

//   // Call the function
//   fetchAllCountries();
//   // Fetch user profile
//   const fetchUserProfile = async (userId) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/user/${userId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include'
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setUser(data);
//         setFormData(data);
//         setIsActive(data.isActive);
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update user profile
//   const updateUserProfile = async (updatedData) => {
//     try {
//       setUpdating(true);
//       const response = await fetch(`${BASE_URL}/user/update/${user.id || user._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(updatedData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setUser(prev => ({ ...prev, ...updatedData }));
//         setFormData(prev => ({ ...prev, ...updatedData }));

//         const cookieUser = Cookies.get('user');
//         if (cookieUser) {
//           const parsedUser = JSON.parse(cookieUser);
//           Cookies.set('user', JSON.stringify({ ...parsedUser, ...updatedData }), {
//             expires: 7,
//             secure: import.meta.env.PROD,
//             sameSite: 'strict'
//           });
//         }

//         setMessage({ type: 'success', text: 'Profile updated successfully!' });
//         setEditMode(false);
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Update failed' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Something went wrong' });
//     } finally {
//       setUpdating(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // Update user status
//   const updateUserStatus = async (status) => {
//     try {
//       const response = await fetch(`${BASE_URL}/user/status/${user.id || user._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ isActive: status })
//       });

//       if (response.ok) {
//         setIsActive(status);
//         setUser(prev => ({ ...prev, isActive: status }));

//         const cookieUser = Cookies.get('user');
//         if (cookieUser) {
//           const parsedUser = JSON.parse(cookieUser);
//           Cookies.set('user', JSON.stringify({ ...parsedUser, isActive: status }), {
//             expires: 7,
//             secure: import.meta.env.PROD,
//             sameSite: 'strict'
//           });
//         }
//         setMessage({ type: 'success', text: `Account ${status ? 'activated' : 'deactivated'}` });
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       setIsActive(user.isActive);
//     } finally {
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//       setFormData(parsedUser);
//       setIsActive(parsedUser.isActive);

//       if (parsedUser.id || parsedUser._id) {
//         fetchUserProfile(parsedUser.id || parsedUser._id);
//       }
//     }
//   }, []);

//   const handleStatusToggle = () => {
//     const newStatus = !isActive;
//     setIsActive(newStatus);
//     updateUserStatus(newStatus);
//   };

//   const handleSaveChanges = async () => {
//     const changedFields = {};
//     Object.keys(formData).forEach(key => {
//       if (formData[key] !== user[key] && ['name', 'email', 'location'].includes(key)) {
//         changedFields[key] = formData[key];
//       }
//     });

//     if (Object.keys(changedFields).length > 0) {
//       await updateUserProfile(changedFields);
//     } else {
//       setEditMode(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Handle nested location fields
//     if (name.startsWith('location.')) {
//       const locationField = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         location: {
//           ...prev.location,
//           [locationField]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCancel = () => {
//     setFormData(user);
//     setEditMode(false);
//     setMessage({ type: '', text: '' });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-slate-500">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
//         {!editMode ? (
//           <button
//             onClick={() => setEditMode(true)}
//             className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//           >
//             <span className="material-icons-outlined text-sm">edit</span>
//             Edit
//           </button>
//         ) : (
//           <div className="flex gap-2">
//             <button
//               onClick={handleCancel}
//               className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveChanges}
//               disabled={updating}
//               className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
//             >
//               {updating ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Message */}
//       {message.text && (
//         <div className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
//           }`}>
//           {message.text}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Profile Card - Col 1 & 2 */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Basic Information Card */}
//           <div className="bg-white rounded-xl border border-slate-200 p-6">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined text-blue-600">person</span>
//               Basic Information
//             </h3>

//             <div className="flex flex-col sm:flex-row gap-6">
//               {/* Avatar */}
//               <div className="flex flex-col items-center sm:items-start">
//                 <div className="relative">
//                   <img
//                     className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
//                     alt="Profile"
//                     src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=135bec&color=fff&size=96`}
//                   />
//                 </div>
//               </div>

//               {/* Info */}
//               <div className="flex-1 space-y-4">
//                 <div>
//                   <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name || ''}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full text-lg font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Full Name"
//                     />
//                   ) : (
//                     <p className="mt-1 text-lg font-semibold text-slate-800">{user.name || 'User Name'}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</label>
//                   {editMode ? (
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email || ''}
//                       onChange={handleInputChange}
//                       className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                       placeholder="Email Address"
//                     />
//                   ) : (
//                     <p className="mt-1 text-sm text-slate-600">{user.email || 'email@example.com'}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</label>
//                     <div className="mt-1 flex items-center gap-2">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
//                           user.role === 'owner' ? 'bg-amber-100 text-amber-700' :
//                             'bg-blue-100 text-blue-700'
//                         }`}>
//                         {user.role || 'user'}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Member Since</label>
//                     <p className="mt-1 text-sm font-medium text-slate-800">
//                       {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
//                         month: 'long',
//                         day: 'numeric',
//                         year: 'numeric'
//                       }) : 'January 2022'}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</label>
//                   <p className="mt-1 text-xs text-slate-500">
//                     {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
//                       month: 'long',
//                       day: 'numeric',
//                       year: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     }) : 'Not available'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Location Information Card */}
//           <div className="bg-white rounded-xl border border-slate-200 p-6">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined text-blue-600">location_on</span>
//               Location Information
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">City</label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     name="location.city"
//                     value={formData.location?.city || ''}
//                     onChange={handleInputChange}
//                     className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     placeholder="City"
//                   />
//                 ) : (
//                   <p className="mt-1 text-sm font-medium text-slate-800">{user.location?.city || 'San Francisco'}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">State</label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     name="location.state"
//                     value={formData.location?.state || ''}
//                     onChange={handleInputChange}
//                     className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     placeholder="State"
//                   />
//                 ) : (
//                   <p className="mt-1 text-sm font-medium text-slate-800">{user.location?.state || 'CA'}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Latitude</label>
//                 {editMode ? (
//                   <input
//                     type="number"
//                     name="location.latitude"
//                     value={formData.location?.latitude || ''}
//                     onChange={handleInputChange}
//                     className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     placeholder="Latitude"
//                     step="0.0001"
//                   />
//                 ) : (
//                   <p className="mt-1 text-sm font-mono text-slate-800">{user.location?.latitude ? `${user.location.latitude}° N` : '37.7749° N'}</p>
//                 )}
//               </div>
//               <div>
//                 <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Longitude</label>
//                 {editMode ? (
//                   <input
//                     type="number"
//                     name="location.longitude"
//                     value={formData.location?.longitude || ''}
//                     onChange={handleInputChange}
//                     className="mt-1 w-full text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
//                     placeholder="Longitude"
//                     step="0.0001"
//                   />
//                 ) : (
//                   <p className="mt-1 text-sm font-mono text-slate-800">{user.location?.longitude ? `${user.location.longitude}° W` : '122.4194° W'}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Account Status Card */}
//           <div className="bg-white rounded-xl border border-slate-200 p-6">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined text-blue-600">settings</span>
//               Account Status
//             </h3>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium text-slate-800">Account Status</p>
//                   <p className="text-sm text-slate-500">Enable or disable account access</p>
//                 </div>
//                 <button
//                   onClick={handleStatusToggle}
//                   disabled={updating}
//                   className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isActive ? 'bg-blue-600' : 'bg-slate-300'
//                     }`}
//                   role="switch"
//                 >
//                   <span
//                     className={`${isActive ? 'translate-x-5' : 'translate-x-0'
//                       } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//                   />
//                 </button>
//               </div>

//               <div className="border-t border-slate-100 pt-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800">Account ID</p>
//                     <p className="text-xs text-slate-500 font-mono">{user.id || user._id || 'Not available'}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Security & Actions */}
//         <div className="space-y-6">
//           {/* Security Card */}
//           <div className="bg-white rounded-xl border border-slate-200 p-6">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined text-blue-600">security</span>
//               Security
//             </h3>

//             <div className="space-y-4">
//               {/* Verification Status */}
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-800">Email Verification</p>
//                   <p className="text-xs text-slate-500">
//                     {user.isVerified ? 'Verified on ' + (user.verifiedAt ? new Date(user.verifiedAt).toLocaleDateString() : '') : 'Pending verification'}
//                   </p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                   }`}>
//                   {user.isVerified ? 'Verified' : 'Unverified'}
//                 </span>
//               </div>

//               {/* Password */}
//               <div className="border-t border-slate-100 pt-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-slate-800">Password</p>
//                     <p className="text-xs text-slate-500">••••••••••••</p>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Last updated {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric'
//                       }) : '4 months ago'}
//                     </p>
//                   </div>
//                   <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                     Change
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Sessions */}
//           <div className="bg-white rounded-xl border border-slate-200 p-6">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined text-blue-600">devices</span>
//               Active Sessions
//             </h3>

//             <div className="space-y-3">
//               <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
//                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <span className="material-icons-outlined text-white text-sm">laptop_mac</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-slate-800">Current Session</p>
//                   <p className="text-xs text-slate-600">macOS • Chrome</p>
//                 </div>
//                 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
//               </div>

//               <div className="flex items-center gap-3 p-2 opacity-60">
//                 <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
//                   <span className="material-icons-outlined text-slate-500 text-sm">smartphone</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-slate-800">iPhone 13</p>
//                   <p className="text-xs text-slate-500">Last active: Yesterday</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 p-2 opacity-60">
//                 <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
//                   <span className="material-icons-outlined text-slate-500 text-sm">tablet_mac</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-slate-800">iPad</p>
//                   <p className="text-xs text-slate-500">Last active: 2 days ago</p>
//                 </div>
//               </div>
//             </div>

//             <button className="mt-4 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
//               <span className="material-icons-outlined text-sm">logout</span>
//               Log out all other sessions
//             </button>
//           </div>

//           {/* Danger Zone */}
//           <div className="bg-white rounded-xl border border-red-200 p-6">
//             <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined">warning</span>
//               Danger Zone
//             </h3>

//             <div className="space-y-2">
//               <button className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between border border-slate-200">
//                 <span>Download your data</span>
//                 <span className="material-icons-outlined text-sm">download</span>
//               </button>
//               <button className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between border border-red-200">
//                 <span>Delete account</span>
//                 <span className="material-icons-outlined text-sm">delete_forever</span>
//               </button>
//             </div>
//             <p className="text-xs text-slate-500 mt-3">
//               Once you delete your account, there is no going back. Please be certain.
//             </p>
//           </div>
//         </div>
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
  
  // New state for password change
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Location state variables
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const LOCATION_API_KEY = 'e42d26fd2748415b32f2dc6a2cb00d9662c4425c4130ce446ceb0b4936001ded';

  // Fetch all countries
  const fetchAllCountries = async () => {
    try {
      setLoadingLocation(true);
      const response = await fetch('https://api.countrystatecity.in/v1/countries', {
        method: 'GET',
        headers: {
          'X-CSCAPI-KEY': LOCATION_API_KEY
        }
      });

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCountries(data);
        console.log('All Countries:', data);
      } else {
        console.error('Error loading countries:', data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Fetch states by country code
  const fetchStatesByCountry = async (countryCode) => {
    if (!countryCode) {
      setStates([]);
      return;
    }
    
    try {
      setLoadingLocation(true);
      const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
        method: 'GET',
        headers: {
          'X-CSCAPI-KEY': LOCATION_API_KEY
        }
      });

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setStates(data);
        console.log('States:', data);
      } else {
        console.error('Error loading states:', data);
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Fetch cities by country code and state code
  const fetchCitiesByState = async (countryCode, stateCode) => {
    if (!countryCode || !stateCode) {
      setCities([]);
      return;
    }
    
    try {
      setLoadingLocation(true);
      const response = await fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
        {
          method: 'GET',
          headers: {
            'X-CSCAPI-KEY': LOCATION_API_KEY
          }
        }
      );

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCities(data);
        console.log('Cities:', data);
      } else {
        console.error('Error loading cities:', data);
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingLocation(false);
    }
  };

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
        
        // Set selected location values from user data
        if (data.location) {
          const countryCode = data.location.country || '';
          const stateCode = data.location.state || '';
          
          setSelectedCountry(countryCode);
          setSelectedState(stateCode);
          setSelectedCity(data.location.city || '');
          
          // Fetch states if country exists
          if (countryCode) {
            fetchStatesByCountry(countryCode);
          }
          // Fetch cities if both country and state exist
          if (countryCode && stateCode) {
            fetchCitiesByState(countryCode, stateCode);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile (name and location only - NO EMAIL)
  const updateUserProfile = async (updatedData) => {
    try {
      setUpdating(true);
      
      // Remove email from updatedData if it exists (prevent email update)
      const { email, ...dataToUpdate } = updatedData;
      
      const response = await fetch(`${BASE_URL}/user/update/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToUpdate)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(prev => ({ ...prev, ...dataToUpdate }));
        setFormData(prev => ({ ...prev, ...dataToUpdate }));

        const cookieUser = Cookies.get('user');
        if (cookieUser) {
          const parsedUser = JSON.parse(cookieUser);
          Cookies.set('user', JSON.stringify({ ...parsedUser, ...dataToUpdate }), {
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

  // Update password only
  const updatePassword = async () => {
    // Validate passwords
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setUpdating(true);
      
      const response = await fetch(`${BASE_URL}/user/update/${user.id || user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          password: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordModal(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'Password update failed' });
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
    // Fetch countries when component mounts
    fetchAllCountries();
    
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
      // Only allow name and location to be updated, NOT email
      if (key !== 'email' && formData[key] !== user[key] && ['name', 'location'].includes(key)) {
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

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        country: countryCode,
        state: '',
        city: ''
      }
    }));
    
    if (countryCode) {
      fetchStatesByCountry(countryCode);
    }
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity('');
    setCities([]);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        state: stateCode,
        city: ''
      }
    }));
    
    if (selectedCountry && stateCode) {
      fetchCitiesByState(selectedCountry, stateCode);
    }
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        city: cityName
      }
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(user);
    setSelectedCountry(user.location?.country || '');
    setSelectedState(user.location?.state || '');
    setSelectedCity(user.location?.city || '');
    
    // Refetch states and cities if needed
    if (user.location?.country) {
      fetchStatesByCountry(user.location.country);
      if (user.location?.state) {
        fetchCitiesByState(user.location.country, user.location.state);
      }
    }
    
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  // Get country name from code
  const getCountryName = (code) => {
    if (!code || !Array.isArray(countries)) return code;
    const country = countries.find(c => c.iso2 === code);
    return country ? country.name : code;
  };

  // Get state name from code
  const getStateName = (code) => {
    if (!code || !Array.isArray(states)) return code;
    const state = states.find(s => s.iso2 === code);
    return state ? state.name : code;
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
            Edit Profile
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
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
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
                  <p className="mt-1 text-sm text-slate-600">{user.email || 'email@example.com'}</p>
                  <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
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

            {editMode ? (
              <div className="space-y-4">
                {/* Country Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    disabled={loadingLocation}
                  >
                    <option value="">Select Country</option>
                    {Array.isArray(countries) && countries.map((country) => (
                      <option key={country.iso2} value={country.iso2}>
                        {country.name} {country.emoji || ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    disabled={!selectedCountry || loadingLocation}
                  >
                    <option value="">Select State</option>
                    {Array.isArray(states) && states.map((state) => (
                      <option key={state.iso2} value={state.iso2}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    disabled={!selectedState || loadingLocation}
                  >
                    <option value="">Select City</option>
                    {Array.isArray(cities) && cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingLocation && (
                  <p className="text-xs text-blue-600">Loading location data...</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Country</label>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {getCountryName(user.location?.country) || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">State</label>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {getStateName(user.location?.state) || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">City</label>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {user.location?.city || 'Not set'}
                  </p>
                </div>
              </div>
            )}
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
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isActive ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  role="switch"
                >
                  <span
                    className={`${isActive ? 'translate-x-5' : 'translate-x-0'
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
                    {user.isVerified ? 'Verified' : 'Pending verification'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={updatePassword}
                  disabled={updating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;