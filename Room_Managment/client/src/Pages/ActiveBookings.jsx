import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'material-icons/iconfont/material-icons.css';

const ActiveBookings = () => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Load user data on mount
  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  // Fetch active bookings when user is available
  useEffect(() => {
    if (user.id) {
      fetchActiveBookings();
    }
  }, [user]);

  // GET ACTIVE BOOKINGS HISTORY - /api/activebooking/history/:ownerId
  const fetchActiveBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/activebooking/history/${user.id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setActiveBookings(data.activeBookings || []);
      }
    } catch (error) {
      console.error('Error fetching active bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading active bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Active Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Currently active bookings for your properties
          </p>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="text-green-700 font-medium">
            {activeBookings.length} Active
          </span>
        </div>
      </div>

      {/* Active Bookings List */}
      {activeBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-4xl text-green-600">event_busy</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Active Bookings</h3>
            <p className="text-slate-500 max-w-md">
              There are currently no active bookings. When guests check in, their bookings will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Status Bar */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-white text-sm">event_available</span>
                    <span className="text-xs font-medium text-white uppercase tracking-wider">
                      Active Booking
                    </span>
                  </div>
                  <span className="text-xs text-white/90">
                    Checked in: {formatDate(booking.checkIn)}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Active Booking ID */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Active Booking ID
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-slate-400 text-sm">fingerprint</span>
                      <p className="text-sm font-mono font-medium text-slate-800">
                        {booking._id.slice(-8)}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {booking._id}
                    </p>
                  </div>

                  {/* Booking Reference */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Booking Reference
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-slate-400 text-sm">receipt</span>
                      <p className="text-sm font-mono font-medium text-slate-800">
                        {booking.bookingId.slice(-8)}
                      </p>
                    </div>
                  </div>

                  {/* Guest ID */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Guest ID
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-slate-400 text-sm">person</span>
                      <p className="text-sm font-mono font-medium text-slate-800">
                        {booking.userId.slice(-8)}
                      </p>
                    </div>
                  </div>

                  {/* Advance Payment */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Advance Payment
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-slate-400 text-sm">payments</span>
                      {booking.isAdvancePaid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          Not Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-100">
                  {/* Check-in Details */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                      Check-in Details
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-slate-400 text-sm">login</span>
                        <span className="text-sm text-slate-600">
                          {formatDate(booking.checkIn)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-slate-400 text-sm">schedule</span>
                        <span className="text-sm text-slate-600">
                          {new Date(booking.checkIn).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Dates */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                      Status & Dates
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-slate-400 text-sm">info</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {booking.checkOut ? 'Checked Out' : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-slate-400 text-sm">calendar_today</span>
                        <span className="text-xs text-slate-500">
                          Created: {formatDate(booking.createdAt)}
                        </span>
                      </div>
                      {booking.updatedAt !== booking.createdAt && (
                        <div className="flex items-center gap-2">
                          <span className="material-icons text-slate-400 text-sm">update</span>
                          <span className="text-xs text-slate-500">
                            Updated: {formatDate(booking.updatedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveBookings;