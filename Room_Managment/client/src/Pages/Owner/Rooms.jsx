// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import 'material-icons/iconfont/material-icons.css';

// const OwnerRooms = () => {
//   const [activeTab, setActiveTab] = useState('list');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [user, setUser] = useState({});
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [roomReviews, setRoomReviews] = useState({});
//   const [loadingReviews, setLoadingReviews] = useState({});
  
//   // Form states
//   const [createForm, setCreateForm] = useState({
//     title: '',
//     description: '',
//     noOfBeds: 1,
//     roomSize: 0,
//     maxOccupancy: 1,
//     pricePerDay: 0,
//     timeForCheckout: 12,
//     location: {
//       lat: 40.7128,
//       lng: -74.0060
//     }
//   });

//   // Image upload state for create room
//   const [roomImages, setRoomImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   // Separate image upload for existing rooms
//   const [imageUpload, setImageUpload] = useState({
//     roomId: '',
//     image: null,
//     preview: null
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
//   }, []);

//   // Fetch rooms when user is loaded
//   useEffect(() => {
//     if (user.id) {
//       fetchOwnerRooms();
//     }
//   }, [user]);

//   // GET OWNER ROOMS - /api/room/
//   const fetchOwnerRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         // Filter rooms by owner ID to show only current owner's rooms
//         const ownerRooms = data.filter(room => room.ownerId === user.id);
//         setRooms(ownerRooms);
        
//         // Fetch reviews for each room
//         ownerRooms.forEach(room => {
//           fetchRoomReviews(room._id);
//         });
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
//       setLoadingReviews(prev => ({ ...prev, [roomId]: true }));
//       const response = await fetch(`${BASE_URL}/review/reviews/room/${roomId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setRoomReviews(prev => ({ ...prev, [roomId]: data.reviews || [] }));
//       }
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       setRoomReviews(prev => ({ ...prev, [roomId]: [] }));
//     } finally {
//       setLoadingReviews(prev => ({ ...prev, [roomId]: false }));
//     }
//   };

//   // GET REVIEW BY ID - /api/review/reviews/:reviewId
//   const fetchReviewById = async (reviewId) => {
//     try {
//       const response = await fetch(`${BASE_URL}/review/reviews/${reviewId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         return data.review;
//       }
//     } catch (error) {
//       console.error('Error fetching review:', error);
//     }
//     return null;
//   };

//   // Upload multiple images function
//   const uploadRoomImages = async (roomId, images) => {
//     const uploadPromises = images.map(async (image) => {
//       const formData = new FormData();
//       formData.append('image', image);
//       formData.append('roomId', roomId);

//       try {
//         const response = await fetch(`${BASE_URL}/room/upload-image`, {
//           method: 'POST',
//           headers: getAuthHeaders(),
//           credentials: 'include',
//           body: formData
//         });
//         return await response.json();
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         return null;
//       }
//     });

//     const results = await Promise.all(uploadPromises);
//     return results.filter(result => result && result.ok !== false);
//   };

//   // 1. CREATE ROOM WITH IMAGES - POST /api/room/ + POST /api/room/upload-image
//   const createRoom = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       // First create the room
//       const roomResponse = await fetch(`${BASE_URL}/room/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders()
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           ...createForm,
//           ownerId: user.id
//         })
//       });

//       const roomData = await roomResponse.json();

//       if (roomResponse.ok) {
//         const roomId = roomData._id || roomData.room?._id;
        
//         // Then upload images if any
//         if (roomImages.length > 0 && roomId) {
//           const uploadResults = await uploadRoomImages(roomId, roomImages);
//           if (uploadResults.length > 0) {
//             setMessage({ 
//               type: 'success', 
//               text: `✅ Room created with ${uploadResults.length} image(s) uploaded!` 
//             });
//           } else {
//             setMessage({ 
//               type: 'success', 
//               text: '✅ Room created successfully! (No images uploaded)' 
//             });
//           }
//         } else {
//           setMessage({ 
//             type: 'success', 
//             text: '✅ Room created successfully!' 
//           });
//         }

//         // Reset form
//         setCreateForm({
//           title: '',
//           description: '',
//           noOfBeds: 1,
//           roomSize: 0,
//           maxOccupancy: 1,
//           pricePerDay: 0,
//           timeForCheckout: 12,
//           location: {
//             lat: 40.7128,
//             lng: -74.0060
//           }
//         });
//         setRoomImages([]);
//         setImagePreviews([]);
        
//         fetchOwnerRooms();
//         setActiveTab('list');
//       } else {
//         setMessage({ type: 'error', text: roomData.message || 'Failed to create room' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Something went wrong' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // Handle multiple image selection
//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setRoomImages(prev => [...prev, ...files]);
    
//     // Create previews
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(prev => [...prev, ...newPreviews]);
//   };

//   // Remove image from selection
//   const removeImage = (index) => {
//     setRoomImages(prev => prev.filter((_, i) => i !== index));
//     setImagePreviews(prev => {
//       // Revoke object URL to avoid memory leaks
//       URL.revokeObjectURL(prev[index]);
//       return prev.filter((_, i) => i !== index);
//     });
//   };

//   // 2. UPLOAD SINGLE IMAGE - POST /api/room/upload-image (for existing rooms)
//   const uploadImage = async (e) => {
//     e.preventDefault();
//     if (!imageUpload.roomId || !imageUpload.image) {
//       setMessage({ type: 'error', text: 'Please select a room and image' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     const formData = new FormData();
//     formData.append('image', imageUpload.image);
//     formData.append('roomId', imageUpload.roomId);

//     try {
//       const response = await fetch(`${BASE_URL}/room/upload-image`, {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         credentials: 'include',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: '✅ Image uploaded successfully!' });
//         setImageUpload({ roomId: '', image: null, preview: null });
//         fetchOwnerRooms();
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to upload image' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error uploading image' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // 3. GET ROOM BY ID - /api/room/:id
//   const fetchRoomById = async (roomId) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/${roomId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setSelectedRoom(data);
//         // Fetch reviews for the selected room
//         await fetchRoomReviews(roomId);
//       }
//     } catch (error) {
//       console.error('Error fetching room:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 5. DELETE ROOM - DELETE /api/room/:id
//   const deleteRoom = async (roomId) => {
//     if (!window.confirm('Are you sure you want to delete this room?')) return;

//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/${roomId}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: '✅ Room deleted successfully' });
//         fetchOwnerRooms();
//         if (selectedRoom?._id === roomId) {
//           setSelectedRoom(null);
//         }
//         // Clear reviews for deleted room
//         setRoomReviews(prev => {
//           const newReviews = { ...prev };
//           delete newReviews[roomId];
//           return newReviews;
//         });
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to delete room' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error deleting room' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // 6. TOGGLE AVAILABILITY - PUT /api/room/:id/availability
//   const toggleAvailability = async (roomId, currentStatus) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/${roomId}/availability`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ 
//           type: 'success', 
//           text: `✅ Room marked as ${!currentStatus ? 'available' : 'unavailable'}` 
//         });
//         fetchOwnerRooms();
//         if (selectedRoom?._id === roomId) {
//           setSelectedRoom({ ...selectedRoom, isAvailable: !currentStatus });
//         }
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to update availability' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error updating availability' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // 7. SEARCH ROOMS - POST /api/room/search
//   const searchRooms = async () => {
//     if (!searchQuery.trim()) {
//       setMessage({ type: 'error', text: 'Please enter a search query' });
//       return;
//     }

//     try {
//       setLoading(true);
//       setIsSearching(true);
//       const response = await fetch(`${BASE_URL}/room/search`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders()
//         },
//         credentials: 'include',
//         body: JSON.stringify({ searchQuery })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSearchResults(data.rooms || []);
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Search failed' });
//       }
//     } catch (error) {
//       console.error('Error searching rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('location.')) {
//       const locationField = name.split('.')[1];
//       setCreateForm(prev => ({
//         ...prev,
//         location: {
//           ...prev.location,
//           [locationField]: parseFloat(value) || 0
//         }
//       }));
//     } else {
//       setCreateForm(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageUpload({
//         ...imageUpload,
//         image: file,
//         preview: URL.createObjectURL(file)
//       });
//     }
//   };

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

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-800">My Rooms</h1>
//           <p className="text-sm text-slate-500 mt-1">
//             You have <span className="font-semibold text-blue-600">{rooms.length}</span> rooms listed
//           </p>
//         </div>
//         <button
//           onClick={() => setActiveTab('create')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
//         >
//           <span className="material-icons text-sm">add</span>
//           Add New Room
//         </button>
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

//       {/* Tabs */}
//       <div className="border-b border-slate-200 mb-6 overflow-x-auto">
//         <nav className="flex gap-6 min-w-max">
//           <button
//             onClick={() => setActiveTab('list')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'list'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             My Rooms List ({rooms.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('create')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'create'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Create Room
//           </button>
//           <button
//             onClick={() => setActiveTab('upload')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'upload'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Upload Image
//           </button>
//           <button
//             onClick={() => setActiveTab('search')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'search'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Search Rooms
//           </button>
//         </nav>
//       </div>

//       {/* MY ROOMS LIST TAB - WITH REAL REVIEWS */}
//       {activeTab === 'list' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-slate-800">My Rooms</h2>
//             <button
//               onClick={fetchOwnerRooms}
//               className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
//             >
//               <span className="material-icons text-sm">refresh</span>
//               Refresh
//             </button>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center py-12">
//               <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//             </div>
//           ) : rooms.length === 0 ? (
//             <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
//               <span className="material-icons text-5xl text-slate-300 mb-4">meeting_room</span>
//               <p className="text-slate-500 text-lg">No rooms found</p>
//               <p className="text-slate-400 text-sm mt-1">You haven't created any rooms yet.</p>
//               <button
//                 onClick={() => setActiveTab('create')}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
//               >
//                 Create Your First Room
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {rooms.map((room) => {
//                 const reviews = roomReviews[room._id] || [];
//                 const averageRating = reviews.length > 0 
//                   ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
//                   : 0;
//                 const loadingReview = loadingReviews[room._id];
                
//                 return (
//                   <div key={room._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className="h-48 bg-slate-100 relative">
//                       {room.images && room.images.length > 0 ? (
//                         <img 
//                           src={room.images[0]} 
//                           alt={room.title}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                           <span className="material-icons text-4xl text-slate-400">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-2 right-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           room.isAvailable 
//                             ? 'bg-green-100 text-green-700' 
//                             : 'bg-amber-100 text-amber-700'
//                         }`}>
//                           {room.isAvailable ? 'Available' : 'Booked'}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-semibold text-slate-800 mb-1">{room.title}</h3>
//                       <p className="text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>
                      
//                       {/* Rating Stars - Real Data */}
//                       <div className="flex items-center gap-1 mb-2">
//                         {loadingReview ? (
//                           <div className="flex items-center gap-1">
//                             <div className="w-16 h-4 bg-slate-200 animate-pulse rounded"></div>
//                           </div>
//                         ) : (
//                           <>
//                             <div className="flex">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <span key={star} className={`material-icons text-sm ${
//                                   star <= averageRating ? 'text-amber-400' : 'text-slate-300'
//                                 }`}>
//                                   star
//                                 </span>
//                               ))}
//                             </div>
//                             <span className="text-xs text-slate-500">
//                               ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
//                             </span>
//                             {averageRating > 0 && (
//                               <span className="text-xs font-medium text-amber-600">
//                                 {averageRating}
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>

//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-lg font-bold text-blue-600">{formatCurrency(room.pricePerDay)}</span>
//                         <span className="text-xs text-slate-500">per night</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">bed</span>
//                           {room.noOfBeds} bed
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">straighten</span>
//                           {room.roomSize} m²
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">people</span>
//                           {room.maxOccupancy}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => fetchRoomById(room._id)}
//                           className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
//                         >
//                           View Details
//                         </button>
//                         <button
//                           onClick={() => toggleAvailability(room._id, room.isAvailable)}
//                           className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
//                             room.isAvailable
//                               ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                               : 'bg-green-100 text-green-700 hover:bg-green-200'
//                           }`}
//                         >
//                           {room.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
//                         </button>
//                         <button
//                           onClick={() => deleteRoom(room._id)}
//                           className="px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-200 transition-colors"
//                         >
//                           <span className="material-icons text-sm">delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* CREATE ROOM TAB - WITH IMAGE UPLOAD */}
//       {activeTab === 'create' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">Create New Room</h2>
          
//           <form onSubmit={createRoom} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={createForm.title}
//                   onChange={handleCreateInputChange}
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Price Per Day ($) <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="pricePerDay"
//                   value={createForm.pricePerDay}
//                   onChange={handleCreateInputChange}
//                   min="0"
//                   step="0.01"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={createForm.description}
//                 onChange={handleCreateInputChange}
//                 rows="3"
//                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Number of Beds
//                 </label>
//                 <input
//                   type="number"
//                   name="noOfBeds"
//                   value={createForm.noOfBeds}
//                   onChange={handleCreateInputChange}
//                   min="1"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Room Size (m²)
//                 </label>
//                 <input
//                   type="number"
//                   name="roomSize"
//                   value={createForm.roomSize}
//                   onChange={handleCreateInputChange}
//                   min="0"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Max Occupancy
//                 </label>
//                 <input
//                   type="number"
//                   name="maxOccupancy"
//                   value={createForm.maxOccupancy}
//                   onChange={handleCreateInputChange}
//                   min="1"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Checkout Time (hour)
//                 </label>
//                 <input
//                   type="number"
//                   name="timeForCheckout"
//                   value={createForm.timeForCheckout}
//                   onChange={handleCreateInputChange}
//                   min="0"
//                   max="23"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Location Coordinates
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="number"
//                     name="location.lat"
//                     value={createForm.location.lat}
//                     onChange={handleCreateInputChange}
//                     placeholder="Latitude"
//                     step="0.0001"
//                     className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   />
//                   <input
//                     type="number"
//                     name="location.lng"
//                     value={createForm.location.lng}
//                     onChange={handleCreateInputChange}
//                     placeholder="Longitude"
//                     step="0.0001"
//                     className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Image Upload Section */}
//             <div className="border-t border-slate-200 pt-4">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Upload Room Images (Optional - You can upload multiple)
//               </label>
//               <div className="flex items-center gap-4">
//                 <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                   <span className="flex items-center gap-2">
//                     <span className="material-icons text-sm">add_photo_alternate</span>
//                     Select Images
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                 </label>
//                 <span className="text-xs text-slate-500">
//                   {roomImages.length} image(s) selected
//                 </span>
//               </div>

//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="mt-4">
//                   <p className="text-sm text-slate-700 mb-2">Image Previews:</p>
//                   <div className="flex flex-wrap gap-4">
//                     {imagePreviews.map((preview, index) => (
//                       <div key={index} className="relative">
//                         <img 
//                           src={preview} 
//                           alt={`Preview ${index + 1}`} 
//                           className="w-24 h-24 object-cover rounded-lg border border-slate-200"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                         >
//                           <span className="material-icons text-xs">close</span>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="pt-6 border-t border-slate-100">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Creating Room...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-icons">add</span>
//                     CREATE ROOM {roomImages.length > 0 ? `WITH ${roomImages.length} IMAGE(S)` : ''}
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* UPLOAD IMAGE TAB (for existing rooms) */}
//       {activeTab === 'upload' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Additional Images</h2>
          
//           <form onSubmit={uploadImage} className="max-w-md space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Select Room
//               </label>
//               <select
//                 value={imageUpload.roomId}
//                 onChange={(e) => setImageUpload({ ...imageUpload, roomId: e.target.value })}
//                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 required
//               >
//                 <option value="">Choose a room...</option>
//                 {rooms.map((room) => (
//                   <option key={room._id} value={room._id}>
//                     {room.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Choose Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 required
//               />
//             </div>

//             {imageUpload.preview && (
//               <div className="mt-4">
//                 <p className="text-sm text-slate-700 mb-2">Preview:</p>
//                 <img 
//                   src={imageUpload.preview} 
//                   alt="Preview" 
//                   className="w-full h-48 object-cover rounded-lg border border-slate-200"
//                 />
//               </div>
//             )}

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={loading || !imageUpload.roomId || !imageUpload.image}
//                 className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
//               >
//                 {loading ? 'Uploading...' : 'Upload Image'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* SEARCH ROOMS TAB */}
//       {activeTab === 'search' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">Search Rooms</h2>
          
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 relative">
//               <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
//               <input
//                 type="text"
//                 placeholder="Search by room size, price, etc..."
//                 className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={searchRooms}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
//             >
//               Search
//             </button>
//           </div>

//           {isSearching && (
//             <div>
//               <h3 className="text-sm font-medium text-slate-700 mb-3">Search Results ({searchResults.length})</h3>
//               {searchResults.length === 0 ? (
//                 <p className="text-slate-500 text-sm">No rooms found matching your search.</p>
//               ) : (
//                 <div className="space-y-3">
//                   {searchResults.map((room) => (
//                     <div key={room._id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h4 className="font-medium text-slate-800">{room.title}</h4>
//                           <p className="text-xs text-slate-500">{room.description}</p>
//                           <div className="flex gap-4 mt-2 text-xs text-slate-500">
//                             <span>Size: {room.roomSize} m²</span>
//                             <span>Beds: {room.noOfBeds}</span>
//                             <span>Price: {formatCurrency(room.pricePerDay)}/night</span>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => fetchRoomById(room._id)}
//                           className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ROOM DETAILS MODAL - WITH REAL REVIEWS */}
//       {selectedRoom && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
//                         className="w-full h-32 object-cover rounded-lg"
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

//                 {/* Reviews Section in Modal - Real Data */}
//                 <div className="bg-slate-50 p-4 rounded-lg">
//                   <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
//                     <span className="material-icons text-amber-400">star</span>
//                     Guest Reviews ({roomReviews[selectedRoom._id]?.length || 0})
//                   </h4>
//                   {loadingReviews[selectedRoom._id] ? (
//                     <div className="space-y-2">
//                       <div className="h-16 bg-slate-200 animate-pulse rounded"></div>
//                       <div className="h-16 bg-slate-200 animate-pulse rounded"></div>
//                     </div>
//                   ) : roomReviews[selectedRoom._id]?.length > 0 ? (
//                     <div className="space-y-3">
//                       {roomReviews[selectedRoom._id].map((review) => (
//                         <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-slate-800">
//                               {review.userId?.name || 'Guest'}
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
//                     <p className="font-medium">{selectedRoom.roomSize} m²</p>
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

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => toggleAvailability(selectedRoom._id, selectedRoom.isAvailable)}
//                     className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                       selectedRoom.isAvailable
//                         ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                         : 'bg-green-100 text-green-700 hover:bg-green-200'
//                     }`}
//                   >
//                     {selectedRoom.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setActiveTab('upload');
//                       setImageUpload({ ...imageUpload, roomId: selectedRoom._id });
//                       setSelectedRoom(null);
//                     }}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
//                   >
//                     Upload Image
//                   </button>
//                   <button
//                     onClick={() => deleteRoom(selectedRoom._id)}
//                     className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OwnerRooms;

















// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import 'material-icons/iconfont/material-icons.css';

// const OwnerRooms = () => {
//   const [activeTab, setActiveTab] = useState('list');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [user, setUser] = useState({});
//   const [ownerProfile, setOwnerProfile] = useState({}); // Store complete owner profile
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [roomReviews, setRoomReviews] = useState({});
//   const [loadingReviews, setLoadingReviews] = useState({});
//   const [useOwnerLocation, setUseOwnerLocation] = useState(true); // Toggle for using owner location
  
//   // Country, State, City API states
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');
//   const [loadingLocation, setLoadingLocation] = useState(false);

//   // Edit room states
//   const [editMode, setEditMode] = useState(false);
//   const [editForm, setEditForm] = useState({
//     title: '',
//     description: '',
//     noOfBeds: 1,
//     roomSize: 0,
//     maxOccupancy: 1,
//     pricePerDay: 0,
//     timeForCheckout: 12,
//     location: {
//       latitude: 0,
//       longitude: 0,
//       country: '',
//       state: '',
//       city: ''
//     }
//   });

//   // Form states for create with complete location
//   const [createForm, setCreateForm] = useState({
//     title: '',
//     description: '',
//     noOfBeds: 1,
//     roomSize: 0,
//     maxOccupancy: 1,
//     pricePerDay: 0,
//     timeForCheckout: 12,
//     location: {
//       latitude: 40.7128,
//       longitude: -74.0060,
//       country: '',
//       state: '',
//       city: ''
//     }
//   });

//   // Image upload state for create room
//   const [roomImages, setRoomImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);

//   // Separate image upload for existing rooms
//   const [imageUpload, setImageUpload] = useState({
//     roomId: '',
//     image: null,
//     preview: null
//   });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const LOCATION_API_KEY = 'e42d26fd2748415b32f2dc6a2cb00d9662c4425c4130ce446ceb0b4936001ded';

//   // Get auth headers with token
//   const getAuthHeaders = () => {
//     const token = Cookies.get('token');
//     return {
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // Fetch all countries on component mount
//   useEffect(() => {
//     fetchAllCountries();
//   }, []);

//   // Fetch all countries
//   const fetchAllCountries = async () => {
//     try {
//       setLoadingLocation(true);
//       const response = await fetch('https://api.countrystatecity.in/v1/countries', {
//         method: 'GET',
//         headers: {
//           'X-CSCAPI-KEY': LOCATION_API_KEY
//         }
//       });

//       const data = await response.json();
      
//       if (Array.isArray(data)) {
//         setCountries(data);
//         console.log('All Countries loaded:', data.length);
//       } else {
//         console.error('Error loading countries:', data);
//       }
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     } finally {
//       setLoadingLocation(false);
//     }
//   };

//   // Fetch states based on selected country
//   const fetchStatesByCountry = async (countryCode) => {
//     if (!countryCode) {
//       setStates([]);
//       return;
//     }
    
//     try {
//       setLoadingLocation(true);
//       const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
//         method: 'GET',
//         headers: {
//           'X-CSCAPI-KEY': LOCATION_API_KEY
//         }
//       });

//       const data = await response.json();
      
//       if (Array.isArray(data)) {
//         setStates(data);
//         console.log('States loaded:', data.length);
//       } else {
//         console.error('Error loading states:', data);
//         setStates([]);
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//       setStates([]);
//     } finally {
//       setLoadingLocation(false);
//     }
//   };

//   // Fetch cities based on selected country and state
//   const fetchCitiesByState = async (countryCode, stateCode) => {
//     if (!countryCode || !stateCode) {
//       setCities([]);
//       return;
//     }
    
//     try {
//       setLoadingLocation(true);
//       const response = await fetch(
//         `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
//         {
//           method: 'GET',
//           headers: {
//             'X-CSCAPI-KEY': LOCATION_API_KEY
//           }
//         }
//       );

//       const data = await response.json();
      
//       if (Array.isArray(data)) {
//         setCities(data);
//         console.log('Cities loaded:', data.length);
//       } else {
//         console.error('Error loading cities:', data);
//         setCities([]);
//       }
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//       setCities([]);
//     } finally {
//       setLoadingLocation(false);
//     }
//   };

//   // Load user data on mount
//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//       // Fetch complete owner profile including location
//       if (parsedUser.id) {
//         fetchOwnerProfile(parsedUser.id);
//       }
//     }
//   }, []);

//   // Fetch owner profile to get location
//   const fetchOwnerProfile = async (userId) => {
//     try {
//       const response = await fetch(`${BASE_URL}/user/${userId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setOwnerProfile(data);
        
//         // Update create form with owner's complete location if available
//         if (data.location) {
//           setCreateForm(prev => ({
//             ...prev,
//             location: {
//               latitude: data.location.latitude || prev.location.latitude,
//               longitude: data.location.longitude || prev.location.longitude,
//               country: data.location.country || prev.location.country,
//               state: data.location.state || prev.location.state,
//               city: data.location.city || prev.location.city
//             }
//           }));

//           // Set selected country, state, city for dropdowns
//           if (data.location.country) {
//             setSelectedCountry(data.location.country);
//             fetchStatesByCountry(data.location.country);
//           }
//           if (data.location.state) {
//             setSelectedState(data.location.state);
//             if (data.location.country) {
//               fetchCitiesByState(data.location.country, data.location.state);
//             }
//           }
//           if (data.location.city) {
//             setSelectedCity(data.location.city);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching owner profile:', error);
//     }
//   };

//   // Fetch rooms when user is loaded
//   useEffect(() => {
//     if (user.id) {
//       fetchOwnerRooms();
//     }
//   }, [user]);

//   // GET OWNER ROOMS - /api/room/
//   const fetchOwnerRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         // Filter rooms by owner ID to show only current owner's rooms
//         const ownerRooms = data.filter(room => room.ownerId === user.id || room.ownerId?._id === user.id);
//         setRooms(ownerRooms);
        
//         // Fetch reviews for each room
//         ownerRooms.forEach(room => {
//           fetchRoomReviews(room._id);
//         });
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
//       setLoadingReviews(prev => ({ ...prev, [roomId]: true }));
//       const response = await fetch(`${BASE_URL}/review/reviews/room/${roomId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setRoomReviews(prev => ({ ...prev, [roomId]: data.reviews || [] }));
//       }
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       setRoomReviews(prev => ({ ...prev, [roomId]: [] }));
//     } finally {
//       setLoadingReviews(prev => ({ ...prev, [roomId]: false }));
//     }
//   };

//   // Upload multiple images function
//   const uploadRoomImages = async (roomId, images) => {
//     const uploadPromises = images.map(async (image) => {
//       const formData = new FormData();
//       formData.append('image', image);
//       formData.append('roomId', roomId);

//       try {
//         const response = await fetch(`${BASE_URL}/room/upload-image`, {
//           method: 'POST',
//           headers: getAuthHeaders(),
//           credentials: 'include',
//           body: formData
//         });
//         return await response.json();
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         return null;
//       }
//     });

//     const results = await Promise.all(uploadPromises);
//     return results.filter(result => result && result.ok !== false);
//   };

//   // CREATE ROOM WITH IMAGES
//   const createRoom = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       // Determine which location to send
//       let roomLocation = createForm.location;
      
//       // If using owner location, fetch the latest owner profile
//       if (useOwnerLocation && ownerProfile.location) {
//         roomLocation = {
//           latitude: ownerProfile.location.latitude || 0,
//           longitude: ownerProfile.location.longitude || 0,
//           country: selectedCountry || ownerProfile.location.country || '',
//           state: selectedState || ownerProfile.location.state || '',
//           city: selectedCity || ownerProfile.location.city || ''
//         };
//       } else {
//         // Use manually entered location from dropdowns
//         roomLocation = {
//           latitude: createForm.location.latitude || 0,
//           longitude: createForm.location.longitude || 0,
//           country: selectedCountry || '',
//           state: selectedState || '',
//           city: selectedCity || ''
//         };
//       }

//       // First create the room
//       const roomResponse = await fetch(`${BASE_URL}/room/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders()
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           title: createForm.title,
//           description: createForm.description,
//           noOfBeds: createForm.noOfBeds,
//           roomSize: createForm.roomSize,
//           maxOccupancy: createForm.maxOccupancy,
//           pricePerDay: createForm.pricePerDay,
//           timeForCheckout: createForm.timeForCheckout,
//           images: [],
//           ownerId: user.id,
//           location: roomLocation
//         })
//       });

//       const roomData = await roomResponse.json();

//       if (roomResponse.ok) {
//         const roomId = roomData._id || roomData.room?._id;
        
//         // Then upload images if any
//         if (roomImages.length > 0 && roomId) {
//           const uploadResults = await uploadRoomImages(roomId, roomImages);
//           if (uploadResults.length > 0) {
//             setMessage({ 
//               type: 'success', 
//               text: `✅ Room created with ${uploadResults.length} image(s) uploaded!` 
//             });
//           } else {
//             setMessage({ 
//               type: 'success', 
//               text: '✅ Room created successfully! (No images uploaded)' 
//             });
//           }
//         } else {
//           setMessage({ 
//             type: 'success', 
//             text: '✅ Room created successfully!' 
//           });
//         }

//         // Reset form
//         setCreateForm({
//           title: '',
//           description: '',
//           noOfBeds: 1,
//           roomSize: 0,
//           maxOccupancy: 1,
//           pricePerDay: 0,
//           timeForCheckout: 12,
//           location: {
//             latitude: ownerProfile.location?.latitude || 40.7128,
//             longitude: ownerProfile.location?.longitude || -74.0060,
//             country: '',
//             state: '',
//             city: ''
//           }
//         });
//         setSelectedCountry('');
//         setSelectedState('');
//         setSelectedCity('');
//         setUseOwnerLocation(true);
//         setRoomImages([]);
//         setImagePreviews([]);
        
//         fetchOwnerRooms();
//         setActiveTab('list');
//       } else {
//         setMessage({ type: 'error', text: roomData.message || 'Failed to create room' });
//       }
//     } catch (error) {
//       console.error('Error creating room:', error);
//       setMessage({ type: 'error', text: 'Something went wrong' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // UPDATE ROOM - PUT /api/room/:roomId
//   const updateRoom = async (e) => {
//     e.preventDefault();
//     if (!selectedRoom) return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const response = await fetch(`${BASE_URL}/room/${selectedRoom._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders()
//         },
//         credentials: 'include',
//         body: JSON.stringify(editForm)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ 
//           type: 'success', 
//           text: '✅ Room updated successfully!' 
//         });
//         setEditMode(false);
//         setSelectedRoom(null);
//         fetchOwnerRooms(); 
//       } else {
//         setMessage({ 
//           type: 'error', 
//           text: data.message || 'Failed to update room' 
//         });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error updating room' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // Open edit modal with room data
//   const openEditModal = (room) => {
//     setEditForm({
//       title: room.title || '',
//       description: room.description || '',
//       noOfBeds: room.noOfBeds || 1,
//       roomSize: room.roomSize || 0,
//       maxOccupancy: room.maxOccupancy || 1,
//       pricePerDay: room.pricePerDay || 0,
//       timeForCheckout: room.timeForCheckout || 12,
//       location: {
//         latitude: room.location?.latitude || 0,
//         longitude: room.location?.longitude || 0,
//         country: room.location?.country || '',
//         state: room.location?.state || '',
//         city: room.location?.city || ''
//       }
//     });
//     setSelectedRoom(room);
//     setEditMode(true);
//   };

//   // Handle multiple image selection
//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setRoomImages(prev => [...prev, ...files]);
    
//     // Create previews
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(prev => [...prev, ...newPreviews]);
//   };

//   // Remove image from selection
//   const removeImage = (index) => {
//     setRoomImages(prev => prev.filter((_, i) => i !== index));
//     setImagePreviews(prev => {
//       // Revoke object URL to avoid memory leaks
//       URL.revokeObjectURL(prev[index]);
//       return prev.filter((_, i) => i !== index);
//     });
//   };

//   // UPLOAD SINGLE IMAGE - for existing rooms
//   const uploadImage = async (e) => {
//     e.preventDefault();
//     if (!imageUpload.roomId || !imageUpload.image) {
//       setMessage({ type: 'error', text: 'Please select a room and image' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     const formData = new FormData();
//     formData.append('image', imageUpload.image);
//     formData.append('roomId', imageUpload.roomId);

//     try {
//       const response = await fetch(`${BASE_URL}/room/upload-image`, {
//         method: 'POST',
//         headers: getAuthHeaders(),
//         credentials: 'include',
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: '✅ Image uploaded successfully!' });
//         setImageUpload({ roomId: '', image: null, preview: null });
//         fetchOwnerRooms();
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to upload image' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error uploading image' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // GET ROOM BY ID
//   const fetchRoomById = async (roomId) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/${roomId}`, {
//         method: 'GET',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setSelectedRoom(data);
//         // Fetch reviews for the selected room
//         await fetchRoomReviews(roomId);
//       }
//     } catch (error) {
//       console.error('Error fetching room:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DELETE ROOM
//   const deleteRoom = async (roomId) => {
//     if (!window.confirm('Are you sure you want to delete this room?')) return;

//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/${roomId}`, {
//         method: 'DELETE',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ type: 'success', text: '✅ Room deleted successfully' });
//         fetchOwnerRooms();
//         if (selectedRoom?._id === roomId) {
//           setSelectedRoom(null);
//         }
//         // Clear reviews for deleted room
//         setRoomReviews(prev => {
//           const newReviews = { ...prev };
//           delete newReviews[roomId];
//           return newReviews;
//         });
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to delete room' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error deleting room' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // TOGGLE AVAILABILITY
//   const toggleAvailability = async (roomId, currentStatus) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${BASE_URL}/room/${roomId}/availability`, {
//         method: 'PUT',
//         headers: getAuthHeaders(),
//         credentials: 'include'
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({ 
//           type: 'success', 
//           text: `✅ Room marked as ${!currentStatus ? 'available' : 'unavailable'}` 
//         });
//         fetchOwnerRooms();
//         if (selectedRoom?._id === roomId) {
//           setSelectedRoom({ ...selectedRoom, isAvailable: !currentStatus });
//         }
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Failed to update availability' });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Error updating availability' });
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // SEARCH ROOMS
//   const searchRooms = async () => {
//     if (!searchQuery.trim()) {
//       setMessage({ type: 'error', text: 'Please enter a search query' });
//       return;
//     }

//     try {
//       setLoading(true);
//       setIsSearching(true);
//       const response = await fetch(`${BASE_URL}/room/search`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeaders()
//         },
//         credentials: 'include',
//         body: JSON.stringify({ searchQuery })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSearchResults(data.rooms || []);
//       } else {
//         setMessage({ type: 'error', text: data.message || 'Search failed' });
//       }
//     } catch (error) {
//       console.error('Error searching rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('location.')) {
//       const locationField = name.split('.')[1];
//       setCreateForm(prev => ({
//         ...prev,
//         location: {
//           ...prev.location,
//           [locationField]: locationField === 'latitude' || locationField === 'longitude' 
//             ? parseFloat(value) || 0 
//             : value
//         }
//       }));
//     } else {
//       setCreateForm(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleEditInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('location.')) {
//       const locationField = name.split('.')[1];
//       setEditForm(prev => ({
//         ...prev,
//         location: {
//           ...prev.location,
//           [locationField]: locationField === 'latitude' || locationField === 'longitude' 
//             ? parseFloat(value) || 0 
//             : value
//         }
//       }));
//     } else {
//       setEditForm(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageUpload({
//         ...imageUpload,
//         image: file,
//         preview: URL.createObjectURL(file)
//       });
//     }
//   };

//   const handleCountryChange = (e) => {
//     const countryCode = e.target.value;
//     setSelectedCountry(countryCode);
//     setSelectedState('');
//     setSelectedCity('');
//     setStates([]);
//     setCities([]);
    
//     // Update create form
//     setCreateForm(prev => ({
//       ...prev,
//       location: {
//         ...prev.location,
//         country: countryCode,
//         state: '',
//         city: ''
//       }
//     }));
    
//     if (countryCode) {
//       fetchStatesByCountry(countryCode);
//     }
//   };

//   const handleStateChange = (e) => {
//     const stateCode = e.target.value;
//     setSelectedState(stateCode);
//     setSelectedCity('');
//     setCities([]);
    
//     // Update create form
//     setCreateForm(prev => ({
//       ...prev,
//       location: {
//         ...prev.location,
//         state: stateCode,
//         city: ''
//       }
//     }));
    
//     if (selectedCountry && stateCode) {
//       fetchCitiesByState(selectedCountry, stateCode);
//     }
//   };

//   const handleCityChange = (e) => {
//     const cityName = e.target.value;
//     setSelectedCity(cityName);
    
//     // Update create form
//     setCreateForm(prev => ({
//       ...prev,
//       location: {
//         ...prev.location,
//         city: cityName
//       }
//     }));
//   };

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

//   // Function to refresh owner location
//   const refreshOwnerLocation = async () => {
//     if (user.id) {
//       await fetchOwnerProfile(user.id);
//       setMessage({ type: 'success', text: '✅ Owner location refreshed!' });
//       setTimeout(() => setMessage({ type: '', text: '' }), 3000);
//     }
//   };

//   // Get country name from code
//   const getCountryName = (code) => {
//     if (!code || !Array.isArray(countries)) return code;
//     const country = countries.find(c => c.iso2 === code);
//     return country ? country.name : code;
//   };

//   // Get state name from code
//   const getStateName = (code) => {
//     if (!code || !Array.isArray(states)) return code;
//     const state = states.find(s => s.iso2 === code);
//     return state ? state.name : code;
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-800">My Rooms</h1>
//           <p className="text-sm text-slate-500 mt-1">
//             You have <span className="font-semibold text-blue-600">{rooms.length}</span> rooms listed
//           </p>
//         </div>
//         <button
//           onClick={() => setActiveTab('create')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
//         >
//           <span className="material-icons text-sm">add</span>
//           Add New Room
//         </button>
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

//       {/* Tabs */}
//       <div className="border-b border-slate-200 mb-6 overflow-x-auto">
//         <nav className="flex gap-6 min-w-max">
//           <button
//             onClick={() => setActiveTab('list')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'list'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             My Rooms List ({rooms.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('create')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'create'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Create Room
//           </button>
//           <button
//             onClick={() => setActiveTab('upload')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'upload'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Upload Image
//           </button>
//           <button
//             onClick={() => setActiveTab('search')}
//             className={`pb-3 px-1 text-sm font-medium transition-colors ${
//               activeTab === 'search'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-slate-500 hover:text-slate-700'
//             }`}
//           >
//             Search Rooms
//           </button>
//         </nav>
//       </div>

//       {/* MY ROOMS LIST TAB */}
//       {activeTab === 'list' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-slate-800">My Rooms</h2>
//             <button
//               onClick={fetchOwnerRooms}
//               className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
//             >
//               <span className="material-icons text-sm">refresh</span>
//               Refresh
//             </button>
//           </div>
          
//           {loading ? (
//             <div className="flex justify-center py-12">
//               <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//             </div>
//           ) : rooms.length === 0 ? (
//             <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
//               <span className="material-icons text-5xl text-slate-300 mb-4">meeting_room</span>
//               <p className="text-slate-500 text-lg">No rooms found</p>
//               <p className="text-slate-400 text-sm mt-1">You haven't created any rooms yet.</p>
//               <button
//                 onClick={() => setActiveTab('create')}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
//               >
//                 Create Your First Room
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {rooms.map((room) => {
//                 const reviews = roomReviews[room._id] || [];
//                 const averageRating = reviews.length > 0 
//                   ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
//                   : 0;
//                 const loadingReview = loadingReviews[room._id];
                
//                 return (
//                   <div key={room._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
//                     <div className="h-48 bg-slate-100 relative">
//                       {room.images && room.images.length > 0 ? (
//                         <img 
//                           src={room.images[0]} 
//                           alt={room.title}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                           <span className="material-icons text-4xl text-slate-400">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-2 right-2">
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           room.isAvailable 
//                             ? 'bg-green-100 text-green-700' 
//                             : 'bg-amber-100 text-amber-700'
//                         }`}>
//                           {room.isAvailable ? 'Available' : 'Booked'}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-4">
//                       <h3 className="font-semibold text-slate-800 mb-1">{room.title}</h3>
//                       <p className="text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>
                      
//                       {/* Rating Stars */}
//                       <div className="flex items-center gap-1 mb-2">
//                         {loadingReview ? (
//                           <div className="flex items-center gap-1">
//                             <div className="w-16 h-4 bg-slate-200 animate-pulse rounded"></div>
//                           </div>
//                         ) : (
//                           <>
//                             <div className="flex">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <span key={star} className={`material-icons text-sm ${
//                                   star <= averageRating ? 'text-amber-400' : 'text-slate-300'
//                                 }`}>
//                                   star
//                                 </span>
//                               ))}
//                             </div>
//                             <span className="text-xs text-slate-500">
//                               ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
//                             </span>
//                             {averageRating > 0 && (
//                               <span className="text-xs font-medium text-amber-600">
//                                 {averageRating}
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </div>

//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-lg font-bold text-blue-600">{formatCurrency(room.pricePerDay)}</span>
//                         <span className="text-xs text-slate-500">per night</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">bed</span>
//                           {room.noOfBeds} bed
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">straighten</span>
//                           {room.roomSize} m²
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">people</span>
//                           {room.maxOccupancy}
//                         </span>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => fetchRoomById(room._id)}
//                           className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
//                         >
//                           View
//                         </button>
//                         <button
//                           onClick={() => {
//                             fetchRoomById(room._id);
//                             setTimeout(() => openEditModal(room), 100);
//                           }}
//                           className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
//                         >
//                           <span className="material-icons text-sm">edit</span>
//                         </button>
//                         <button
//                           onClick={() => toggleAvailability(room._id, room.isAvailable)}
//                           className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
//                             room.isAvailable
//                               ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                               : 'bg-green-100 text-green-700 hover:bg-green-200'
//                           }`}
//                         >
//                           {room.isAvailable ? 'Unavail' : 'Avail'}
//                         </button>
//                         <button
//                           onClick={() => deleteRoom(room._id)}
//                           className="px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-200"
//                         >
//                           <span className="material-icons text-sm">delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* CREATE ROOM TAB - WITH COMPLETE LOCATION DETAILS */}
//       {activeTab === 'create' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-slate-800">Create New Room</h2>
//             <button
//               onClick={refreshOwnerLocation}
//               className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
//             >
//               <span className="material-icons text-sm">refresh</span>
//               Refresh Owner Location
//             </button>
//           </div>

//           {/* Owner Location Info */}
//           {ownerProfile.location && (
//             <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-blue-800">Your Current Location</p>
//                   <p className="text-xs text-blue-600 mt-1">
//                     Latitude: {ownerProfile.location.latitude} | Longitude: {ownerProfile.location.longitude}
//                   </p>
//                   <p className="text-xs text-blue-600">
//                     {getCountryName(ownerProfile.location.country)}, {getStateName(ownerProfile.location.state)}, {ownerProfile.location.city}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-blue-600">Use owner location</span>
//                   <button
//                     type="button"
//                     onClick={() => setUseOwnerLocation(!useOwnerLocation)}
//                     className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
//                       useOwnerLocation ? 'bg-blue-600' : 'bg-slate-300'
//                     }`}
//                   >
//                     <span
//                       className={`${
//                         useOwnerLocation ? 'translate-x-4' : 'translate-x-0'
//                       } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <form onSubmit={createRoom} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={createForm.title}
//                   onChange={handleCreateInputChange}
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Price Per Day ($) <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="pricePerDay"
//                   value={createForm.pricePerDay}
//                   onChange={handleCreateInputChange}
//                   min="0"
//                   step="0.01"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={createForm.description}
//                 onChange={handleCreateInputChange}
//                 rows="3"
//                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Number of Beds
//                 </label>
//                 <input
//                   type="number"
//                   name="noOfBeds"
//                   value={createForm.noOfBeds}
//                   onChange={handleCreateInputChange}
//                   min="1"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Room Size (m²)
//                 </label>
//                 <input
//                   type="number"
//                   name="roomSize"
//                   value={createForm.roomSize}
//                   onChange={handleCreateInputChange}
//                   min="0"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Max Occupancy
//                 </label>
//                 <input
//                   type="number"
//                   name="maxOccupancy"
//                   value={createForm.maxOccupancy}
//                   onChange={handleCreateInputChange}
//                   min="1"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Checkout Time (hour)
//                 </label>
//                 <input
//                   type="number"
//                   name="timeForCheckout"
//                   value={createForm.timeForCheckout}
//                   onChange={handleCreateInputChange}
//                   min="0"
//                   max="23"
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 />
//               </div>
//             </div>

//             {/* Complete Location Section with Dropdowns */}
//             <div className="border-t border-slate-200 pt-4">
//               <h3 className="text-md font-semibold text-slate-700 mb-3">Location Details</h3>
              
//               {/* Country Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Country
//                 </label>
//                 <select
//                   value={selectedCountry}
//                   onChange={handleCountryChange}
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   disabled={useOwnerLocation && ownerProfile.location?.country}
//                 >
//                   <option value="">Select Country</option>
//                   {Array.isArray(countries) && countries.map((country) => (
//                     <option key={country.iso2} value={country.iso2}>
//                       {country.name} {country.emoji || ''}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* State Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   State
//                 </label>
//                 <select
//                   value={selectedState}
//                   onChange={handleStateChange}
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   disabled={!selectedCountry || (useOwnerLocation && ownerProfile.location?.state) || loadingLocation}
//                 >
//                   <option value="">Select State</option>
//                   {Array.isArray(states) && states.map((state) => (
//                     <option key={state.iso2} value={state.iso2}>
//                       {state.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* City Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   City
//                 </label>
//                 <select
//                   value={selectedCity}
//                   onChange={handleCityChange}
//                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                   disabled={!selectedState || (useOwnerLocation && ownerProfile.location?.city) || loadingLocation}
//                 >
//                   <option value="">Select City</option>
//                   {Array.isArray(cities) && cities.map((city) => (
//                     <option key={city.id} value={city.name}>
//                       {city.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Latitude & Longitude Inputs */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Latitude
//                   </label>
//                   <input
//                     type="number"
//                     name="location.latitude"
//                     value={createForm.location.latitude}
//                     onChange={handleCreateInputChange}
//                     placeholder="Latitude"
//                     step="0.000001"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     disabled={useOwnerLocation && ownerProfile.location?.latitude}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Longitude
//                   </label>
//                   <input
//                     type="number"
//                     name="location.longitude"
//                     value={createForm.location.longitude}
//                     onChange={handleCreateInputChange}
//                     placeholder="Longitude"
//                     step="0.000001"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     disabled={useOwnerLocation && ownerProfile.location?.longitude}
//                   />
//                 </div>
//               </div>
              
//               {useOwnerLocation && ownerProfile.location && (
//                 <p className="text-xs text-blue-600 mt-2">
//                   Using your saved location. Toggle the switch above to edit manually.
//                 </p>
//               )}

//               {loadingLocation && (
//                 <p className="text-xs text-blue-600 mt-2">Loading location data...</p>
//               )}
//             </div>

//             {/* Image Upload Section */}
//             <div className="border-t border-slate-200 pt-4">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Upload Room Images (Optional - You can upload multiple)
//               </label>
//               <div className="flex items-center gap-4">
//                 <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
//                   <span className="flex items-center gap-2">
//                     <span className="material-icons text-sm">add_photo_alternate</span>
//                     Select Images
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                 </label>
//                 <span className="text-xs text-slate-500">
//                   {roomImages.length} image(s) selected
//                 </span>
//               </div>

//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div className="mt-4">
//                   <p className="text-sm text-slate-700 mb-2">Image Previews:</p>
//                   <div className="flex flex-wrap gap-4">
//                     {imagePreviews.map((preview, index) => (
//                       <div key={index} className="relative">
//                         <img 
//                           src={preview} 
//                           alt={`Preview ${index + 1}`} 
//                           className="w-24 h-24 object-cover rounded-lg border border-slate-200"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                         >
//                           <span className="material-icons text-xs">close</span>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="pt-6 border-t border-slate-100">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Creating Room...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-icons">add</span>
//                     CREATE ROOM {roomImages.length > 0 ? `WITH ${roomImages.length} IMAGE(S)` : ''}
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* UPLOAD IMAGE TAB */}
//       {activeTab === 'upload' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Additional Images</h2>
          
//           <form onSubmit={uploadImage} className="max-w-md space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Select Room
//               </label>
//               <select
//                 value={imageUpload.roomId}
//                 onChange={(e) => setImageUpload({ ...imageUpload, roomId: e.target.value })}
//                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 required
//               >
//                 <option value="">Choose a room...</option>
//                 {rooms.map((room) => (
//                   <option key={room._id} value={room._id}>
//                     {room.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Choose Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 required
//               />
//             </div>

//             {imageUpload.preview && (
//               <div className="mt-4">
//                 <p className="text-sm text-slate-700 mb-2">Preview:</p>
//                 <img 
//                   src={imageUpload.preview} 
//                   alt="Preview" 
//                   className="w-full h-48 object-cover rounded-lg border border-slate-200"
//                 />
//               </div>
//             )}

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={loading || !imageUpload.roomId || !imageUpload.image}
//                 className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
//               >
//                 {loading ? 'Uploading...' : 'Upload Image'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* SEARCH ROOMS TAB */}
//       {activeTab === 'search' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">Search Rooms</h2>
          
//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 relative">
//               <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
//               <input
//                 type="text"
//                 placeholder="Search by room size, price, etc..."
//                 className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <button
//               onClick={searchRooms}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
//             >
//               Search
//             </button>
//           </div>

//           {isSearching && (
//             <div>
//               <h3 className="text-sm font-medium text-slate-700 mb-3">Search Results ({searchResults.length})</h3>
//               {searchResults.length === 0 ? (
//                 <p className="text-slate-500 text-sm">No rooms found matching your search.</p>
//               ) : (
//                 <div className="space-y-3">
//                   {searchResults.map((room) => (
//                     <div key={room._id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h4 className="font-medium text-slate-800">{room.title}</h4>
//                           <p className="text-xs text-slate-500">{room.description}</p>
//                           <div className="flex gap-4 mt-2 text-xs text-slate-500">
//                             <span>Size: {room.roomSize} m²</span>
//                             <span>Beds: {room.noOfBeds}</span>
//                             <span>Price: {formatCurrency(room.pricePerDay)}/night</span>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => fetchRoomById(room._id)}
//                           className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ROOM DETAILS MODAL */}
//       {selectedRoom && !editMode && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
//                         className="w-full h-32 object-cover rounded-lg"
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
//                     Guest Reviews ({roomReviews[selectedRoom._id]?.length || 0})
//                   </h4>
//                   {loadingReviews[selectedRoom._id] ? (
//                     <div className="space-y-2">
//                       <div className="h-16 bg-slate-200 animate-pulse rounded"></div>
//                       <div className="h-16 bg-slate-200 animate-pulse rounded"></div>
//                     </div>
//                   ) : roomReviews[selectedRoom._id]?.length > 0 ? (
//                     <div className="space-y-3">
//                       {roomReviews[selectedRoom._id].map((review) => (
//                         <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-slate-800">
//                               {review.userId?.name || 'Guest'}
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
//                     <p className="font-medium">{selectedRoom.roomSize} m²</p>
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

//                 {/* Display Complete Location */}
//                 <div className="bg-slate-50 p-4 rounded-lg">
//                   <p className="text-xs text-slate-500 mb-2">Location Details</p>
//                   <p className="text-sm">
//                     {getCountryName(selectedRoom.location?.country)}, {getStateName(selectedRoom.location?.state)}, {selectedRoom.location?.city}
//                   </p>
//                   <p className="text-xs text-slate-500 mt-1">
//                     Coordinates: {selectedRoom.location?.latitude}, {selectedRoom.location?.longitude}
//                   </p>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => openEditModal(selectedRoom)}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">edit</span>
//                     Edit Room
//                   </button>
//                   <button
//                     onClick={() => toggleAvailability(selectedRoom._id, selectedRoom.isAvailable)}
//                     className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                       selectedRoom.isAvailable
//                         ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                         : 'bg-green-100 text-green-700 hover:bg-green-200'
//                     }`}
//                   >
//                     {selectedRoom.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
//                   </button>
//                   <button
//                     onClick={() => {
//                       setActiveTab('upload');
//                       setImageUpload({ ...imageUpload, roomId: selectedRoom._id });
//                       setSelectedRoom(null);
//                     }}
//                     className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">add_photo_alternate</span>
//                     Upload
//                   </button>
//                   <button
//                     onClick={() => deleteRoom(selectedRoom._id)}
//                     className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-200"
//                   >
//                     <span className="material-icons text-sm">delete</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT ROOM MODAL */}
//       {editMode && selectedRoom && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   setSelectedRoom(null);
//                 }}
//                 className="p-2 hover:bg-slate-100 rounded-full"
//               >
//                 <span className="material-icons">close</span>
//               </button>
//             </div>
            
//             <div className="p-6">
//               <form onSubmit={updateRoom} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={editForm.title}
//                       onChange={handleEditInputChange}
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Price Per Day ($) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="pricePerDay"
//                       value={editForm.pricePerDay}
//                       onChange={handleEditInputChange}
//                       min="0"
//                       step="0.01"
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="description"
//                     value={editForm.description}
//                     onChange={handleEditInputChange}
//                     rows="3"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Number of Beds
//                     </label>
//                     <input
//                       type="number"
//                       name="noOfBeds"
//                       value={editForm.noOfBeds}
//                       onChange={handleEditInputChange}
//                       min="1"
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Room Size (m²)
//                     </label>
//                     <input
//                       type="number"
//                       name="roomSize"
//                       value={editForm.roomSize}
//                       onChange={handleEditInputChange}
//                       min="0"
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Max Occupancy
//                     </label>
//                     <input
//                       type="number"
//                       name="maxOccupancy"
//                       value={editForm.maxOccupancy}
//                       onChange={handleEditInputChange}
//                       min="1"
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Checkout Time (hour)
//                     </label>
//                     <input
//                       type="number"
//                       name="timeForCheckout"
//                       value={editForm.timeForCheckout}
//                       onChange={handleEditInputChange}
//                       min="0"
//                       max="23"
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Edit Location Section */}
//                 <div className="border-t border-slate-200 pt-4">
//                   <h3 className="text-md font-semibold text-slate-700 mb-3">Location Details</h3>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Country
//                       </label>
//                       <input
//                         type="text"
//                         name="location.country"
//                         value={editForm.location.country}
//                         onChange={handleEditInputChange}
//                         placeholder="Country"
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         State
//                       </label>
//                       <input
//                         type="text"
//                         name="location.state"
//                         value={editForm.location.state}
//                         onChange={handleEditInputChange}
//                         placeholder="State"
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         name="location.city"
//                         value={editForm.location.city}
//                         onChange={handleEditInputChange}
//                         placeholder="City"
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Latitude
//                       </label>
//                       <input
//                         type="number"
//                         name="location.latitude"
//                         value={editForm.location.latitude}
//                         onChange={handleEditInputChange}
//                         placeholder="Latitude"
//                         step="0.000001"
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Longitude
//                       </label>
//                       <input
//                         type="number"
//                         name="location.longitude"
//                         value={editForm.location.longitude}
//                         onChange={handleEditInputChange}
//                         placeholder="Longitude"
//                         step="0.000001"
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-6 border-t border-slate-200">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Updating...
//                       </>
//                     ) : (
//                       <>
//                         <span className="material-icons text-sm">save</span>
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditMode(false);
//                       setSelectedRoom(null);
//                     }}
//                     className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OwnerRooms;




import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import 'material-icons/iconfont/material-icons.css';

const OwnerRooms = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState({});
  const [ownerProfile, setOwnerProfile] = useState({});
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [roomReviews, setRoomReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});
  const [useOwnerLocation, setUseOwnerLocation] = useState(true);
  
  // Country, State, City API states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Edit room states
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    noOfBeds: 1,
    roomSize: 0,
    maxOccupancy: 1,
    pricePerDay: 0,
    timeForCheckout: 12,
    location: {
      latitude: 0,
      longitude: 0,
      country: '',
      state: '',
      city: ''
    }
  });

  // Form states for create with complete location
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    noOfBeds: 1,
    roomSize: 0,
    maxOccupancy: 1,
    pricePerDay: 0,
    timeForCheckout: 12,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      country: '',
      state: '',
      city: ''
    }
  });

  // Image upload state for create room
  const [roomImages, setRoomImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Separate image upload for existing rooms
  const [imageUpload, setImageUpload] = useState({
    roomId: '',
    image: null,
    preview: null
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const LOCATION_API_KEY = 'e42d26fd2748415b32f2dc6a2cb00d9662c4425c4130ce446ceb0b4936001ded';

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all countries on component mount
  useEffect(() => {
    fetchAllCountries();
  }, []);

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
        console.log('All Countries loaded:', data.length);
      } else {
        console.error('Error loading countries:', data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Fetch states based on selected country
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
        console.log('States loaded:', data.length);
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

  // Fetch cities based on selected country and state
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
        console.log('Cities loaded:', data.length);
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

  // Load user data on mount
  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.id) {
        fetchOwnerProfile(parsedUser.id);
      }
    }
  }, []);

  // Fetch owner profile to get location
  const fetchOwnerProfile = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setOwnerProfile(data);
        
        if (data.location) {
          setCreateForm(prev => ({
            ...prev,
            location: {
              latitude: data.location.latitude || prev.location.latitude,
              longitude: data.location.longitude || prev.location.longitude,
              country: data.location.country || prev.location.country,
              state: data.location.state || prev.location.state,
              city: data.location.city || prev.location.city
            }
          }));

          if (data.location.country) {
            setSelectedCountry(data.location.country);
            fetchStatesByCountry(data.location.country);
          }
          if (data.location.state) {
            setSelectedState(data.location.state);
            if (data.location.country) {
              fetchCitiesByState(data.location.country, data.location.state);
            }
          }
          if (data.location.city) {
            setSelectedCity(data.location.city);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching owner profile:', error);
    }
  };

  // Fetch rooms when user is loaded
  useEffect(() => {
    if (user.id) {
      fetchOwnerRooms();
    }
  }, [user]);

  // GET OWNER ROOMS
  const fetchOwnerRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/room/`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        const ownerRooms = data.filter(room => room.ownerId === user.id || room.ownerId?._id === user.id);
        setRooms(ownerRooms);
        
        ownerRooms.forEach(room => {
          fetchRoomReviews(room._id);
        });
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // GET ROOM REVIEWS
  const fetchRoomReviews = async (roomId) => {
    try {
      setLoadingReviews(prev => ({ ...prev, [roomId]: true }));
      const response = await fetch(`${BASE_URL}/review/reviews/room/${roomId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setRoomReviews(prev => ({ ...prev, [roomId]: data.reviews || [] }));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setRoomReviews(prev => ({ ...prev, [roomId]: [] }));
    } finally {
      setLoadingReviews(prev => ({ ...prev, [roomId]: false }));
    }
  };

  // FIXED: Upload multiple images function
  const uploadRoomImages = async (roomId, images) => {
    const uploadPromises = images.map(async (image) => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('roomId', roomId);

      try {
        const response = await fetch(`${BASE_URL}/room/upload-image`, {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: formData
        });
        
        if (response.ok) {
          return await response.json();
        } else {
          const error = await response.json();
          console.error('Image upload error:', error);
          return null;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(result => result && (result.ok !== false || result._id));
  };

  // FIXED: CREATE ROOM WITH IMAGES
  const createRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Determine which location to use
      let roomLocation = createForm.location;
      
      if (useOwnerLocation && ownerProfile.location) {
        roomLocation = {
          latitude: ownerProfile.location.latitude || 0,
          longitude: ownerProfile.location.longitude || 0,
          country: ownerProfile.location.country || selectedCountry || '',
          state: ownerProfile.location.state || selectedState || '',
          city: ownerProfile.location.city || selectedCity || ''
        };
      } else {
        roomLocation = {
          latitude: createForm.location.latitude || 0,
          longitude: createForm.location.longitude || 0,
          country: selectedCountry || '',
          state: selectedState || '',
          city: selectedCity || ''
        };
      }

      // First create the room
      const roomResponse = await fetch(`${BASE_URL}/room/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          noOfBeds: parseInt(createForm.noOfBeds) || 1,
          roomSize: parseInt(createForm.roomSize) || 0,
          maxOccupancy: parseInt(createForm.maxOccupancy) || 1,
          pricePerDay: parseFloat(createForm.pricePerDay) || 0,
          timeForCheckout: parseInt(createForm.timeForCheckout) || 12,
          images: [],
          ownerId: user.id,
          location: roomLocation
        })
      });

      const roomData = await roomResponse.json();

      if (roomResponse.ok) {
        const roomId = roomData._id || roomData.room?._id;
        
        // Then upload images if any
        if (roomImages.length > 0 && roomId) {
          const uploadResults = await uploadRoomImages(roomId, roomImages);
          
          // Clean up image preview URLs
          imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
          
          if (uploadResults.length > 0) {
            setMessage({ 
              type: 'success', 
              text: `✅ Room created with ${uploadResults.length} image(s) uploaded!` 
            });
          } else {
            setMessage({ 
              type: 'success', 
              text: '✅ Room created successfully! (Image upload failed)' 
            });
          }
        } else {
          setMessage({ 
            type: 'success', 
            text: '✅ Room created successfully!' 
          });
        }

        // COMPLETELY RESET FORM
        setCreateForm({
          title: '',
          description: '',
          noOfBeds: 1,
          roomSize: 0,
          maxOccupancy: 1,
          pricePerDay: 0,
          timeForCheckout: 12,
          location: {
            latitude: ownerProfile.location?.latitude || 40.7128,
            longitude: ownerProfile.location?.longitude || -74.0060,
            country: '',
            state: '',
            city: ''
          }
        });
        
        // Reset location dropdowns
        setSelectedCountry('');
        setSelectedState('');
        setSelectedCity('');
        setStates([]);
        setCities([]);
        
        // Reset image states
        setRoomImages([]);
        
        // Clean up preview URLs
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        setImagePreviews([]);
        
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        
        // Reset owner location toggle
        setUseOwnerLocation(true);
        
        // Refresh rooms list
        fetchOwnerRooms();
        
        // Switch to list tab after successful creation
        setTimeout(() => {
          setActiveTab('list');
        }, 2000);
        
      } else {
        setMessage({ type: 'error', text: roomData.message || 'Failed to create room' });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // UPDATE ROOM
  const updateRoom = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${BASE_URL}/room/${selectedRoom._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: '✅ Room updated successfully!' 
        });
        setEditMode(false);
        setSelectedRoom(null);
        fetchOwnerRooms(); 
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Failed to update room' 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating room' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Open edit modal with room data
  const openEditModal = (room) => {
    setEditForm({
      title: room.title || '',
      description: room.description || '',
      noOfBeds: room.noOfBeds || 1,
      roomSize: room.roomSize || 0,
      maxOccupancy: room.maxOccupancy || 1,
      pricePerDay: room.pricePerDay || 0,
      timeForCheckout: room.timeForCheckout || 12,
      location: {
        latitude: room.location?.latitude || 0,
        longitude: room.location?.longitude || 0,
        country: room.location?.country || '',
        state: room.location?.state || '',
        city: room.location?.city || ''
      }
    });
    setSelectedRoom(room);
    setEditMode(true);
  };

  // FIXED: Handle multiple image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types (only images)
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      setMessage({ type: 'error', text: 'Some files were skipped (only images allowed)' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
    
    setRoomImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Remove image from selection
  const removeImage = (index) => {
    setRoomImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // UPLOAD SINGLE IMAGE - for existing rooms
  const uploadImage = async (e) => {
    e.preventDefault();
    if (!imageUpload.roomId || !imageUpload.image) {
      setMessage({ type: 'error', text: 'Please select a room and image' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', imageUpload.image);
    formData.append('roomId', imageUpload.roomId);

    try {
      const response = await fetch(`${BASE_URL}/room/upload-image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Image uploaded successfully!' });
        setImageUpload({ roomId: '', image: null, preview: null });
        fetchOwnerRooms();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error uploading image' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // GET ROOM BY ID
  const fetchRoomById = async (roomId) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/room/${roomId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedRoom(data);
        await fetchRoomReviews(roomId);
      }
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE ROOM
  const deleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/room/${roomId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Room deleted successfully' });
        fetchOwnerRooms();
        if (selectedRoom?._id === roomId) {
          setSelectedRoom(null);
        }
        setRoomReviews(prev => {
          const newReviews = { ...prev };
          delete newReviews[roomId];
          return newReviews;
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete room' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting room' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // TOGGLE AVAILABILITY
  const toggleAvailability = async (roomId, currentStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/room/${roomId}/availability`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `✅ Room marked as ${!currentStatus ? 'available' : 'unavailable'}` 
        });
        fetchOwnerRooms();
        if (selectedRoom?._id === roomId) {
          setSelectedRoom({ ...selectedRoom, isAvailable: !currentStatus });
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update availability' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating availability' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // SEARCH ROOMS
  const searchRooms = async () => {
    if (!searchQuery.trim()) {
      setMessage({ type: 'error', text: 'Please enter a search query' });
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      const response = await fetch(`${BASE_URL}/room/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify({ searchQuery })
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.rooms || []);
      } else {
        setMessage({ type: 'error', text: data.message || 'Search failed' });
      }
    } catch (error) {
      console.error('Error searching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setCreateForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === 'latitude' || locationField === 'longitude' 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    } else {
      setCreateForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: locationField === 'latitude' || locationField === 'longitude' 
            ? parseFloat(value) || 0 
            : value
        }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUpload({
        ...imageUpload,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    
    setCreateForm(prev => ({
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
    
    setCreateForm(prev => ({
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
    
    setCreateForm(prev => ({
      ...prev,
      location: {
        ...prev.location,
        city: cityName
      }
    }));
  };

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

  const refreshOwnerLocation = async () => {
    if (user.id) {
      await fetchOwnerProfile(user.id);
      setMessage({ type: 'success', text: '✅ Owner location refreshed!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getCountryName = (code) => {
    if (!code || !Array.isArray(countries)) return code;
    const country = countries.find(c => c.iso2 === code);
    return country ? country.name : code;
  };

  const getStateName = (code) => {
    if (!code || !Array.isArray(states)) return code;
    const state = states.find(s => s.iso2 === code);
    return state ? state.name : code;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Rooms</h1>
          <p className="text-sm text-slate-500 mt-1">
            You have <span className="font-semibold text-blue-600">{rooms.length}</span> rooms listed
          </p>
        </div>
        <button
          onClick={() => setActiveTab('create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <span className="material-icons text-sm">add</span>
          Add New Room
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

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <nav className="flex gap-6 min-w-max">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Rooms List ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Search Rooms
          </button>
        </nav>
      </div>

      {/* MY ROOMS LIST TAB */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">My Rooms</h2>
            <button
              onClick={fetchOwnerRooms}
              className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
            >
              <span className="material-icons text-sm">refresh</span>
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <span className="material-icons text-5xl text-slate-300 mb-4">meeting_room</span>
              <p className="text-slate-500 text-lg">No rooms found</p>
              <p className="text-slate-400 text-sm mt-1">You haven't created any rooms yet.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Create Your First Room
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const reviews = roomReviews[room._id] || [];
                const averageRating = reviews.length > 0 
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : 0;
                const loadingReview = loadingReviews[room._id];
                
                return (
                  <div key={room._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
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
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          room.isAvailable 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {room.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-1">{room.title}</h3>
                      <p className="text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {loadingReview ? (
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-4 bg-slate-200 animate-pulse rounded"></div>
                          </div>
                        ) : (
                          <>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={`material-icons text-sm ${
                                  star <= averageRating ? 'text-amber-400' : 'text-slate-300'
                                }`}>
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-slate-500">
                              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                            </span>
                            {averageRating > 0 && (
                              <span className="text-xs font-medium text-amber-600">
                                {averageRating}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(room.pricePerDay)}</span>
                        <span className="text-xs text-slate-500">per night</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">bed</span>
                          {room.noOfBeds} bed
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">straighten</span>
                          {room.roomSize} m²
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">people</span>
                          {room.maxOccupancy}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchRoomById(room._id)}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            fetchRoomById(room._id);
                            setTimeout(() => openEditModal(room), 100);
                          }}
                          className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => toggleAvailability(room._id, room.isAvailable)}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            room.isAvailable
                              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {room.isAvailable ? 'Unavail' : 'Avail'}
                        </button>
                        <button
                          onClick={() => deleteRoom(room._id)}
                          className="px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-200"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE ROOM TAB - WITH COMPLETE LOCATION DETAILS */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Create New Room</h2>
            <button
              onClick={refreshOwnerLocation}
              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
            >
              <span className="material-icons text-sm">refresh</span>
              Refresh Owner Location
            </button>
          </div>

          {/* Owner Location Info */}
          {ownerProfile.location && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Your Current Location</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Latitude: {ownerProfile.location.latitude} | Longitude: {ownerProfile.location.longitude}
                  </p>
                  <p className="text-xs text-blue-600">
                    {getCountryName(ownerProfile.location.country)}, {getStateName(ownerProfile.location.state)}, {ownerProfile.location.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600">Use owner location</span>
                  <button
                    type="button"
                    onClick={() => setUseOwnerLocation(!useOwnerLocation)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      useOwnerLocation ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`${
                        useOwnerLocation ? 'translate-x-4' : 'translate-x-0'
                      } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={createRoom} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={createForm.title}
                  onChange={handleCreateInputChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price Per Day ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={createForm.pricePerDay}
                  onChange={handleCreateInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={createForm.description}
                onChange={handleCreateInputChange}
                rows="3"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of Beds
                </label>
                <input
                  type="number"
                  name="noOfBeds"
                  value={createForm.noOfBeds}
                  onChange={handleCreateInputChange}
                  min="1"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Room Size (m²)
                </label>
                <input
                  type="number"
                  name="roomSize"
                  value={createForm.roomSize}
                  onChange={handleCreateInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Occupancy
                </label>
                <input
                  type="number"
                  name="maxOccupancy"
                  value={createForm.maxOccupancy}
                  onChange={handleCreateInputChange}
                  min="1"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Checkout Time (hour)
                </label>
                <input
                  type="number"
                  name="timeForCheckout"
                  value={createForm.timeForCheckout}
                  onChange={handleCreateInputChange}
                  min="0"
                  max="23"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Complete Location Section with Dropdowns */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="text-md font-semibold text-slate-700 mb-3">Location Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  disabled={useOwnerLocation && ownerProfile.location?.country}
                >
                  <option value="">Select Country</option>
                  {Array.isArray(countries) && countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name} {country.emoji || ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  disabled={!selectedCountry || (useOwnerLocation && ownerProfile.location?.state) || loadingLocation}
                >
                  <option value="">Select State</option>
                  {Array.isArray(states) && states.map((state) => (
                    <option key={state.iso2} value={state.iso2}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                  disabled={!selectedState || (useOwnerLocation && ownerProfile.location?.city) || loadingLocation}
                >
                  <option value="">Select City</option>
                  {Array.isArray(cities) && cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="location.latitude"
                    value={createForm.location.latitude}
                    onChange={handleCreateInputChange}
                    placeholder="Latitude"
                    step="0.000001"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    disabled={useOwnerLocation && ownerProfile.location?.latitude}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="location.longitude"
                    value={createForm.location.longitude}
                    onChange={handleCreateInputChange}
                    placeholder="Longitude"
                    step="0.000001"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    disabled={useOwnerLocation && ownerProfile.location?.longitude}
                  />
                </div>
              </div>
              
              {useOwnerLocation && ownerProfile.location && (
                <p className="text-xs text-blue-600 mt-2">
                  Using your saved location. Toggle the switch above to edit manually.
                </p>
              )}

              {loadingLocation && (
                <p className="text-xs text-blue-600 mt-2">Loading location data...</p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Room Images (Optional - You can upload multiple)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="material-icons text-sm">add_photo_alternate</span>
                    Select Images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500">
                  {roomImages.length} image(s) selected
                </span>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-700 mb-2">Image Previews:</p>
                  <div className="flex flex-wrap gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <span className="material-icons text-xs">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Room...
                  </>
                ) : (
                  <>
                    <span className="material-icons">add</span>
                    CREATE ROOM {roomImages.length > 0 ? `WITH ${roomImages.length} IMAGE(S)` : ''}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPLOAD IMAGE TAB */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Upload Additional Images</h2>
          
          <form onSubmit={uploadImage} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Room
              </label>
              <select
                value={imageUpload.roomId}
                onChange={(e) => setImageUpload({ ...imageUpload, roomId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Choose a room...</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Choose Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            {imageUpload.preview && (
              <div className="mt-4">
                <p className="text-sm text-slate-700 mb-2">Preview:</p>
                <img 
                  src={imageUpload.preview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !imageUpload.roomId || !imageUpload.image}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
              >
                {loading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH ROOMS TAB */}
      {activeTab === 'search' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Search Rooms</h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Search by room size, price, etc..."
                className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={searchRooms}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          {isSearching && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-3">Search Results ({searchResults.length})</h3>
              {searchResults.length === 0 ? (
                <p className="text-slate-500 text-sm">No rooms found matching your search.</p>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((room) => (
                    <div key={room._id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-800">{room.title}</h4>
                          <p className="text-xs text-slate-500">{room.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-slate-500">
                            <span>Size: {room.roomSize} m²</span>
                            <span>Beds: {room.noOfBeds}</span>
                            <span>Price: {formatCurrency(room.pricePerDay)}/night</span>
                          </div>
                        </div>
                        <button
                          onClick={() => fetchRoomById(room._id)}
                          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ROOM DETAILS MODAL */}
      {selectedRoom && !editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              {selectedRoom.images && selectedRoom.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {selectedRoom.images.map((img, index) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`${selectedRoom.title} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
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

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="material-icons text-amber-400">star</span>
                    Guest Reviews ({roomReviews[selectedRoom._id]?.length || 0})
                  </h4>
                  {loadingReviews[selectedRoom._id] ? (
                    <div className="space-y-2">
                      <div className="h-16 bg-slate-200 animate-pulse rounded"></div>
                      <div className="h-16 bg-slate-200 animate-pulse rounded"></div>
                    </div>
                  ) : roomReviews[selectedRoom._id]?.length > 0 ? (
                    <div className="space-y-3">
                      {roomReviews[selectedRoom._id].map((review) => (
                        <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-800">
                              {review.userId?.name || 'Guest'}
                            </span>
                            <span className="text-xs text-slate-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`material-icons text-xs ${
                                star <= review.rating ? 'text-amber-400' : 'text-slate-300'
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

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500">Price per night</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedRoom.isAvailable 
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
                    <p className="font-medium">{selectedRoom.roomSize} m²</p>
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
                  <p className="text-xs text-slate-500 mb-2">Location Details</p>
                  <p className="text-sm">
                    {getCountryName(selectedRoom.location?.country)}, {getStateName(selectedRoom.location?.state)}, {selectedRoom.location?.city}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Coordinates: {selectedRoom.location?.latitude}, {selectedRoom.location?.longitude}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => openEditModal(selectedRoom)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">edit</span>
                    Edit Room
                  </button>
                  <button
                    onClick={() => toggleAvailability(selectedRoom._id, selectedRoom.isAvailable)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedRoom.isAvailable
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedRoom.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('upload');
                      setImageUpload({ ...imageUpload, roomId: selectedRoom._id });
                      setSelectedRoom(null);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">add_photo_alternate</span>
                    Upload
                  </button>
                  <button
                    onClick={() => deleteRoom(selectedRoom._id)}
                    className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-200"
                  >
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROOM MODAL */}
      {editMode && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
              <button
                onClick={() => {
                  setEditMode(false);
                  setSelectedRoom(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={updateRoom} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Price Per Day ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={editForm.pricePerDay}
                      onChange={handleEditInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Number of Beds
                    </label>
                    <input
                      type="number"
                      name="noOfBeds"
                      value={editForm.noOfBeds}
                      onChange={handleEditInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Room Size (m²)
                    </label>
                    <input
                      type="number"
                      name="roomSize"
                      value={editForm.roomSize}
                      onChange={handleEditInputChange}
                      min="0"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Max Occupancy
                    </label>
                    <input
                      type="number"
                      name="maxOccupancy"
                      value={editForm.maxOccupancy}
                      onChange={handleEditInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Checkout Time (hour)
                    </label>
                    <input
                      type="number"
                      name="timeForCheckout"
                      value={editForm.timeForCheckout}
                      onChange={handleEditInputChange}
                      min="0"
                      max="23"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-md font-semibold text-slate-700 mb-3">Location Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="location.country"
                        value={editForm.location.country}
                        onChange={handleEditInputChange}
                        placeholder="Country"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="location.state"
                        value={editForm.location.state}
                        onChange={handleEditInputChange}
                        placeholder="State"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="location.city"
                        value={editForm.location.city}
                        onChange={handleEditInputChange}
                        placeholder="City"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="location.latitude"
                        value={editForm.location.latitude}
                        onChange={handleEditInputChange}
                        placeholder="Latitude"
                        step="0.000001"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="location.longitude"
                        value={editForm.location.longitude}
                        onChange={handleEditInputChange}
                        placeholder="Longitude"
                        step="0.000001"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <span className="material-icons text-sm">save</span>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setSelectedRoom(null);
                    }}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerRooms;