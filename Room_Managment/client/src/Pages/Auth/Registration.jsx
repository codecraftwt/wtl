// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Registration = () => {
//   const navigate = useNavigate();

//   const [info, setInfo] = useState({
//     name: '',
//     email: '',
//     password: '',
//     role: 'user' // Default role
//   });

//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setInfo(prevstate => ({
//       ...prevstate,
//       [name]: value
//     }));
//   };

//   const BASE_URL=import.meta.env.VITE_BASE_URL;
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (info.password !== confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     if (!agreeTerms) {
//       alert('Please agree to the Terms of Service and Privacy Policy');
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(info) 
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Registration successful:', data);
//         alert('Registration successful! Please login.');
//         navigate('/');
//       } else {
//         console.error('Registration failed:', data.message);
//         alert(data.message || 'Registration failed');
//       }

//     } catch (err) {
//       console.log('Error:', err);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         {/* Header */}
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name Field */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={info.name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//               required
//             />
//           </div>

//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={info.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//               required
//             />
//           </div>

//           {/* Role Selection - User/Owner */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               I want to register as
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setInfo({ ...info, role: 'user' })}
//                 className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
//                   info.role === 'user'
//                     ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
//                     : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
//                 }`}
//               >
//                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className="font-medium">User</span>
//                 <span className="text-xs text-gray-500">Book rooms</span>
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => setInfo({ ...info, role: 'owner' })}
//                 className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
//                   info.role === 'owner'
//                     ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
//                     : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
//                 }`}
//               >
//                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//                 <span className="font-medium">Owner</span>
//                 <span className="text-xs text-gray-500">List & manage rooms</span>
//               </button>
//             </div>
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={info.password}
//               onChange={handleChange}
//               placeholder="Create a password"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//               required
//             />
//           </div>

//           {/* Confirm Password Field */}
//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm your password"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
//               required
//             />
//           </div>

//           {/* Password Strength Indicator (Optional) */}
//           {info.password && (
//             <div className="text-xs">
//               <span className="text-gray-600">Password strength: </span>
//               <span className={
//                 info.password.length < 6 ? 'text-red-500' :
//                 info.password.length < 10 ? 'text-yellow-500' :
//                 'text-green-500'
//               }>
//                 {info.password.length < 6 ? 'Weak' :
//                  info.password.length < 10 ? 'Medium' :
//                  'Strong'}
//               </span>
//             </div>
//           )}

//           {/* Terms & Conditions */}
//           <div className="flex items-start">
//             <div className="flex items-center h-5">
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={agreeTerms}
//                 onChange={(e) => setAgreeTerms(e.target.checked)}
//                 className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
//                 required
//               />
//             </div>
//             <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//               I agree to the{' '}
//               <a href="#" className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline">
//                 Terms of Service
//               </a>{' '}
//               and{' '}
//               <a href="#" className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline">
//                 Privacy Policy
//               </a>
//             </label>
//           </div>

//           {/* Register Button */}
//           <button
//             type="submit"
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] mt-6"
//           >
//             Create Account
//           </button>

//           {/* Login Link */}
//           <p className="text-center text-sm text-gray-600 mt-4">
//             Already have an account?{' '}
//             <button
//               type="button"
//               onClick={() => navigate('/')}
//               className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline"
//             >
//               Sign in
//             </button>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Registration;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevstate => ({
      ...prevstate,
      [name]: value
    }));
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Validation function
  const validateForm = () => {
    // Name validation
    if (!info.name.trim()) {
      toast.warning('Please enter your full name', {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(info.email)) {
      toast.error('Please enter a valid email address', {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    // Password validation
    if (info.password.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    // Password match validation
    if (info.password !== confirmPassword) {
      toast.error('Passwords do not match!', {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    // Terms agreement validation
    if (!agreeTerms) {
      toast.warning('Please agree to the Terms of Service and Privacy Policy', {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...', {
      position: "top-right",
    });

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(info)
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        // Success toast with emoji based on role
        const roleEmoji = info.role === 'owner' ? '🏨' : '👤';
        toast.success(
          <div>
            <strong>Registration Successful! 🎉</strong>
            <br />
            <span>Welcome, {info.name}! {roleEmoji}</span>
            <br />
            <span className="text-sm">Redirecting to login...</span>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            onClose: () => navigate('/'),
          }
        );
        
        console.log('Registration successful:', data);
        
      } else {
        // Error toast with server message
        toast.error(
          <div>
            <strong>Registration Failed!</strong>
            <br />
            <span>{data.message || 'Something went wrong'}</span>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
          }
        );
        console.error('Registration failed:', data.message);
      }

    } catch (err) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      console.log('Error:', err);
      
      // Network error toast
      toast.error(
        <div>
          <strong>Network Error! 🌐</strong>
          <br />
          <span>Please check your connection and try again.</span>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator with toast
  const checkPasswordStrength = () => {
    if (!info.password) return null;
    
    if (info.password.length < 6) {
      return (
        <div className="text-xs mt-1 flex items-center gap-1">
          <span className="text-red-500">⚠️ Password too short</span>
          <button
            type="button"
            onClick={() => toast.info('Use at least 6 characters for better security', {
              position: "top-right",
              autoClose: 3000,
            })}
            className="text-gray-400 hover:text-gray-600"
          >
            ℹ️
          </button>
        </div>
      );
    } else if (info.password.length < 10) {
      return <span className="text-xs text-yellow-500 mt-1">🟡 Medium strength</span>;
    } else {
      return <span className="text-xs text-green-500 mt-1">🟢 Strong password</span>;
    }
  };

  return (
    <>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={5} // Limit number of toasts
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us today! 🚀</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={info.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={info.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>

            {/* Role Selection - User/Owner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to register as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setInfo({ ...info, role: 'user' });
                    toast.info('Registering as a User - You can book rooms', {
                      position: "top-right",
                      autoClose: 2000,
                    });
                  }}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
                    info.role === 'user'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">User</span>
                  <span className="text-xs text-gray-500">Book rooms</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setInfo({ ...info, role: 'owner' });
                    toast.info('Registering as an Owner - You can list and manage rooms', {
                      position: "top-right",
                      autoClose: 2000,
                    });
                  }}
                  className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
                    info.role === 'owner'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Owner</span>
                  <span className="text-xs text-gray-500">List & manage rooms</span>
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={info.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
              {/* Password Strength Indicator */}
              {checkPasswordStrength()}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
              {/* Password match indicator */}
              {confirmPassword && info.password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">❌ Passwords do not match</p>
              )}
              {confirmPassword && info.password === confirmPassword && (
                <p className="text-xs text-green-500 mt-1">✅ Passwords match</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (e.target.checked) {
                      toast.success('Thank you for accepting our terms! ✅', {
                        position: "top-right",
                        autoClose: 2000,
                      });
                    }
                  }}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  required
                />
              </div>
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Terms of Service - Please read carefully', {
                      position: "top-right",
                      autoClose: 3000,
                    });
                  }}
                  className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Privacy Policy - Your data is safe with us', {
                      position: "top-right",
                      autoClose: 3000,
                    });
                  }}
                  className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={()=>navigate('/login')}
                className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
 
          {/* Help Button */}
          <button
            type="button"
            onClick={() => {
              toast(
                <div>
                  <strong>Need Help?</strong>
                  <br />
                  <span>📧 Contact: support@example.com</span>
                  <br />
                  <span>📞 Call: +1 234 567 890</span>
                </div>,
                {
                  position: "top-right",
                  autoClose: 8000,
                  closeButton: true,
                }
              );
            }}
            className="text-xs text-gray-500 hover:text-gray-700 mt-4 block text-center"
          >
            Need help? Click here
          </button>
        </div>
      </div>
    </>
  );
};

export default Registration;