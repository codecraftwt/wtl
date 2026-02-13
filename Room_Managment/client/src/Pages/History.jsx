import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'material-icons/iconfont/material-icons.css';

const History = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedRoom, setSelectedRoom] = useState('All Rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    completedStays: 0,
    totalRevenue: 0,
    cancellationRate: 0,
    avgStayDuration: 0
  });

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

  // Fetch booking history when user is available
  useEffect(() => {
    if (user.id) {
      fetchBookingHistory();
    }
  }, [user]);

  // Fetch booking history
  const fetchBookingHistory = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/booking/history/${user.id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        const formattedBookings = formatBookings(data.bookings || []);
        setBookings(formattedBookings);
        calculateStats(formattedBookings);
      } else {
        console.error('Failed to fetch bookings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format bookings data
  const formatBookings = (bookingsData) => {
    return bookingsData.map(booking => {
      const startDate = new Date(booking.bookingStartDate);
      const endDate = new Date(booking.bookingEndDate);
      
      return {
        id: `#BK-${booking._id.slice(-4)}`,
        _id: booking._id,
        guest: {
          name: booking.userId?.name || 'Guest',
          email: booking.userId?.email || 'guest@example.com',
          phone: '+1 (555) 000-0000',
          avatar: `https://ui-avatars.com/api/?name=${booking.userId?.name || 'Guest'}&background=137fec&color=fff&size=40`,
          level: getGuestLevel(booking.userId?.createdAt)
        },
        owner: {
          name: booking.ownerId?.name || 'Owner',
          email: booking.ownerId?.email
        },
        property: {
          name: booking.roomId?.title || 'Property',
          room: booking.roomId?.description?.substring(0, 30) || 'Room',
          location: booking.roomId?.location || { lat: 0, lng: 0 },
          roomSize: booking.roomId?.roomSize,
          beds: booking.roomId?.noOfBeds,
          maxOccupancy: booking.roomId?.maxOccupancy
        },
        dates: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        startDate: booking.bookingStartDate,
        endDate: booking.bookingEndDate,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        price: booking.amount ? `$${booking.amount.toFixed(2)}` : '$0.00',
        amount: booking.amount || 0,
        status: getBookingStatus(booking),
        statusColor: getStatusColor(booking),
        paymentStatus: booking.payment_status,
        advance: booking.advance || 0,
        isadvance: booking.isadvance || false,
        bookingCompleted: booking.bookingCompleted || false,
        isbookingcancel: booking.isbookingcancel || false,
        createdAt: booking.createdAt
      };
    });
  };

  // Calculate stats from bookings
  const calculateStats = (bookingsData) => {
    const completed = bookingsData.filter(b => b.status === 'Completed');
    const cancelled = bookingsData.filter(b => b.status === 'Cancelled');
    const totalRevenue = bookingsData.reduce((sum, b) => sum + (b.amount || 0), 0);
    
    const totalDays = bookingsData.reduce((sum, b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return sum + (days || 0);
    }, 0);
    
    const avgDays = bookingsData.length > 0 ? (totalDays / bookingsData.length).toFixed(1) : 0;
    const cancelRate = bookingsData.length > 0 ? ((cancelled.length / bookingsData.length) * 100).toFixed(1) : 0;

    setStats({
      completedStays: completed.length,
      totalRevenue: totalRevenue,
      cancellationRate: cancelRate,
      avgStayDuration: avgDays
    });
  };

  const getGuestLevel = (createdAt) => {
    if (!createdAt) return 'Regular';
    const accountAge = new Date() - new Date(createdAt);
    const days = accountAge / (1000 * 60 * 60 * 24);
    
    if (days > 365) return 'Gold';
    if (days > 180) return 'Silver';
    return 'Regular';
  };

  const getBookingStatus = (booking) => {
    if (booking.isbookingcancel) return 'Cancelled';
    if (booking.bookingCompleted) return 'Completed';
    if (booking.payment_status) return 'Confirmed';
    return 'Pending';
  };

  const getStatusColor = (booking) => {
    if (booking.isbookingcancel) return 'rose';
    if (booking.bookingCompleted) return 'emerald';
    if (booking.payment_status) return 'blue';
    return 'amber';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };

  const getStatusBadgeColor = (status, color) => {
    const colors = {
      emerald: 'bg-emerald-100 text-emerald-700',
      rose: 'bg-rose-100 text-rose-700',
      amber: 'bg-amber-100 text-amber-700',
      blue: 'bg-blue-100 text-blue-700',
      primary: 'bg-primary/10 text-primary'
    };
    return colors[color] || colors.emerald;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchQuery === '' || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All Statuses' || booking.status === selectedStatus;
    const matchesRoom = selectedRoom === 'All Rooms' || booking.property.room.includes(selectedRoom);
    
    return matchesSearch && matchesStatus && matchesRoom;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600">Loading booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-display text-slate-800">
      {/* Main Navigation (Top Bar) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-primary w-8 h-8 rounded flex items-center justify-center text-white">
                <span className="material-icons text-xl">apartment</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">StaySync</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Dashboard</a>
              <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Listings</a>
              <a href="#" className="text-primary border-b-2 border-primary py-5 text-sm font-semibold">Booking History</a>
              <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm font-medium">Reports</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-icons">notifications</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                alt="User profile avatar" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4hxpvLNUV5hVog42zcutI8oYLj5T6wjuC9GhgMRNZGKar9G59OqOh9J0HlEsMLbf8cBl3zDo6bP7QFIMQlFeMinPqlaLnFLd1WWPFuLhaRlUPsUmXwIOzEKnPBxYyykcgD_mPQKYo8-x07xI3GFZkRy1IOrJzCdTvHeBEg2NU0Y0FD7pW2V3vmQonEDgRjQVIKO62dI6rChkm108SpvGiATJS9vgDWRAqbZ1q2olXBqD37gS99Zj6u5-phnj8t6ap-haZq855XtM"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 space-y-8">
        {/* Header & Summary Stats */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Booking History Log</h1>
              <p className="text-slate-500 text-sm mt-1">
                Review and manage {bookings.length} past reservations and transactions.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <span className="material-icons text-sm">download</span>
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
                <span className="material-icons text-sm">print</span>
                Financial Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Completed Stays</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-bold text-slate-900">{stats.completedStays}</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
                  {bookings.length > 0 ? ((stats.completedStays / bookings.length) * 100).toFixed(0) : 0}% of total
                </span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</span>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">All time</span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Cancellation Rate</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-bold text-slate-900">{stats.cancellationRate}%</span>
                <span className="text-xs font-semibold bg-rose-50 text-rose-600 px-2 py-1 rounded">
                  {bookings.filter(b => b.status === 'Cancelled').length} cancelled
                </span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Avg. Stay Duration</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-3xl font-bold text-slate-900">{stats.avgStayDuration} Days</span>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                  {bookings.length} bookings
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none" 
                placeholder="Search Guest Name, Booking ID, or Property..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select 
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm pl-4 pr-10 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-pointer"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
              <div className="relative">
                <button className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-4 py-2 flex items-center gap-2 hover:bg-slate-100 transition-colors">
                  <span className="material-icons text-sm text-slate-400">calendar_today</span>
                  <span>All Time</span>
                </button>
              </div>
              <button 
                className="text-primary text-sm font-semibold hover:underline px-2"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('All Statuses');
                  setSelectedRoom('All Rooms');
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </section>

        {/* Data Table */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-icons text-5xl text-slate-300 mb-4">history</span>
              <p className="text-slate-500 text-lg">No booking history found</p>
              <p className="text-slate-400 text-sm mt-1">Your past bookings will appear here</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                      </th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Property / Room</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Stay Dates</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Price</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking, index) => (
                      <tr 
                        key={booking._id || index} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => handleRowClick(booking)}
                      >
                        <td className="py-4 px-6">
                          <input className="rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-primary">{booking.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                              alt={`${booking.guest.name} profile`} 
                              src={booking.guest.avatar}
                            />
                            <div>
                              <p className="text-sm font-semibold text-slate-900 leading-none">{booking.guest.name}</p>
                              <p className="text-xs text-slate-500 mt-1">Guest Level: {booking.guest.level}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{booking.property.name}</p>
                            <p className="text-xs text-slate-500">{booking.property.room}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600">{booking.dates}</td>
                        <td className="py-4 px-6 text-sm font-bold text-slate-900 text-right">{booking.price}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeColor(booking.status, booking.statusColor)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                            <span className="material-icons">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-900">1</span> to <span className="font-semibold text-slate-900">{filteredBookings.length}</span> of <span className="font-semibold text-slate-900">{bookings.length}</span> results
                </p>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent" disabled>
                    <span className="material-icons text-sm">chevron_left</span>
                  </button>
                  <button className="px-3 py-1 rounded bg-primary text-white text-sm font-bold">1</button>
                  <button className="p-2 rounded hover:bg-slate-200 disabled:opacity-30" disabled>
                    <span className="material-icons text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Side Drawer (Booking Detail View) */}
      <aside className={`fixed right-0 top-0 h-full w-[450px] bg-white border-l border-slate-200 shadow-2xl z-40 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedBooking && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
                <p className="text-sm text-primary font-medium">{selectedBooking.id}</p>
              </div>
              <button 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                onClick={closeDrawer}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
              {/* Guest Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Guest Information</h3>
                <div className="flex items-center gap-4">
                  <img 
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200" 
                    alt="Guest profile" 
                    src={selectedBooking.guest.avatar}
                  />
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{selectedBooking.guest.name}</h4>
                    <p className="text-sm text-slate-500">{selectedBooking.guest.email}</p>
                    <p className="text-sm text-slate-500">{selectedBooking.guest.phone}</p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Property Details</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-medium text-slate-900">{selectedBooking.property.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{selectedBooking.property.room}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-slate-500">Room Size:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedBooking.property.roomSize || 'N/A'} m²</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Beds:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedBooking.property.beds || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Max Occupancy:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedBooking.property.maxOccupancy || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Booking Timeline</h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Check-in</span>
                    <span className="text-slate-900 font-medium">
                      {selectedBooking.checkIn ? new Date(selectedBooking.checkIn).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Check-out</span>
                    <span className="text-slate-900 font-medium">
                      {selectedBooking.checkOut ? new Date(selectedBooking.checkOut).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Booked on</span>
                    <span className="text-slate-900 font-medium">
                      {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Summary</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="text-slate-900 font-bold">{selectedBooking.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Advance Paid</span>
                  <span className="text-slate-900 font-medium">
                    {selectedBooking.advance ? `$${selectedBooking.advance.toFixed(2)}` : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    selectedBooking.paymentStatus ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedBooking.paymentStatus ? 'Paid' : 'Pending'}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between">
                  <span className="text-base font-bold text-slate-900">Total Paid</span>
                  <span className="text-base font-bold text-primary">{selectedBooking.price}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <button className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-sm">
                  Download Invoice (PDF)
                </button>
                <button className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Send Message to Guest
                </button>
                {!selectedBooking.isbookingcancel && (
                  <button className="w-full py-3 border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-colors">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default History;