import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    email: '',
    password: ''
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prevstate => ({
      ...prevstate,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs before sending
    if (!info.email || !info.password) {
      toast.warning('Please fill in all fields', {
        position: "top-right",
        autoClose: 2000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(info)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data in cookies
        Cookies.set('token', data.token, {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        });

        // Store complete user data including role
        const userData = {
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.name
        };

        Cookies.set('user', JSON.stringify(userData), {
          expires: 7,
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        });

        // Success toast
        // toast.success('Login successful! Redirecting...', {
        //   position: "top-right",
        //   autoClose: 2000,
        //   onClose: () => {
        //     // ✅ ROLE-BASED REDIRECTION
        //     switch (data.role) {
        //       case 'owner':
        //         navigate('/');
        //         break;
        //       case 'user':
        //         navigate('/');
        //         break;
        //       case 'admin':
        //         navigate('/');
        //         break;
        //       default:
        //         navigate('/');
        //     }
        //   }
        toast.success('Login successful! Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          onClose: () => {
            // Get the page they were trying to access, or go to dashboard
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
          }
        });

      } else {
        // Error toast with server message
        toast.error(data.message || 'Login failed', {
          position: "top-right",
          autoClose: 2000,
        });
      }

    } catch (err) {
      console.log('Error:', err);
      // Network error toast
      toast.error('Network error. Please check your connection and try again.', {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Container - Add this at the top level of your component */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name='email'
                onChange={handleChange}
                value={info.email}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name='password'
                onChange={handleChange}
                value={info.password}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
            <p className="text-center text-sm text-gray-600">

              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 font-semibold "
              >
                Search as Guest
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
