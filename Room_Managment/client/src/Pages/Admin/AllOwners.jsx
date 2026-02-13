import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'material-icons/iconfont/material-icons.css';

const AllOwners = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all owners on mount using role endpoint - NO FRONTEND FILTERING
  useEffect(() => {
    fetchAllOwners();
  }, []);

  // GET ALL USERS BY ROLE - /api/user/role/owner
  const fetchAllOwners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/role/owner`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log to see structure
      
      // Handle different response formats
      if (Array.isArray(data)) {
        // If API returns array directly
        setOwners(data);
      } else if (data && data.users && Array.isArray(data.users)) {
        // If API returns { users: [...] }
        setOwners(data.users);
      } else if (data && data.data && Array.isArray(data.data)) {
        // If API returns { data: [...] }
        setOwners(data.data);
      } else if (data && data.owners && Array.isArray(data.owners)) {
        // If API returns { owners: [...] }
        setOwners(data.owners);
      } else {
        // If response is not an array, set empty array
        console.error('Unexpected API response format:', data);
        setOwners([]);
        setMessage({ type: 'error', text: 'Unexpected data format from server' });
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
      setMessage({ type: 'error', text: 'Failed to fetch owners' });
      setOwners([]); // Ensure owners is always an array
    } finally {
      setLoading(false);
    }
  };

  // GET USER BY ID - /api/user/:id
  const fetchOwnerById = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedOwner(data);
      }
    } catch (error) {
      console.error('Error fetching owner:', error);
    }
  };

  // UPDATE USER - PUT /api/user/update/:id
  const updateOwner = async (userId, updatedData) => {
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
        setMessage({ type: 'success', text: '✅ Owner updated successfully' });
        fetchAllOwners();
        setSelectedOwner(null);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update owner' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating owner' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // DELETE USER - DELETE /api/user/:id
  const deleteOwner = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this owner?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Owner deleted successfully' });
        fetchAllOwners();
        if (selectedOwner?.id === userId) {
          setSelectedOwner(null);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete owner' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting owner' });
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
          text: `✅ Owner ${!currentStatus ? 'activated' : 'deactivated'} successfully` 
        });
        fetchAllOwners();
        if (selectedOwner?.id === userId) {
          setSelectedOwner({ ...selectedOwner, isActive: !currentStatus });
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

  // Safe filter - ensure owners is an array before filtering
  const filteredOwners = Array.isArray(owners) 
    ? owners.filter(owner => {
        const matchesSearch = searchQuery === '' || 
          (owner.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (owner.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (owner.id?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">All Owners</h1>
          <p className="text-sm text-slate-500 mt-1">
            Total <span className="font-semibold text-blue-600">{Array.isArray(owners) ? owners.length : 0}</span> registered owners
          </p>
        </div>
        <button
          onClick={fetchAllOwners}
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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Owners Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <span className="material-icons text-5xl text-slate-300 mb-4">people_outline</span>
          <p className="text-slate-500 text-lg">No owners found</p>
          <p className="text-slate-400 text-sm mt-1">
            {searchQuery ? 'No results match your search' : 'No owners are registered in the system yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOwners.map((owner) => (
            <div
              key={owner.id || owner._id || Math.random()}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedOwner(owner)}
            >
              <div className="p-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                    {owner.name?.charAt(0).toUpperCase() || 'O'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{owner.name || 'Unknown'}</h3>
                    <p className="text-sm text-slate-500">{owner.email || 'No email'}</p>
                  </div>
                </div>

                {/* Status Badges - Role comes from API, no frontend filtering */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    {owner.role || 'owner'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    owner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {owner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    owner.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {owner.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="material-icons text-sm text-slate-400">badge</span>
                    <span className="font-mono text-xs">{owner.id || owner._id || 'N/A'}</span>
                  </div>
                  {owner.location && Object.keys(owner.location).length > 0 && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="material-icons text-sm text-slate-400">location_on</span>
                      <span className="text-xs">
                        {owner.location.city || 'N/A'}, {owner.location.state || 'N/A'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUserStatus(owner.id || owner._id, owner.isActive);
                    }}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      owner.isActive
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {owner.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOwner(owner.id || owner._id);
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

      {/* Owner Details Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOwner(null)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Owner Details</h2>
              <button
                onClick={() => setSelectedOwner(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedOwner.name?.charAt(0).toUpperCase() || 'O'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedOwner.name || 'Unknown'}</h3>
                  <p className="text-sm text-slate-500">{selectedOwner.email || 'No email'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">User ID</p>
                    <p className="text-sm font-mono font-medium">{selectedOwner.id || selectedOwner._id || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Role</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      {selectedOwner.role || 'owner'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedOwner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedOwner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500">Verification</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedOwner.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedOwner.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                {selectedOwner.location && Object.keys(selectedOwner.location).length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Location</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOwner.location.city && (
                        <p className="text-sm">City: {selectedOwner.location.city}</p>
                      )}
                      {selectedOwner.location.state && (
                        <p className="text-sm">State: {selectedOwner.location.state}</p>
                      )}
                      {selectedOwner.location.latitude && (
                        <p className="text-sm">Lat: {selectedOwner.location.latitude}</p>
                      )}
                      {selectedOwner.location.longitude && (
                        <p className="text-sm">Lng: {selectedOwner.location.longitude}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => toggleUserStatus(selectedOwner.id || selectedOwner._id, selectedOwner.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedOwner.isActive
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedOwner.isActive ? 'Deactivate Account' : 'Activate Account'}
                  </button>
                  <button
                    onClick={() => deleteOwner(selectedOwner.id || selectedOwner._id)}
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

export default AllOwners;