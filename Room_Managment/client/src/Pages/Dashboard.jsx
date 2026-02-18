// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import 'material-icons/iconfont/material-icons.css';

// const Dashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [user, setUser] = useState({});
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
//   const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
//   const [userReviews, setUserReviews] = useState({});

//   // Room search filters
//   const [filters, setFilters] = useState({
//     minPrice: '',
//     maxPrice: '',
//     beds: '',
//     minSize: ''
//   });

//   // Booking form state
//   const [bookingForm, setBookingForm] = useState({
//     bookingStartDate: '',
//     bookingEndDate: ''
//   });

//   // Review form state
//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     comment: '',
//     isEditing: false,
//     reviewId: null
//   });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;

//   // Get auth headers with token
//   const getAuthHeaders = () => {
//     const token = Cookies.get('token');
//     return {
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // Load user data on mount
//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//     }
//     fetchAllRooms();
//   }, []);

//   // GET ALL ROOMS - /api/room/
//   const fetchAllRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setRooms(data);
//         setFilteredRooms(data);

//         // Fetch reviews for each room
//         data.forEach(room => {
//           fetchRoomReviews(room._id);
//         });

//         // Fetch user's own reviews if logged in
//         if (user.id) {
//           fetchUserReviews();
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GET ROOM REVIEWS - /api/review/reviews/room/:roomId
//   const fetchRoomReviews = async (roomId) => {
//     try {
//       const response = await fetch(`${BASE_URL}/review/reviews/room/${roomId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setUserReviews(prev => ({ ...prev, [roomId]: data.reviews || [] }));
//       }
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//     }
//   };

//   // GET USER'S REVIEWS (optional - if you have an endpoint)
//   const fetchUserReviews = async () => {
//     // This would need a specific endpoint to get reviews by user
//     // For now, we'll just track them from room reviews
//   };

//   // 1. CREATE BOOKING - POST /api/booking/create
//   const createBooking = async (e) => {
//     e.preventDefault();
//     if (!selectedRoomForBooking) return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await fetch(`${BASE_URL}/booking/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders()
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           userId: user.id,
//           roomId: selectedRoomForBooking._id,
//           bookingStartDate: new Date(bookingForm.bookingStartDate).toISOString(),
//           bookingEndDate: new Date(bookingForm.bookingEndDate).toISOString()
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ 
//           type: 'success', 
//           text: '✅ Room booked successfully! Check your bookings page.' 
//         });
//         setShowBookingModal(false);
//         setBookingForm({ bookingStartDate: '', bookingEndDate: '' });
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to create booking' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Something went wrong' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // 2. CREATE/UPDATE REVIEW - POST /api/review/reviews & PUT /api/review/reviews/:id
//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!selectedRoomForReview) return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       let response;
//       if (reviewForm.isEditing) {
//         // Update existing review
//         response = await fetch(`${BASE_URL}/review/reviews/${reviewForm.reviewId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeaders()
//           },
//           credentials: 'include',
//           body: JSON.stringify({
//             rating: reviewForm.rating,
//             comment: reviewForm.comment
//           })
//         });
//       } else {
//         // Create new review
//         response = await fetch(`${BASE_URL}/review/reviews`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeaders()
//           },
//           credentials: 'include',
//           body: JSON.stringify({
//             roomId: selectedRoomForReview._id,
//             userId: user.id,
//             rating: reviewForm.rating,
//             comment: reviewForm.comment
//           })
//         });
//       }

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ 
//           type: 'success', 
//           text: reviewForm.isEditing ? '✅ Review updated successfully!' : '✅ Review added successfully!' 
//         });
//         setShowReviewModal(false);
//         setReviewForm({ rating: 5, comment: '', isEditing: false, reviewId: null });

//         // Refresh reviews for this room
//         fetchRoomReviews(selectedRoomForReview._id);
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to submit review' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Something went wrong' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // Check if user has already reviewed a room
//   const hasUserReviewed = (roomId) => {
//     const reviews = userReviews[roomId] || [];
//     return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
//   };

//   // Get user's review for a room
//   const getUserReview = (roomId) => {
//     const reviews = userReviews[roomId] || [];
//     return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
//   };

//   // Handle search and filters
//   useEffect(() => {
//     let filtered = [...rooms];

//     // Search query
//     if (searchQuery) {
//       filtered = filtered.filter(room => 
//         room.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         room.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Price filters
//     if (filters.minPrice) {
//       filtered = filtered.filter(room => room.pricePerDay >= Number(filters.minPrice));
//     }
//     if (filters.maxPrice) {
//       filtered = filtered.filter(room => room.pricePerDay <= Number(filters.maxPrice));
//     }

//     // Beds filter
//     if (filters.beds) {
//       filtered = filtered.filter(room => room.noOfBeds >= Number(filters.beds));
//     }

//     // Size filter
//     if (filters.minSize) {
//       filtered = filtered.filter(room => room.roomSize >= Number(filters.minSize));
//     }

//     setFilteredRooms(filtered);
//   }, [searchQuery, filters, rooms]);

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const calculateAverageRating = (reviews) => {
//     if (!reviews || reviews.length === 0) return 0;
//     const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
//     return (sum / reviews.length).toFixed(1);
//   };

//   const openBookingModal = (room) => {
//     if (!user.id) {
//       setMessage({ type: 'error', text: 'Please login to book a room' });
//       return;
//     }
//     setSelectedRoomForBooking(room);
//     setShowBookingModal(true);
//   };

//   const openReviewModal = (room) => {
//     if (!user.id) {
//       setMessage({ type: 'error', text: 'Please login to leave a review' });
//       return;
//     }

//     const existingReview = getUserReview(room._id);
//     if (existingReview) {
//       setReviewForm({
//         rating: existingReview.rating,
//         comment: existingReview.comment || '',
//         isEditing: true,
//         reviewId: existingReview._id
//       });
//     } else {
//       setReviewForm({
//         rating: 5,
//         comment: '',
//         isEditing: false,
//         reviewId: null
//       });
//     }

//     setSelectedRoomForReview(room);
//     setShowReviewModal(true);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-slate-800">Find Your Perfect Stay</h1>
//         <p className="text-slate-500 mt-1">Discover and book amazing rooms</p>
//       </div>

//       {/* Message */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${
//           message.type === 'success' 
//             ? 'bg-green-50 text-green-800 border border-green-200' 
//             : 'bg-red-50 text-red-800 border border-red-200'
//         }`}>
//           <span className={`material-icons ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//             {message.type === 'success' ? 'check_circle' : 'error'}
//           </span>
//           <span className="flex-1">{message.text}</span>
//         </div>
//       )}

//       {/* Search and Filter Section */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
//         <h2 className="text-lg font-semibold text-slate-800 mb-4">Search Rooms</h2>

//         {/* Search Box */}
//         <div className="relative mb-4">
//           <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
//           <input
//             type="text"
//             placeholder="Search by room name, description, or location..."
//             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">Min Price ($)</label>
//             <input
//               type="number"
//               placeholder="0"
//               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//               value={filters.minPrice}
//               onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">Max Price ($)</label>
//             <input
//               type="number"
//               placeholder="1000"
//               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//               value={filters.maxPrice}
//               onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">Min Beds</label>
//             <input
//               type="number"
//               placeholder="1"
//               min="1"
//               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//               value={filters.beds}
//               onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">Min Size (sqft)</label>
//             <input
//               type="number"
//               placeholder="20"
//               className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//               value={filters.minSize}
//               onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
//             />
//           </div>
//         </div>

//         {/* Results Count */}
//         <div className="mt-4 text-sm text-slate-500">
//           Found <span className="font-semibold text-blue-600">{filteredRooms.length}</span> rooms
//         </div>
//       </div>

//       {/* Rooms Grid */}
//       {loading ? (
//         <div className="flex justify-center py-12">
//           <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRooms.map((room) => {
//             const reviews = userReviews[room._id] || [];
//             const avgRating = calculateAverageRating(reviews);
//             const userReview = getUserReview(room._id);

//             return (
//               <div 
//                 key={room._id} 
//                 className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
//                 onClick={() => setSelectedRoom(room)}
//               >
//                 {/* Room Image */}
//                 <div className="h-48 bg-slate-100 relative">
//                   {room.images && room.images.length > 0 ? (
//                     <img 
//                       src={room.images[0]} 
//                       alt={room.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                       <span className="material-icons text-4xl text-slate-400">image</span>
//                     </div>
//                   )}

//                   {/* Availability Badge */}
//                   <div className="absolute top-2 right-2">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       room.isAvailable 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-amber-100 text-amber-700'
//                     }`}>
//                       {room.isAvailable ? 'Available' : 'Booked'}
//                     </span>
//                   </div>

//                   {/* Price Tag */}
//                   <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
//                     {formatCurrency(room.pricePerDay)} <span className="text-xs font-normal">/night</span>
//                   </div>
//                 </div>

//                 {/* Room Details */}
//                 <div className="p-4">
//                   <h3 className="font-semibold text-slate-800 text-lg mb-1">{room.title}</h3>
//                   <p className="text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>

//                   {/* Rating Section */}
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-1">
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <span key={star} className={`material-icons text-sm ${
//                             star <= avgRating ? 'text-amber-400' : 'text-slate-300'
//                           }`}>
//                             star
//                           </span>
//                         ))}
//                       </div>
//                       <span className="text-xs text-slate-500">
//                         ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
//                       </span>
//                       {avgRating > 0 && (
//                         <span className="text-xs font-medium text-amber-600 ml-1">
//                           {avgRating}
//                         </span>
//                       )}
//                     </div>

//                     {/* Your Review Badge */}
//                     {userReview && (
//                       <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                         Your review: {userReview.rating}★
//                       </span>
//                     )}
//                   </div>

//                   {/* Room Features */}
//                   <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">bed</span>
//                       {room.noOfBeds} bed
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">straighten</span>
//                       {room.roomSize} sqft
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">people</span>
//                       {room.maxOccupancy}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         openBookingModal(room);
//                       }}
//                       disabled={!room.isAvailable}
//                       className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
//                         room.isAvailable
//                           ? 'bg-blue-600 text-white hover:bg-blue-700'
//                           : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                       }`}
//                     >
//                       {room.isAvailable ? 'Book Now' : 'Unavailable'}
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         openReviewModal(room);
//                       }}
//                       className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
//                         userReview
//                           ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                           : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                       }`}
//                     >
//                       {userReview ? 'Update Review' : 'Write Review'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {filteredRooms.length === 0 && (
//             <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
//               <span className="material-icons text-5xl text-slate-300 mb-4">search_off</span>
//               <p className="text-slate-500 text-lg">No rooms found</p>
//               <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Room Details Modal */}
//       {selectedRoom && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRoom(null)}>
//           <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-slate-800">Room Details</h2>
//               <button
//                 onClick={() => setSelectedRoom(null)}
//                 className="p-2 hover:bg-slate-100 rounded-full"
//               >
//                 <span className="material-icons">close</span>
//               </button>
//             </div>

//             <div className="p-6">
//               {/* Image Gallery */}
//               {selectedRoom.images && selectedRoom.images.length > 0 && (
//                 <div className="mb-6">
//                   <div className="grid grid-cols-2 gap-2">
//                     {selectedRoom.images.map((img, index) => (
//                       <img 
//                         key={index}
//                         src={img} 
//                         alt={`${selectedRoom.title} ${index + 1}`}
//                         className="w-full h-40 object-cover rounded-lg"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-2xl font-bold text-slate-800">{selectedRoom.title}</h3>
//                   <p className="text-slate-600 mt-1">{selectedRoom.description}</p>
//                 </div>

//                 {/* Reviews Section */}
//                 <div className="bg-slate-50 p-4 rounded-lg">
//                   <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
//                     <span className="material-icons text-amber-400">star</span>
//                     Guest Reviews ({userReviews[selectedRoom._id]?.length || 0})
//                   </h4>

//                   {userReviews[selectedRoom._id]?.length > 0 ? (
//                     <div className="space-y-3">
//                       {userReviews[selectedRoom._id].map((review) => (
//                         <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-slate-800">
//                               {review.userId?.name || 'Guest'}
//                               {review.userId?._id === user.id && (
//                                 <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                                   You
//                                 </span>
//                               )}
//                             </span>
//                             <span className="text-xs text-slate-500">
//                               {formatDate(review.createdAt)}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1 mt-1">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <span key={star} className={`material-icons text-xs ${
//                                 star <= review.rating ? 'text-amber-400' : 'text-slate-300'
//                               }`}>
//                                 star
//                               </span>
//                             ))}
//                           </div>
//                           <p className="text-xs text-slate-600 mt-1">{review.comment}</p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-slate-500 text-center py-4">
//                       No reviews yet for this room.
//                     </p>
//                   )}
//                 </div>

//                 {/* Room Specifications */}
//                 <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
//                   <div>
//                     <p className="text-xs text-slate-500">Price per night</p>
//                     <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Status</p>
//                     <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
//                       selectedRoom.isAvailable 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-amber-100 text-amber-700'
//                     }`}>
//                       {selectedRoom.isAvailable ? 'Available' : 'Booked'}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Beds</p>
//                     <p className="font-medium">{selectedRoom.noOfBeds}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Room Size</p>
//                     <p className="font-medium">{selectedRoom.roomSize}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Max Occupancy</p>
//                     <p className="font-medium">{selectedRoom.maxOccupancy} guests</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Checkout Time</p>
//                     <p className="font-medium">{selectedRoom.timeForCheckout}:00</p>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 p-4 rounded-lg">
//                   <p className="text-xs text-slate-500 mb-2">Location</p>
//                   <p className="text-sm">Lat: {selectedRoom.location?.lat}, Lng: {selectedRoom.location?.lng}</p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => {
//                       setSelectedRoom(null);
//                       openBookingModal(selectedRoom);
//                     }}
//                     disabled={!selectedRoom.isAvailable}
//                     className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
//                       selectedRoom.isAvailable
//                         ? 'bg-blue-600 text-white hover:bg-blue-700'
//                         : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                     }`}
//                   >
//                     {selectedRoom.isAvailable ? 'Book This Room' : 'Not Available'}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setSelectedRoom(null);
//                       openReviewModal(selectedRoom);
//                     }}
//                     className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
//                   >
//                     Write a Review
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Booking Modal */}
//       {showBookingModal && selectedRoomForBooking && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full">
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-slate-800">Book Room</h2>
//               <button
//                 onClick={() => setShowBookingModal(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full"
//               >
//                 <span className="material-icons">close</span>
//               </button>
//             </div>

//             <form onSubmit={createBooking} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Room
//                 </label>
//                 <input
//                   type="text"
//                   value={selectedRoomForBooking.title}
//                   disabled
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Price per night
//                 </label>
//                 <input
//                   type="text"
//                   value={formatCurrency(selectedRoomForBooking.pricePerDay)}
//                   disabled
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Check-in Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="datetime-local"
//                   required
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   value={bookingForm.bookingStartDate}
//                   onChange={(e) => setBookingForm({ ...bookingForm, bookingStartDate: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Check-out Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="datetime-local"
//                   required
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   value={bookingForm.bookingEndDate}
//                   onChange={(e) => setBookingForm({ ...bookingForm, bookingEndDate: e.target.value })}
//                 />
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
//                 >
//                   {loading ? 'Booking...' : 'Confirm Booking'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Review Modal */}
//       {showReviewModal && selectedRoomForReview && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full">
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-slate-800">
//                 {reviewForm.isEditing ? 'Update Your Review' : 'Write a Review'}
//               </h2>
//               <button
//                 onClick={() => setShowReviewModal(false)}
//                 className="p-2 hover:bg-slate-100 rounded-full"
//               >
//                 <span className="material-icons">close</span>
//               </button>
//             </div>

//             <form onSubmit={submitReview} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Room
//                 </label>
//                 <input
//                   type="text"
//                   value={selectedRoomForReview.title}
//                   disabled
//                   className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Rating <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setReviewForm({ ...reviewForm, rating: star })}
//                       className="focus:outline-none"
//                     >
//                       <span className={`material-icons text-3xl ${
//                         star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300'
//                       }`}>
//                         star
//                       </span>
//                     </button>
//                   ))}
//                   <span className="text-sm text-slate-500 ml-2">{reviewForm.rating}/5</span>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Comment (Optional)
//                 </label>
//                 <textarea
//                   rows="4"
//                   placeholder="Share your experience..."
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   value={reviewForm.comment}
//                   onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//                 />
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
//                 >
//                   {loading ? 'Submitting...' : reviewForm.isEditing ? 'Update Review' : 'Submit Review'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import 'material-icons/iconfont/material-icons.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
  const [userReviews, setUserReviews] = useState({});
  const [pendingAction, setPendingAction] = useState(null);

  // Room search filters
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    minSize: ''
  });

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    bookingStartDate: '',
    bookingEndDate: ''
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    isEditing: false,
    reviewId: null
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = Cookies.get('token');
    return !!token && Object.keys(user).length > 0;
  };

  // Show login popup instead of redirecting
  const requireAuth = (action, room) => {
    if (!isLoggedIn()) {
      setPendingAction(action);
      if (action === 'book') {
        setSelectedRoomForBooking(room);
      } else if (action === 'review') {
        setSelectedRoomForReview(room);
      }
      setShowLoginPopup(true);
      return false;
    }
    return true;
  };

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
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
    fetchAllRooms();
  }, []);

  // GET ALL ROOMS - /api/room/
  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/room/`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setRooms(data);
        setFilteredRooms(data);

        // Fetch reviews for each room
        data.forEach(room => {
          fetchRoomReviews(room._id);
        });
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // GET ROOM REVIEWS - /api/review/reviews/room/:roomId
  const fetchRoomReviews = async (roomId) => {
    try {
      const response = await fetch(`${BASE_URL}/review/reviews/room/${roomId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setUserReviews(prev => ({ ...prev, [roomId]: data.reviews || [] }));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // 1. CREATE BOOKING - POST /api/booking/create
  const createBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoomForBooking) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${BASE_URL}/booking/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          roomId: selectedRoomForBooking._id,
          bookingStartDate: new Date(bookingForm.bookingStartDate).toISOString(),
          bookingEndDate: new Date(bookingForm.bookingEndDate).toISOString()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: '✅ Room booked successfully! Check your bookings page.'
        });
        setShowBookingModal(false);
        setBookingForm({ bookingStartDate: '', bookingEndDate: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create booking' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // 2. CREATE/UPDATE REVIEW - POST /api/review/reviews & PUT /api/review/reviews/:id
  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedRoomForReview) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      if (reviewForm.isEditing) {
        // Update existing review
        response = await fetch(`${BASE_URL}/review/reviews/${reviewForm.reviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          credentials: 'include',
          body: JSON.stringify({
            rating: reviewForm.rating,
            comment: reviewForm.comment
          })
        });
      } else {
        // Create new review
        response = await fetch(`${BASE_URL}/review/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          credentials: 'include',
          body: JSON.stringify({
            roomId: selectedRoomForReview._id,
            userId: user.id,
            rating: reviewForm.rating,
            comment: reviewForm.comment
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: reviewForm.isEditing ? '✅ Review updated successfully!' : '✅ Review added successfully!'
        });
        setShowReviewModal(false);
        setReviewForm({ rating: 5, comment: '', isEditing: false, reviewId: null });

        // Refresh reviews for this room
        fetchRoomReviews(selectedRoomForReview._id);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to submit review' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Get user's review for a room
  const getUserReview = (roomId) => {
    const reviews = userReviews[roomId] || [];
    return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
  };

  // Handle search and filters
  useEffect(() => {
    let filtered = [...rooms];

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(room => room.pricePerDay >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(room => room.pricePerDay <= Number(filters.maxPrice));
    }

    // Beds filter
    if (filters.beds) {
      filtered = filtered.filter(room => room.noOfBeds >= Number(filters.beds));
    }

    // Size filter
    if (filters.minSize) {
      filtered = filtered.filter(room => room.roomSize >= Number(filters.minSize));
    }

    setFilteredRooms(filtered);
  }, [searchQuery, filters, rooms]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const openBookingModal = (room) => {
    if (!requireAuth('book', room)) return;
    setSelectedRoomForBooking(room);
    setShowBookingModal(true);
  };

  const openReviewModal = (room) => {
    if (!requireAuth('review', room)) return;

    const existingReview = getUserReview(room._id);
    if (existingReview) {
      setReviewForm({
        rating: existingReview.rating,
        comment: existingReview.comment || '',
        isEditing: true,
        reviewId: existingReview._id
      });
    } else {
      setReviewForm({
        rating: 5,
        comment: '',
        isEditing: false,
        reviewId: null
      });
    }

    setSelectedRoomForReview(room);
    setShowReviewModal(true);
  };

  const handleLoginFromPopup = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };

  const handleRegisterFromPopup = () => {
    setShowLoginPopup(false);
    navigate('/register');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Find Your Perfect Stay</h1>
        <p className="text-slate-500 mt-1">Discover and book amazing rooms</p>

        {/* Blue Login Warning Banner - Shows when not logged in */}
        {!isLoggedIn() && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-full p-2">
                  <span className="material-icons text-white text-sm">info</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Login to Book Rooms & Leave Reviews</h3>
                  <p className="text-sm text-blue-600 mt-0.5">
                    You're browsing as a guest. Sign in to book rooms and share your experiences!
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow flex items-center gap-2"
                >
                  <span className="material-icons text-sm">login</span>
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <span className="material-icons text-sm">person_add</span>
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${message.type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
          <span className={`material-icons ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="flex-1">{message.text}</span>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Search Rooms</h2>

        {/* Search Box */}
        <div className="relative mb-4">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search by room name, description, or location..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Price ($)</label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Max Price ($)</label>
            <input
              type="number"
              placeholder="1000"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Beds</label>
            <input
              type="number"
              placeholder="1"
              min="1"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
              value={filters.beds}
              onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Size (sqft)</label>
            <input
              type="number"
              placeholder="20"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
              value={filters.minSize}
              onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-slate-500">
          Found <span className="font-semibold text-blue-600">{filteredRooms.length}</span> rooms
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            const reviews = userReviews[room._id] || [];
            const avgRating = calculateAverageRating(reviews);
            const userReview = getUserReview(room._id);

            return (
              <div
                key={room._id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                {/* Room Image */}
                <div className="h-48 bg-slate-100 relative">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <span className="material-icons text-4xl text-slate-400">image</span>
                    </div>
                  )}

                  {/* Availability Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${room.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {room.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatCurrency(room.pricePerDay)} <span className="text-xs font-normal">/night</span>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{room.title}</h3>
                  <p className="text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>

                  {/* Rating Section */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`material-icons text-sm ${star <= avgRating ? 'text-amber-400' : 'text-slate-300'
                            }`}>
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                      {avgRating > 0 && (
                        <span className="text-xs font-medium text-amber-600 ml-1">
                          {avgRating}
                        </span>
                      )}
                    </div>

                    {/* Your Review Badge - Only show if logged in */}
                    {isLoggedIn() && userReview && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Your review: {userReview.rating}★
                      </span>
                    )}
                  </div>

                  {/* Room Features */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">bed</span>
                      {room.noOfBeds} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">straighten</span>
                      {room.roomSize} sqft
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">people</span>
                      {room.maxOccupancy}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (room.isAvailable) {
                          openBookingModal(room);
                        }
                      }}
                      disabled={!room.isAvailable}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${room.isAvailable
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      {room.isAvailable ? 'Book Now' : 'Unavailable'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openReviewModal(room);
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${userReview
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {userReview ? 'Update Review' : 'Write Review'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredRooms.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <span className="material-icons text-5xl text-slate-300 mb-4">search_off</span>
              <p className="text-slate-500 text-lg">No rooms found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      )}

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-md w-full transform transition-all">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Login Required</h2>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  setPendingAction(null);
                  setSelectedRoomForBooking(null);
                  setSelectedRoomForReview(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <span className="material-icons text-5xl text-blue-600 mb-3">lock</span>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {pendingAction === 'book' ? 'Want to book this room?' : 'Want to leave a review?'}
                </h3>
                <p className="text-sm text-slate-600">
                  Please login or create an account to continue
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleLoginFromPopup}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">login</span>
                  Login to Your Account
                </button>

                <button
                  onClick={handleRegisterFromPopup}
                  className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">person_add</span>
                  Create New Account
                </button>

                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    setPendingAction(null);
                    setSelectedRoomForBooking(null);
                    setSelectedRoomForReview(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              <div className="mt-6 text-center text-xs text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRoom(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">Room Details</h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="p-6">
              {/* Image Gallery */}
              {selectedRoom.images && selectedRoom.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoom.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedRoom.title} ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedRoom.title}</h3>
                  <p className="text-slate-600 mt-1">{selectedRoom.description}</p>
                </div>

                {/* Reviews Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="material-icons text-amber-400">star</span>
                    Guest Reviews ({userReviews[selectedRoom._id]?.length || 0})
                  </h4>

                  {userReviews[selectedRoom._id]?.length > 0 ? (
                    <div className="space-y-3">
                      {userReviews[selectedRoom._id].map((review) => (
                        <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-800">
                              {review.userId?.name || 'Guest'}
                              {isLoggedIn() && review.userId?._id === user.id && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`material-icons text-xs ${star <= review.rating ? 'text-amber-400' : 'text-slate-300'
                                }`}>
                                star
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No reviews yet for this room.
                    </p>
                  )}
                </div>

                {/* Room Specifications */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500">Price per night</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${selectedRoom.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {selectedRoom.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Beds</p>
                    <p className="font-medium">{selectedRoom.noOfBeds}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Room Size</p>
                    <p className="font-medium">{selectedRoom.roomSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Max Occupancy</p>
                    <p className="font-medium">{selectedRoom.maxOccupancy} guests</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Checkout Time</p>
                    <p className="font-medium">{selectedRoom.timeForCheckout}:00</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Location</p>
                  <p className="text-sm">Lat: {selectedRoom.location?.lat}, Lng: {selectedRoom.location?.lng}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {isLoggedIn() ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRoom(null);
                          openBookingModal(selectedRoom);
                        }}
                        disabled={!selectedRoom.isAvailable}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${selectedRoom.isAvailable
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        {selectedRoom.isAvailable ? 'Book This Room' : 'Not Available'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoom(null);
                          openReviewModal(selectedRoom);
                        }}
                        className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
                      >
                        Write a Review
                      </button>
                    </>
                  ) : (
                    <div className="w-full">
                      <button
                        onClick={() => {
                          setSelectedRoom(null);
                          setShowLoginPopup(true);
                          setPendingAction('book');
                          setSelectedRoomForBooking(selectedRoom);
                        }}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                      >
                        Login to Book
                      </button>
                      <p className="text-xs text-center text-slate-500 mt-2">
                        New user?{' '}
                        <button
                          onClick={() => {
                            setSelectedRoom(null);
                            setShowLoginPopup(true);
                            setPendingAction('register');
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Register here
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal - Only accessible if logged in */}
      {showBookingModal && selectedRoomForBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Book Room</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={createBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={selectedRoomForBooking.title}
                  disabled
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price per night
                </label>
                <input
                  type="text"
                  value={formatCurrency(selectedRoomForBooking.pricePerDay)}
                  disabled
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  value={bookingForm.bookingStartDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingStartDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  value={bookingForm.bookingEndDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingEndDate: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal - Only accessible if logged in */}
      {showReviewModal && selectedRoomForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {reviewForm.isEditing ? 'Update Your Review' : 'Write a Review'}
              </h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={submitReview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={selectedRoomForReview.title}
                  disabled
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <span className={`material-icons text-3xl ${star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300'
                        }`}>
                        star
                      </span>
                    </button>
                  ))}
                  <span className="text-sm text-slate-500 ml-2">{reviewForm.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Comment (Optional)
                </label>
                <textarea
                  rows="4"
                  placeholder="Share your experience..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : reviewForm.isEditing ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;