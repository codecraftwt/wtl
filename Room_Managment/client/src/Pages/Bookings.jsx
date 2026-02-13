import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'material-icons/iconfont/material-icons.css';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState({});
  
  // Bookings data
  const [bookingDetails, setBookingDetails] = useState(null);
  const [roomBookings, setRoomBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeBookingCheck, setActiveBookingCheck] = useState(null);
  
  // Form states
  const [createForm, setCreateForm] = useState({
    roomId: '',
    bookingStartDate: '',
    bookingEndDate: ''
  });

  const [searchBookingId, setSearchBookingId] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    bookingId: '',
    amount: '',
    payment_method: 'cash'
  });
  const [selectedRoom, setSelectedRoom] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Load user data and token on mount
  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    fetchAllRooms();
  }, []);

  // GET ALL ROOMS - /api/room/
  const fetchAllRooms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/room/`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // 1. CREATE BOOKING - POST /api/booking/create
  const createBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${BASE_URL}/booking/create`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          roomId: createForm.roomId,
          bookingStartDate: new Date(createForm.bookingStartDate).toISOString(),
          bookingEndDate: new Date(createForm.bookingEndDate).toISOString()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: '✅ Booking created successfully! Room has been booked.' 
        });
        setCreateForm({ roomId: '', bookingStartDate: '', bookingEndDate: '' });
        fetchAllRooms();
        
        // Auto switch to view tab after 2 seconds
        setTimeout(() => {
          setActiveTab('view');
          if (data.booking?._id) {
            setSearchBookingId(data.booking._id);
            setTimeout(() => fetchBookingById(data.booking._id), 100);
          }
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create booking' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // 2. GET BOOKING BY ID AND ACTIVE BOOKING CHECK - GET /api/booking/:id AND /api/activebooking/check/:id
  const fetchBookingById = async (bookingId = searchBookingId) => {
    if (!bookingId) {
      setMessage({ type: 'error', text: 'Please enter a booking ID' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Fetch booking details
      const bookingResponse = await fetch(`${BASE_URL}/booking/${bookingId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const bookingData = await bookingResponse.json();

      if (bookingResponse.ok) {
        setBookingDetails(bookingData.booking);
        
        // Fetch active booking check for bill calculation
        fetchActiveBookingCheck(bookingId);
        setMessage({ type: 'success', text: 'Booking fetched successfully' });
      } else {
        setMessage({ type: 'error', text: bookingData.message || 'Booking not found' });
        setBookingDetails(null);
        setActiveBookingCheck(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching booking' });
      setBookingDetails(null);
      setActiveBookingCheck(null);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // 2.1 GET ACTIVE BOOKING CHECK - /api/activebooking/check/:bookingId
  const fetchActiveBookingCheck = async (bookingId) => {
    try {
      const response = await fetch(`${BASE_URL}/activebooking/check/${bookingId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setActiveBookingCheck(data);
        // Auto-populate checkout data with calculated amount
        setCheckoutData(prev => ({
          ...prev,
          bookingId: bookingId,
          amount: data.amount.toFixed(2)
        }));
      } else {
        setActiveBookingCheck(null);
      }
    } catch (error) {
      console.error('Error fetching active booking check:', error);
      setActiveBookingCheck(null);
    }
  };

  // 3. CHECKOUT - PUT /api/booking/checkout/:id
  const checkoutBooking = async () => {
    if (!checkoutData.bookingId || !checkoutData.amount) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/booking/checkout/${checkoutData.bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(checkoutData.amount),
          payment_method: checkoutData.payment_method
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Checkout completed successfully!' });
        setCheckoutData({ bookingId: '', amount: '', payment_method: 'cash' });
        setBookingDetails(null);
        setActiveBookingCheck(null);
        setSearchBookingId('');
        fetchAllRooms();
        setActiveTab('create');
      } else {
        setMessage({ type: 'error', text: data.message || 'Checkout failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error during checkout' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // 4. GET BOOKINGS BY ROOM ID - GET /api/booking/room/:roomId
  const fetchBookingsByRoom = async (roomId) => {
    if (!roomId) return;
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/booking/room/${roomId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setRoomBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching room bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 5. CANCEL BOOKING - PUT /api/booking/cancel/:id
  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/booking/cancel/${bookingId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Booking cancelled successfully' });
        setBookingDetails(null);
        setActiveBookingCheck(null);
        setSearchBookingId('');
        fetchAllRooms();
      } else {
        setMessage({ type: 'error', text: data.message || 'Cancellation failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error cancelling booking' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({ ...prev, [name]: value }));
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusBadge = (booking) => {
    if (booking.isbookingcancel) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Cancelled</span>;
    }
    if (booking.bookingCompleted) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Completed</span>;
    }
    if (booking.payment_status) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Confirmed</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>;
  };

  const clearView = () => {
    setSearchBookingId('');
    setBookingDetails(null);
    setActiveBookingCheck(null);
    setMessage({ type: '', text: '' });
  };

  // Function to handle check booking by ID
  const handleCheckBooking = () => {
    if (!searchBookingId) {
      setMessage({ type: 'error', text: 'Please enter a booking ID' });
      return;
    }
    setActiveTab('view');
    fetchBookingById();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Bookings Management</h1>
      </div>

      {/* Enhanced Success Message */}
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
          {message.type === 'success' && message.text.includes('created') && (
            <span className="text-xs bg-green-100 px-3 py-1.5 rounded-full text-green-700 font-medium flex items-center gap-1">
              <span className="material-icons text-sm">arrow_forward</span>
              Redirecting...
            </span>
          )}
        </div>
      )}

      {/* VISIBLE COLORFUL ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Create Booking Button - BLUE */}
        <button
          onClick={() => setActiveTab('create')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
            activeTab === 'create'
              ? 'bg-blue-600 border-blue-600 shadow-lg'
              : 'bg-white border-blue-500 hover:bg-blue-50 hover:border-blue-600 hover:shadow-lg'
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
            activeTab === 'create'
              ? 'bg-white scale-110'
              : 'bg-blue-100 group-hover:bg-blue-600 group-hover:scale-110'
          }`}>
            <span className={`material-icons text-3xl ${
              activeTab === 'create' ? 'text-blue-600' : 'text-blue-600 group-hover:text-white'
            }`}>add_circle</span>
          </div>
          <div className="text-left flex-1">
            <h3 className={`text-lg font-semibold transition-colors ${
              activeTab === 'create' ? 'text-white' : 'text-slate-800 group-hover:text-blue-700'
            }`}>Create New Booking</h3>
            <p className={`text-sm ${
              activeTab === 'create' ? 'text-blue-100' : 'text-slate-500 group-hover:text-blue-600'
            }`}>Book a room for your stay</p>
          </div>
          {activeTab === 'create' && (
            <span className="bg-white text-blue-600 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              Active
            </span>
          )}
          <span className={`material-icons ${
            activeTab === 'create' ? 'text-white translate-x-1' : 'text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1'
          } transition-transform`}>arrow_forward</span>
        </button>

        {/* View Booking & Bill Button - GREEN */}
        <button
          onClick={() => setActiveTab('view')}
          className={`p-6 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
            activeTab === 'view'
              ? 'bg-emerald-600 border-emerald-600 shadow-lg'
              : 'bg-white border-emerald-500 hover:bg-emerald-50 hover:border-emerald-600 hover:shadow-lg'
          }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
            activeTab === 'view'
              ? 'bg-white scale-110'
              : 'bg-emerald-100 group-hover:bg-emerald-600 group-hover:scale-110'
          }`}>
            <span className={`material-icons text-3xl ${
              activeTab === 'view' ? 'text-emerald-600' : 'text-emerald-600 group-hover:text-white'
            }`}>receipt</span>
          </div>
          <div className="text-left flex-1">
            <h3 className={`text-lg font-semibold transition-colors ${
              activeTab === 'view' ? 'text-white' : 'text-slate-800 group-hover:text-emerald-700'
            }`}>View Booking & Bill</h3>
            <p className={`text-sm ${
              activeTab === 'view' ? 'text-emerald-100' : 'text-slate-500 group-hover:text-emerald-600'
            }`}>Check booking details and payment</p>
          </div>
          {activeTab === 'view' && (
            <span className="bg-white text-emerald-600 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              Active
            </span>
          )}
          <span className={`material-icons ${
            activeTab === 'view' ? 'text-white translate-x-1' : 'text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1'
          } transition-transform`}>arrow_forward</span>
        </button>
      </div>

      {/* Quick Check Booking by ID - BLUE */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-5 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="material-icons text-blue-600">search</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Quick Booking Lookup</h3>
              <p className="text-xs text-blue-100">Enter booking ID to view details</p>
            </div>
          </div>
          <div className="flex-1 relative">
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">fingerprint</span>
            <input
              type="text"
              placeholder="Enter Booking ID (e.g. 698ed232b46aa278e6f9449b)"
              className="w-full pl-10 pr-4 py-3 bg-white border-0 rounded-lg text-sm focus:ring-2 focus:ring-white/50 outline-none shadow-md"
              value={searchBookingId}
              onChange={(e) => setSearchBookingId(e.target.value)}
            />
          </div>
          <button
            onClick={handleCheckBooking}
            disabled={loading}
            className="px-6 py-3 bg-white text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg hover:shadow-xl"
          >
            <span className="material-icons text-sm">visibility</span>
            Check Booking
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Booking
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'view'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            View Booking
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'room'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Room Bookings
          </button>
        </nav>
      </div>

      {/* CREATE BOOKING TAB */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">add_circle</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Create New Booking</h2>
          </div>
          
          <form onSubmit={createBooking} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Room <span className="text-red-500">*</span>
              </label>
              <select
                name="roomId"
                value={createForm.roomId}
                onChange={handleCreateInputChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Choose a room...</option>
                {rooms.filter(room => room.isAvailable).map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.title} - {formatCurrency(room.pricePerDay)}/night - {room.roomSize}m² - {room.noOfBeds} bed(s)
                  </option>
                ))}
              </select>
              {rooms.filter(room => room.isAvailable).length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <span className="material-icons text-amber-600 text-xs">info</span>
                  No rooms available at the moment.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="bookingStartDate"
                  value={createForm.bookingStartDate}
                  onChange={handleCreateInputChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="bookingEndDate"
                  value={createForm.bookingEndDate}
                  onChange={handleCreateInputChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* VISIBLE BLUE CREATE BOOKING BUTTON */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading || !createForm.roomId || !createForm.bookingStartDate || !createForm.bookingEndDate}
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Booking...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons text-white group-hover:scale-110 transition-transform">booking</span>
                    <span className="font-semibold text-base">CREATE BOOKING</span>
                    <span className="material-icons text-white/80 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
              
              {/* Form Status Messages */}
              {!createForm.roomId && (
                <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                  <span className="material-icons text-amber-600 text-xs">info</span>
                  Please select a room to continue
                </p>
              )}
              {createForm.roomId && (!createForm.bookingStartDate || !createForm.bookingEndDate) && (
                <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                  <span className="material-icons text-amber-600 text-xs">info</span>
                  Please select check-in and check-out dates
                </p>
              )}
              {createForm.roomId && createForm.bookingStartDate && createForm.bookingEndDate && (
                <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                  <span className="material-icons text-green-600 text-xs">check_circle</span>
                  Ready to create booking! Click the blue button above.
                </p>
              )}
            </div>
          </form>

          {/* Quick Tips - BLUE */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="material-icons text-blue-600 text-sm">tips_and_updates</span>
              Booking Tips
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Make sure to select available rooms only (marked with price)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                Check-in and check-out times are in 24-hour format
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                After creation, you'll be redirected to view booking details
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* VIEW BOOKING TAB */}
      {activeTab === 'view' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="material-icons text-emerald-600">receipt</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-800">View Booking & Bill</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  placeholder="Enter Booking ID"
                  className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                  value={searchBookingId}
                  onChange={(e) => setSearchBookingId(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchBookingById()}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-md"
                >
                  <span className="material-icons text-sm">search</span>
                  Search
                </button>
                {bookingDetails && (
                  <button
                    onClick={clearView}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {bookingDetails && (
              <div className="space-y-6">
                {/* Booking Details */}
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Booking ID</p>
                      <p className="text-lg font-semibold text-blue-600 font-mono">#{bookingDetails._id.slice(-8)}</p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{bookingDetails._id}</p>
                    </div>
                    {getStatusBadge(bookingDetails)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guest Information</h4>
                      <div>
                        <p className="font-medium text-slate-800">{bookingDetails.userId?.name}</p>
                        <p className="text-xs text-slate-500">{bookingDetails.userId?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Room Information</h4>
                      <div>
                        <p className="font-medium text-slate-800">{bookingDetails.roomId?.title}</p>
                        <p className="text-xs text-slate-500">{bookingDetails.roomId?.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {bookingDetails.roomId?.roomSize}m² • {bookingDetails.roomId?.noOfBeds} bed(s) • Max {bookingDetails.roomId?.maxOccupancy} guests
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Booking Timeline</h4>
                      <div className="space-y-1">
                        <p className="text-sm"><span className="text-slate-500">Check-in:</span> {formatDate(bookingDetails.bookingStartDate)}</p>
                        <p className="text-sm"><span className="text-slate-500">Check-out:</span> {formatDate(bookingDetails.bookingEndDate)}</p>
                        {bookingDetails.checkIn && (
                          <p className="text-sm"><span className="text-slate-500">Actual Check-in:</span> {formatDate(bookingDetails.checkIn)}</p>
                        )}
                        {bookingDetails.checkOut && (
                          <p className="text-sm"><span className="text-slate-500">Actual Check-out:</span> {formatDate(bookingDetails.checkOut)}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment Details</h4>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-slate-500">Amount:</span>{' '}
                          <span className="font-semibold text-slate-800">{formatCurrency(bookingDetails.amount)}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-slate-500">Payment Status:</span>{' '}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            bookingDetails.payment_status ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {bookingDetails.payment_status ? 'Paid' : 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Booking Check - Bill Details */}
                {activeBookingCheck && !bookingDetails.bookingCompleted && !bookingDetails.isbookingcancel && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                      <span className="material-icons text-blue-600 text-sm">receipt</span>
                      Current Booking Summary
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-slate-500">Total Hours</p>
                        <p className="text-xl font-bold text-blue-700">{activeBookingCheck.totalHours.toFixed(1)} hrs</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-slate-500">Total Days</p>
                        <p className="text-xl font-bold text-blue-700">{activeBookingCheck.totalDays} days</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-slate-500">Amount Due</p>
                        <p className="text-xl font-bold text-blue-700">{formatCurrency(activeBookingCheck.amount)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={checkoutBooking}
                        disabled={loading}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <span className="material-icons text-sm">payment</span>
                            CHECKOUT NOW
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => cancelBooking(bookingDetails._id)}
                        className="px-6 py-2.5 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-icons text-sm">cancel</span>
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                )}

                {!bookingDetails.bookingCompleted && !bookingDetails.isbookingcancel && !activeBookingCheck && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => cancelBooking(bookingDetails._id)}
                      className="px-6 py-2.5 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-icons text-sm">cancel</span>
                      Cancel Booking
                    </button>
                  </div>
                )}

                {bookingDetails.bookingCompleted && (
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 flex items-center gap-2">
                    <span className="material-icons text-emerald-600">check_circle</span>
                    <span className="text-sm text-emerald-700">This booking has been completed successfully.</span>
                  </div>
                )}

                {bookingDetails.isbookingcancel && (
                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-200 flex items-center gap-2">
                    <span className="material-icons text-rose-600">cancel</span>
                    <span className="text-sm text-rose-700">This booking has been cancelled.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ROOM BOOKINGS TAB */}
      {activeTab === 'room' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="material-icons text-blue-600">meeting_room</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Bookings by Room</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
              value={selectedRoom}
              onChange={(e) => {
                setSelectedRoom(e.target.value);
                fetchBookingsByRoom(e.target.value);
              }}
            >
              <option value="">Select a room...</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.title} - {room.isAvailable ? 'Available' : 'Booked'} - {formatCurrency(room.pricePerDay)}/night
                </option>
              ))}
            </select>
          </div>

          {roomBookings.length > 0 ? (
            <div className="space-y-3">
              {roomBookings.map((booking) => (
                <div key={booking._id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          #{booking._id.slice(-8)}
                        </span>
                        {getStatusBadge(booking)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-800">Guest: {booking.userId?.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDate(booking.bookingStartDate)} - {formatDate(booking.bookingEndDate)}
                          </p>
                        </div>
                        <div className="md:text-right">
                          {booking.amount && (
                            <p className="text-sm font-semibold text-slate-800">
                              {formatCurrency(booking.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('view');
                        setSearchBookingId(booking._id);
                        setTimeout(() => fetchBookingById(booking._id), 100);
                      }}
                      className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 self-start shadow-sm"
                    >
                      <span className="material-icons text-sm">visibility</span>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedRoom ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
              <span className="material-icons text-4xl text-slate-300 mb-2">history</span>
              <p className="text-slate-500">No bookings found for this room.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Bookings;