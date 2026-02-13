import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'material-icons/iconfont/material-icons.css';

const AllUsers = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all users on mount using role endpoint - API already filters by role
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // GET ALL USERS BY ROLE - /api/user/role/user
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/role/user`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log to see the actual response structure
      
      // Handle different response structures
      if (data && Array.isArray(data)) {
        // If API returns array directly
        setUsers(data);
      } else if (data && data.users && Array.isArray(data.users)) {
        // If API returns { users: [...] }
        setUsers(data.users);
      } else if (data && data.data && Array.isArray(data.data)) {
        // If API returns { data: [...] }
        setUsers(data.data);
      } else {
        // If response is not an array, set empty array
        console.error('Unexpected API response format:', data);
        setUsers([]);
        setMessage({ type: 'error', text: 'Unexpected data format from server' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch users' });
      setUsers([]); // Ensure users is always an array
    } finally {
      setLoading(false);
    }
  };

  // GET USER BY ID - /api/user/:id
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // UPDATE USER - PUT /api/user/update/:id
  const updateUser = async (userId, updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ User updated successfully' });
        fetchAllUsers();
        setSelectedUser(null);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating user' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // DELETE USER - DELETE /api/user/:id
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ User deleted successfully' });
        fetchAllUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting user' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // TOGGLE USER STATUS (ACTIVE/INACTIVE) - PUT /api/user/status/:id
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/status/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `✅ User ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
        });
        fetchAllUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isActive: !currentStatus });
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update status' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating status' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">All Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Total <span className="font-semibold text-blue-600">{Array.isArray(users) ? users.length : 0}</span> registered users
          </p>
        </div>
        <button
          onClick={fetchAllUsers}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <span className="material-icons text-sm">refresh</span>
          Refresh
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span className={`material-icons ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="flex-1">{message.text}</span>
        </div>
      )}

      {/* Users Grid - API already filtered by role, no frontend filtering needed */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : !Array.isArray(users) || users.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <span className="material-icons text-5xl text-slate-300 mb-4">people_outline</span>
          <p className="text-slate-500 text-lg">No users found</p>
          <p className="text-slate-400 text-sm mt-1">No users are registered in the system yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id || user._id || Math.random()}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="p-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{user.name || 'Unknown'}</h3>
                    <p className="text-sm text-slate-500">{user.email || 'No email'}</p>
                  </div>
                </div>

                {/* Status Badges - Role comes from API, no frontend filtering */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {user.role || 'user'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="material-icons text-sm text-slate-400">badge</span>
                    <span className="font-mono text-xs">{user.id || user._id || 'N/A'}</span>
                  </div>
                  {user.location && Object.keys(user.location).length > 0 && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-icons text-sm text-slate-400">location_on</span>
                      <span className="text-xs">
                        {user.location.city || 'N/A'}, {user.location.state || 'N/A'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUserStatus(user.id || user._id, user.isActive);
                    }}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      user.isActive
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteUser(user.id || user._id);
                    }}
                    className="flex-1 px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedUser.name || 'Unknown'}</h3>
                  <p className="text-sm text-slate-500">{selectedUser.email || 'No email'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">User ID</p>
                    <p className="text-sm font-mono font-medium">{selectedUser.id || selectedUser._id || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Role</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {selectedUser.role || 'user'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Verification</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                {selectedUser.location && Object.keys(selectedUser.location).length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Location</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedUser.location.city && (
                        <p className="text-sm">City: {selectedUser.location.city}</p>
                      )}
                      {selectedUser.location.state && (
                        <p className="text-sm">State: {selectedUser.location.state}</p>
                      )}
                      {selectedUser.location.latitude && (
                        <p className="text-sm">Lat: {selectedUser.location.latitude}</p>
                      )}
                      {selectedUser.location.longitude && (
                        <p className="text-sm">Lng: {selectedUser.location.longitude}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => toggleUserStatus(selectedUser.id || selectedUser._id, selectedUser.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedUser.isActive
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedUser.isActive ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                  <button
                    onClick={() => deleteUser(selectedUser.id || selectedUser._id)}
                    className="flex-1 px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-200 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;