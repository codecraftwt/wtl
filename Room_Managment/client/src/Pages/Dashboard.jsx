// import React, { useState, useEffect, useRef } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import 'material-icons/iconfont/material-icons.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [user, setUser] = useState({});
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [selectedRoomFromMap, setSelectedRoomFromMap] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
//   const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
//   const [userReviews, setUserReviews] = useState({});
//   const [pendingAction, setPendingAction] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showFilterPanel, setShowFilterPanel] = useState(false);
//   const [mapError, setMapError] = useState(false);
//   const [mapRetryCount, setMapRetryCount] = useState(0);
//   const [mapReady, setMapReady] = useState(false);

//   // My location state
//   const [myLocation, setMyLocation] = useState(null);
//   const [myLocationMarker, setMyLocationMarker] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [locationPermission, setLocationPermission] = useState('prompt');

//   // Radius filter state
//   const [radiusFilter, setRadiusFilter] = useState({
//     enabled: false,
//     distance: 50,
//     unit: 'km'
//   });

//   // Image carousel state
//   const [carouselIndexes, setCarouselIndexes] = useState({});
//   const [popupCarouselIndex, setPopupCarouselIndex] = useState(0);
//   const [autoPlayIntervals, setAutoPlayIntervals] = useState({});
//   const [isHovering, setIsHovering] = useState({});

//   // Map refs
//   const mapRef = useRef(null);
//   const markersRef = useRef([]);
//   const mapInstanceRef = useRef(null);
//   const popupCarouselTimerRef = useRef(null);

//   // Image zoom states
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showImageZoom, setShowImageZoom] = useState(false);

//   // Room search filters
//   const [filters, setFilters] = useState({
//     minPrice: '',
//     maxPrice: '',
//     beds: '',
//     minSize: ''
//   });

//   // FIXED: Booking form state with advance payment
//   const [bookingForm, setBookingForm] = useState({
//     bookingStartDate: '',
//     bookingEndDate: '',
//     advance: 0,
//     advanceMethod: 'cash'
//   });

//   // Review form state
//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     comment: '',
//     isEditing: false,
//     reviewId: null
//   });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const GEOAPIFY_API_KEY = 'e9331e493ca845b0a445921eca3f278b';

//   // India center coordinates
//   const INDIA_CENTER = [20.5937, 78.9629];
//   const INDIA_ZOOM = 5;

//   // Load Leaflet script
//   useEffect(() => {
//     loadLeafletScript();
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//       // Clear all auto-play intervals
//       Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, []);

//   // Load user data
//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//     }
//     fetchAllRooms();

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//     }
//   }, []);

//   // Update map when filtered rooms change
//   useEffect(() => {
//     if (mapInstanceRef.current && window.L) {
//       console.log('Filtered rooms changed, updating markers');
//       setTimeout(updateMapMarkers, 300);
//     }
//   }, [filteredRooms]);

//   // Force map update when rooms data changes
//   useEffect(() => {
//     if (rooms.length > 0 && mapInstanceRef.current && window.L) {
//       console.log('Rooms loaded, updating map markers');
//       setTimeout(updateMapMarkers, 1000);
//     }
//   }, [rooms]);

//   // Retry map initialization
//   useEffect(() => {
//     if (mapRetryCount < 3 && rooms.length > 0 && !mapInstanceRef.current && !mapError) {
//       const timer = setTimeout(() => {
//         console.log(`Retrying map initialization (attempt ${mapRetryCount + 1})`);
//         loadLeafletScript();
//         setMapRetryCount(prev => prev + 1);
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [mapRetryCount, rooms, mapError]);

//   // Control map interactions when modals are open
//   useEffect(() => {
//     if (!mapInstanceRef.current) return;

//     const isAnyModalOpen = showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom;

//     try {
//       if (isAnyModalOpen) {
//         mapInstanceRef.current.dragging.disable();
//         mapInstanceRef.current.touchZoom.disable();
//         mapInstanceRef.current.doubleClickZoom.disable();
//         mapInstanceRef.current.scrollWheelZoom.disable();
//         mapInstanceRef.current.boxZoom.disable();
//         mapInstanceRef.current.keyboard.disable();

//         if (mapInstanceRef.current.getContainer()) {
//           mapInstanceRef.current.getContainer().style.cursor = 'default';
//         }
//       } else {
//         mapInstanceRef.current.dragging.enable();
//         mapInstanceRef.current.touchZoom.enable();
//         mapInstanceRef.current.doubleClickZoom.enable();
//         mapInstanceRef.current.scrollWheelZoom.enable();
//         mapInstanceRef.current.boxZoom.enable();
//         mapInstanceRef.current.keyboard.enable();

//         if (mapInstanceRef.current.getContainer()) {
//           mapInstanceRef.current.getContainer().style.cursor = '';
//         }
//       }
//     } catch (e) {
//       console.log('Error toggling map interactions:', e);
//     }
//   }, [showBookingModal, showReviewModal, showLoginPopup, selectedRoom, showImageZoom]);

//   // Apply radius filter
//   useEffect(() => {
//     if (radiusFilter.enabled && myLocation) {
//       applyRadiusFilter();
//     } else if (!radiusFilter.enabled) {
//       setFilteredRooms(rooms);
//       if (mapInstanceRef.current && window.L) {
//         setTimeout(() => {
//           updateMapMarkers();
//           // Zoom out to show all rooms
//           if (rooms.length > 0) {
//             const allRoomsWithLocation = rooms.filter(room => 
//               room.location && (room.location.lat || room.location.latitude)
//             );
//             if (allRoomsWithLocation.length > 0) {
//               const bounds = allRoomsWithLocation.map(room => [
//                 parseFloat(room.location.lat || room.location.latitude),
//                 parseFloat(room.location.lng || room.location.longitude)
//               ]);
//               if (myLocation) {
//                 bounds.push([myLocation.lat, myLocation.lng]);
//               }
//               mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
//             }
//           }
//         }, 100);
//       }
//     }
//   }, [radiusFilter.enabled, radiusFilter.distance, myLocation]);

//   // Force map update when filteredRooms changes
//   useEffect(() => {
//     if (mapInstanceRef.current && window.L) {
//       console.log('Filtered rooms changed, updating map markers');
//       updateMapMarkers();
//     }
//   }, [filteredRooms]);

//   // Start auto-play for all rooms when they load
//   useEffect(() => {
//     if (rooms.length > 0) {
//       startAllAutoPlay();
//     }
//     return () => {
//       // Cleanup intervals on unmount
//       Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, [rooms]);

//   // Auto-play for popup carousel when selectedRoom changes
//   useEffect(() => {
//     if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 1) {
//       // Clear previous timer
//       if (popupCarouselTimerRef.current) {
//         clearInterval(popupCarouselTimerRef.current);
//       }

//       // Start new timer
//       popupCarouselTimerRef.current = setInterval(() => {
//         setPopupCarouselIndex(prev => 
//           prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
//         );
//       }, 3000);
//     }

//     return () => {
//       if (popupCarouselTimerRef.current) {
//         clearInterval(popupCarouselTimerRef.current);
//       }
//     };
//   }, [selectedRoom]);

//   const loadLeafletScript = () => {
//     if (window.L) {
//       initializeMap();
//       return;
//     }

//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//     document.head.appendChild(link);

//     const script = document.createElement('script');
//     script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//     script.async = true;
//     script.onload = () => {
//       console.log('Leaflet loaded successfully');
//       initializeMap();
//     };
//     script.onerror = () => {
//       console.error('Failed to load Leaflet');
//       setMapError(true);
//     };
//     document.head.appendChild(script);
//   };

//   const initializeMap = () => {
//     if (!mapRef.current || !window.L) {
//       console.log('Map container or Leaflet not ready');
//       return;
//     }

//     try {
//       console.log('Initializing map...');

//       // Center on India by default
//       mapInstanceRef.current = window.L.map(mapRef.current).setView(INDIA_CENTER, INDIA_ZOOM);

//       setMapReady(true);

//       const isRetina = window.L.Browser.retina;

//       const tileUrl = isRetina
//         ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${GEOAPIFY_API_KEY}`
//         : `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

//       window.L.tileLayer(tileUrl, {
//         attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
//         maxZoom: 20
//       }).addTo(mapInstanceRef.current);

//       setMapError(false);

//       // Add custom location button to map (like Google Maps)
//       addLocationButtonToMap();

//       setTimeout(updateMapMarkers, 500);

//     } catch (error) {
//       console.error('Error initializing map:', error);
//       setMapError(true);
//     }
//   };

//   // Add custom location button to map (like Google Maps)
//   const addLocationButtonToMap = () => {
//     if (!mapInstanceRef.current) return;

//     // Create custom control
//     const locationControl = window.L.control({ position: 'topright' });

//     locationControl.onAdd = () => {
//       const button = window.L.DomUtil.create('button', 'leaflet-control-custom');
//       button.innerHTML = `
//         <span class="material-icons" style="font-size: 20px;">my_location</span>
//         <span style="margin-left: 4px;">My Location</span>
//       `;
//       button.style.backgroundColor = 'white';
//       button.style.border = '2px solid rgba(0,0,0,0.2)';
//       button.style.borderRadius = '4px';
//       button.style.padding = '6px 12px';
//       button.style.cursor = 'pointer';
//       button.style.display = 'flex';
//       button.style.alignItems = 'center';
//       button.style.gap = '4px';
//       button.style.fontSize = '14px';
//       button.style.fontWeight = '500';
//       button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

//       button.onclick = () => {
//         getMyLocation();
//       };

//       return button;
//     };

//     locationControl.addTo(mapInstanceRef.current);
//   };

//   // Auto-play function
//   const startAutoPlay = (roomId, imagesLength) => {
//     if (imagesLength <= 1) return;

//     // Clear existing interval for this room
//     if (autoPlayIntervals[roomId]) {
//       clearInterval(autoPlayIntervals[roomId]);
//     }

//     // Start new interval
//     const interval = setInterval(() => {
//       setCarouselIndexes(prev => {
//         // Don't advance if hovering
//         if (isHovering[roomId]) return prev;

//         const currentIndex = prev[roomId] || 0;
//         const nextIndex = currentIndex === (imagesLength - 1) ? 0 : currentIndex + 1;
//         return { ...prev, [roomId]: nextIndex };
//       });
//     }, 3000);

//     setAutoPlayIntervals(prev => ({ ...prev, [roomId]: interval }));
//   };

//   const startAllAutoPlay = () => {
//     rooms.forEach(room => {
//       if (room.images && room.images.length > 1) {
//         startAutoPlay(room._id, room.images.length);
//       }
//     });
//   };

//   const handleMouseEnter = (roomId) => {
//     setIsHovering(prev => ({ ...prev, [roomId]: true }));
//   };

//   const handleMouseLeave = (roomId) => {
//     setIsHovering(prev => ({ ...prev, [roomId]: false }));
//   };

//   // Get user's location and jump to it
//   const getMyLocation = () => {
//     setIsGettingLocation(true);
//     setLocationError(null);

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//       setIsGettingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log('Got location:', latitude, longitude);

//         setMyLocation({ lat: latitude, lng: longitude });
//         setLocationPermission('granted');
//         setIsGettingLocation(false);

//         if (mapInstanceRef.current && window.L) {
//           // Remove existing my location marker
//           if (myLocationMarker) {
//             mapInstanceRef.current.removeLayer(myLocationMarker);
//           }

//           // Create pulsing blue dot for my location
//           const marker = window.L.marker([latitude, longitude], {
//             icon: window.L.divIcon({
//               className: 'my-location-marker',
//               html: `<div style="
//                 background-color: #3b82f6;
//                 width: 20px;
//                 height: 20px;
//                 border-radius: 50%;
//                 border: 3px solid white;
//                 box-shadow: 0 0 0 2px rgba(59,130,246,0.5), 0 2px 10px rgba(0,0,0,0.3);
//                 animation: pulse 1.5s infinite;
//               "></div>`,
//               iconSize: [20, 20],
//               iconAnchor: [10, 10]
//             })
//           }).addTo(mapInstanceRef.current);

//           marker.bindPopup('📍 You are here');
//           setMyLocationMarker(marker);

//           // JUMP TO MY LOCATION - center map with zoom level 12
//           mapInstanceRef.current.setView([latitude, longitude], 12);

//           // Apply radius filter if enabled
//           if (radiusFilter.enabled) {
//             applyRadiusFilter();
//           } else {
//             // Update markers to show all rooms
//             updateMapMarkers();
//           }
//         }
//       },
//       (error) => {
//         setIsGettingLocation(false);

//         let errorMessage = '';
//         let permissionState = 'denied';

//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = '📍 Location permission denied. Please click "Allow" when your browser asks for location access.';
//             permissionState = 'denied';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = '📍 Location information is unavailable. Please check your device settings.';
//             permissionState = 'denied';
//             break;
//           case error.TIMEOUT:
//             errorMessage = '📍 Location request timed out. Please try again.';
//             permissionState = 'prompt';
//             break;
//           default:
//             errorMessage = '📍 An unknown error occurred. Please try again.';
//             permissionState = 'prompt';
//         }

//         setLocationError(errorMessage);
//         setLocationPermission(permissionState);
//         console.error('Geolocation error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Calculate distance
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     const distance = R * c;
//     return distance;
//   };

//   // Apply radius filter and zoom to show only rooms within range
//   const applyRadiusFilter = () => {
//     if (!myLocation || !radiusFilter.enabled) return;

//     console.log('Applying radius filter:', radiusFilter.distance, 'km');

//     // Filter rooms within radius and add distance property
//     const filtered = rooms
//       .filter(room => {
//         if (!room.location) return false;

//         const roomLat = parseFloat(room.location.lat || room.location.latitude);
//         const roomLng = parseFloat(room.location.lng || room.location.longitude);

//         if (isNaN(roomLat) || isNaN(roomLng)) return false;

//         const distance = calculateDistance(
//           myLocation.lat, myLocation.lng,
//           roomLat, roomLng
//         );

//         // Store distance on the room object
//         room.distanceFromMe = Math.round(distance * 10) / 10;

//         return distance <= radiusFilter.distance;
//       })
//       .map(room => ({ ...room })); // Create copy to avoid reference issues

//     console.log(`Found ${filtered.length} rooms within ${radiusFilter.distance}km`);

//     // Update filtered rooms
//     setFilteredRooms(filtered);

//     // Force map to update and zoom to filtered rooms
//     if (mapInstanceRef.current && window.L) {
//       setTimeout(() => {
//         updateMapMarkers();
//         // After markers are updated, zoom to show all filtered rooms
//         zoomToFilteredRooms(filtered);
//       }, 100);
//     }
//   };

//   // Zoom map to show only the filtered rooms
//   const zoomToFilteredRooms = (filteredRoomsList) => {
//     if (!mapInstanceRef.current || !window.L) return;

//     // Get rooms with valid coordinates
//     const roomsWithLocation = filteredRoomsList.filter(room => {
//       if (!room.location) return false;

//       const lat = parseFloat(room.location?.lat || room.location?.latitude);
//       const lng = parseFloat(room.location?.lng || room.location?.longitude);

//       return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
//     });

//     if (roomsWithLocation.length === 0) {
//       // If no rooms in range, center on my location with zoom level 10
//       if (myLocation) {
//         mapInstanceRef.current.setView([myLocation.lat, myLocation.lng], 10);
//       }
//       return;
//     }

//     // Calculate bounds from all filtered rooms
//     const bounds = roomsWithLocation.map(room => {
//       const lat = parseFloat(room.location.lat || room.location.latitude);
//       const lng = parseFloat(room.location.lng || room.location.longitude);
//       return [lat, lng];
//     });

//     // Add my location to bounds to keep it in view
//     if (myLocation) {
//       bounds.push([myLocation.lat, myLocation.lng]);
//     }

//     if (bounds.length > 0) {
//       // Fit map to bounds with padding
//       mapInstanceRef.current.fitBounds(bounds, { 
//         padding: [50, 50],
//         maxZoom: 15 // Limit max zoom to prevent zooming too close
//       });
//     }
//   };

//   // Update map markers
//   const updateMapMarkers = () => {
//     if (!mapInstanceRef.current || !window.L) {
//       console.log('Map not ready for markers');
//       return;
//     }

//     console.log('Updating map markers...');
//     console.log('Total rooms:', filteredRooms.length);

//     // Clear existing markers (keep my location marker)
//     markersRef.current.forEach(marker => marker.remove());
//     markersRef.current = [];

//     // Get rooms with valid coordinates from filteredRooms
//     const roomsWithLocation = filteredRooms.filter(room => {
//       if (!room.location) return false;

//       const lat = parseFloat(room.location?.lat || room.location?.latitude);
//       const lng = parseFloat(room.location?.lng || room.location?.longitude);

//       return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
//     });

//     console.log(`Found ${roomsWithLocation.length} rooms with valid coordinates`);

//     if (roomsWithLocation.length === 0) {
//       // If no rooms with location, center on India
//       mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
//       return;
//     }

//     // Add markers for each room
//     roomsWithLocation.forEach(room => {
//       const lat = parseFloat(room.location.lat || room.location.latitude);
//       const lng = parseFloat(room.location.lng || room.location.longitude);

//       // Check if room is available based on current date
//       const isAvailableNow = checkRoomAvailability(room);

//       // Use availability for marker color
//       const markerColor = isAvailableNow ? '#22c55e' : '#ef4444';

//       // Add a subtle ring if within range filter
//       const ringStyle = (radiusFilter.enabled && room.distanceFromMe) 
//         ? `outline: 2px solid #3b82f6; outline-offset: 2px;` 
//         : '';

//       const marker = window.L.marker([lat, lng], {
//         icon: window.L.divIcon({
//           className: 'custom-marker',
//           html: `<div style="
//             background-color: ${markerColor}; 
//             width: 24px; 
//             height: 24px; 
//             border-radius: 50%; 
//             border: 3px solid white; 
//             box-shadow: 0 2px 10px rgba(0,0,0,0.3);
//             cursor: pointer;
//             transition: transform 0.2s;
//             ${ringStyle}
//           "></div>`,
//           iconSize: [24, 24],
//           iconAnchor: [12, 12]
//         })
//       }).addTo(mapInstanceRef.current);

//       // Get next available date if room is unavailable
//       const nextAvailableText = !isAvailableNow ? getNextAvailableDate(room) : '';

//       const distanceText = room.distanceFromMe 
//         ? `<p style="margin: 0 0 8px; font-size: 12px; color: #3b82f6;">📍 ${room.distanceFromMe} km from you</p>`
//         : '';

//       const popupContent = `
//         <div style="
//           padding: 16px; 
//           min-width: 240px; 
//           background: white; 
//           position: relative;
//           z-index: 9999;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.2);
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//         ">
//           <h3 style="
//             margin: 0 0 8px; 
//             font-size: 18px; 
//             font-weight: bold; 
//             color: #1e293b;
//           ">${room.title}</h3>

//           <p style="
//             margin: 0 0 8px; 
//             font-size: 16px; 
//             color: #2563eb; 
//             font-weight: bold;
//           ">$${room.pricePerDay}/night</p>

//           <p style="
//             margin: 0 0 8px; 
//             font-size: 14px; 
//             color: #64748b;
//             display: flex;
//             gap: 12px;
//           ">
//             <span>🛏️ ${room.noOfBeds} beds</span>
//             <span>📏 ${room.roomSize} sqft</span>
//           </p>

//           ${distanceText}

//           <p style="
//             margin: 0 0 12px; 
//             font-size: 14px; 
//             color: ${isAvailableNow ? '#22c55e' : '#ef4444'}; 
//             font-weight: 500;
//           ">
//             ${isAvailableNow ? '✓ Available Now' : '✗ Currently Booked'}
//             ${nextAvailableText}
//           </p>

//           <button 
//             onclick="window.selectRoom('${room._id}')"
//             style="
//               width: 100%; 
//               padding: 10px; 
//               background: #2563eb; 
//               color: white; 
//               border: none; 
//               border-radius: 8px; 
//               font-size: 14px; 
//               font-weight: 500; 
//               cursor: pointer;
//               transition: background 0.2s;
//             "
//             onmouseover="this.style.background='#1d4ed8'"
//             onmouseout="this.style.background='#2563eb'"
//           >
//             View Details
//           </button>
//         </div>
//       `;

//       marker.bindPopup(popupContent, {
//         className: 'custom-popup',
//         maxWidth: 300,
//         minWidth: 240
//       });

//       marker.on('click', () => {
//         setSelectedRoomFromMap(room);
//         setTimeout(() => marker.openPopup(), 100);
//       });

//       markersRef.current.push(marker);
//     });

//     // After adding markers, zoom to show all filtered rooms (if radius filter is enabled)
//     if (radiusFilter.enabled) {
//       zoomToFilteredRooms(filteredRooms);
//     } else {
//       // If no rooms, stay on India view
//       if (roomsWithLocation.length === 0) {
//         mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
//       }
//     }
//   };

//   // Helper function to check if room is available based on current date
//   const checkRoomAvailability = (room) => {
//     // If room.isAvailable is false, it might be booked
//     if (!room.isAvailable) return false;

//     // You can add more complex logic here if needed
//     // For example, check against current bookings
//     return room.isAvailable;
//   };

//   // Helper function to get next available date
//   const getNextAvailableDate = (room) => {
//     // This would ideally come from your backend
//     // For now, return a placeholder
//     return '<br/><span style="font-size: 11px; color: #666;">Available from: Check later</span>';
//   };

//   // Carousel navigation
//   const nextImage = (roomId, imagesLength, e) => {
//     e.stopPropagation();
//     setCarouselIndexes(prev => ({
//       ...prev,
//       [roomId]: ((prev[roomId] || 0) + 1) % imagesLength
//     }));
//   };

//   const prevImage = (roomId, imagesLength, e) => {
//     e.stopPropagation();
//     setCarouselIndexes(prev => ({
//       ...prev,
//       [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength
//     }));
//   };

//   // Popup carousel navigation
//   const nextPopupImage = (e) => {
//     e.stopPropagation();
//     if (selectedRoom && selectedRoom.images) {
//       setPopupCarouselIndex(prev => 
//         prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
//       );
//     }
//   };

//   const prevPopupImage = (e) => {
//     e.stopPropagation();
//     if (selectedRoom && selectedRoom.images) {
//       setPopupCarouselIndex(prev => 
//         prev === 0 ? selectedRoom.images.length - 1 : prev - 1
//       );
//     }
//   };

//   // Expose selectRoom to global scope
//   useEffect(() => {
//     window.selectRoom = (roomId) => {
//       const room = rooms.find(r => r._id === roomId);
//       if (room) {
//         setSelectedRoom(room);
//         setPopupCarouselIndex(0); // Reset popup carousel index
//       }
//     };
//     return () => {
//       delete window.selectRoom;
//     };
//   }, [rooms]);

//   // Check if user is logged in
//   const isLoggedIn = () => {
//     const token = Cookies.get('token');
//     return !!token && Object.keys(user).length > 0;
//   };

//   // Show login popup
//   const requireAuth = (action, room) => {
//     if (!isLoggedIn()) {
//       setPendingAction(action);
//       if (action === 'book') {
//         setSelectedRoomForBooking(room);
//       } else if (action === 'review') {
//         setSelectedRoomForReview(room);
//       }
//       setShowLoginPopup(true);
//       return false;
//     }
//     return true;
//   };

//   // Get auth headers
//   const getAuthHeaders = () => {
//     const token = Cookies.get('token');
//     return {
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // GET ALL ROOMS
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
//         console.log('Rooms fetched:', data);

//         const cleanedData = data.map(room => {
//           const { distanceFromMe, ...cleanRoom } = room;
//           return cleanRoom;
//         });

//         setRooms(cleanedData);
//         setFilteredRooms(cleanedData);

//         cleanedData.forEach(room => {
//           fetchRoomReviews(room._id);
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GET ROOM REVIEWS
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

//   // FIXED: CREATE BOOKING with advance payment
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
//           bookingEndDate: new Date(bookingForm.bookingEndDate).toISOString(),
//           advance: parseFloat(bookingForm.advance) || 0,
//           advancemethod: bookingForm.advanceMethod
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({
//           type: 'success',
//           text: '✅ Room booked successfully!'
//         });
//         setShowBookingModal(false);
//         setBookingForm({ 
//           bookingStartDate: '', 
//           bookingEndDate: '',
//           advance: 0,
//           advanceMethod: 'cash'
//         });
//         fetchAllRooms(); // Refresh rooms to update availability
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

//   // CREATE/UPDATE REVIEW
//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!selectedRoomForReview) return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       let response;
//       if (reviewForm.isEditing) {
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
//           text: reviewForm.isEditing ? '✅ Review updated!' : '✅ Review added!'
//         });
//         setShowReviewModal(false);
//         setReviewForm({ rating: 5, comment: '', isEditing: false, reviewId: null });
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

//   // Get user's review
//   const getUserReview = (roomId) => {
//     const reviews = userReviews[roomId] || [];
//     return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
//   };

//   // Handle search and filters
//   useEffect(() => {
//     let filtered = [...rooms];

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter(room =>
//         room.title?.toLowerCase().includes(query) ||
//         room.description?.toLowerCase().includes(query) ||
//         room.location?.city?.toLowerCase().includes(query) ||
//         room.location?.country?.toLowerCase().includes(query)
//       );
//     }

//     if (filters.minPrice) {
//       filtered = filtered.filter(room => room.pricePerDay >= Number(filters.minPrice));
//     }
//     if (filters.maxPrice) {
//       filtered = filtered.filter(room => room.pricePerDay <= Number(filters.maxPrice));
//     }
//     if (filters.beds) {
//       filtered = filtered.filter(room => room.noOfBeds >= Number(filters.beds));
//     }
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
//     if (!requireAuth('book', room)) return;
//     setSelectedRoomForBooking(room);
//     setShowBookingModal(true);
//   };

//   const openReviewModal = (room) => {
//     if (!requireAuth('review', room)) return;

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

//   const handleLoginFromPopup = () => {
//     setShowLoginPopup(false);
//     navigate('/login');
//   };

//   const handleRegisterFromPopup = () => {
//     setShowLoginPopup(false);
//     navigate('/register');
//   };

//   // Open in Google Maps
//   const openInGoogleMaps = (location) => {
//     if (!location) return;

//     let url = '#';
//     if (location.lat || location.latitude) {
//       const lat = location.lat || location.latitude;
//       const lng = location.lng || location.longitude;
//       url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
//     } else if (location.city || location.country) {
//       const address = [location.city, location.state, location.country].filter(Boolean).join(', ');
//       url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
//     }

//     if (url !== '#') {
//       window.open(url, '_blank');
//     }
//   };

//   const clearSelectedRoomFromMap = () => {
//     setSelectedRoomFromMap(null);
//   };

//   const toggleFilterPanel = () => {
//     setShowFilterPanel(!showFilterPanel);
//   };

//   const roomsWithLocationCount = filteredRooms.filter(room => 
//     room.location && (room.location.lat || room.location.latitude)
//   ).length;

//   // Get display rooms - show 4-5 cards for non-logged in users
//   const getDisplayRooms = () => {
//     if (isLoggedIn()) {
//       return filteredRooms;
//     }
//     // Show first 4-5 rooms for non-logged in users (minimum 4, maximum 5)
//     const displayCount = Math.min(filteredRooms.length, 5);
//     return filteredRooms.slice(0, displayCount);
//   };

//   const displayRooms = getDisplayRooms();
//   const hasMoreRooms = !isLoggedIn() && rooms.length > 5;

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Map Styles */}
//       <style>{`
//         .custom-marker {
//           cursor: pointer;
//         }
//         .custom-marker:hover div {
//           transform: scale(1.2);
//           transition: transform 0.2s;
//         }

//         @keyframes pulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
//           }
//         }

//         .my-location-marker {
//           cursor: pointer;
//           z-index: 1000 !important;
//         }

//         .leaflet-popup-content-wrapper {
//           background: white !important;
//           padding: 0 !important;
//           border-radius: 12px !important;
//           overflow: hidden !important;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
//           border: 1px solid #e2e8f0 !important;
//           opacity: 1 !important;
//           backdrop-filter: none !important;
//           -webkit-backdrop-filter: none !important;
//         }

//         .leaflet-popup-content {
//           margin: 0 !important;
//           min-width: 240px !important;
//           max-width: 300px !important;
//           background: white !important;
//           opacity: 1 !important;
//         }

//         .leaflet-popup-tip {
//           background: white !important;
//           box-shadow: none !important;
//           border: 1px solid #e2e8f0 !important;
//         }

//         .leaflet-popup {
//           z-index: 9999 !important;
//         }

//         .leaflet-popup-close-button {
//           display: none !important;
//         }

//         .leaflet-tile {
//           filter: brightness(0.95) contrast(0.9);
//         }

//         .leaflet-tile-pane {
//           opacity: 0.9;
//         }

//         .leaflet-container {
//           z-index: 1 !important;
//         }

//         .leaflet-pane {
//           z-index: 2 !important;
//         }

//         .fixed.inset-0 {
//           z-index: 10000 !important;
//         }

//         .z-50, .z-\\[60\\], .z-\\[100\\] {
//           z-index: 10000 !important;
//         }

//         .carousel-container {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//         }

//         .carousel-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: opacity 0.3s ease;
//         }

//         .carousel-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(0,0,0,0.5);
//           color: white;
//           border: none;
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 20;
//           transition: all 0.2s;
//         }

//         .carousel-btn:hover {
//           background: rgba(0,0,0,0.8);
//           transform: translateY(-50%) scale(1.1);
//         }

//         .carousel-btn.prev {
//           left: 5px;
//         }

//         .carousel-btn.next {
//           right: 5px;
//         }

//         .carousel-indicators {
//           position: absolute;
//           bottom: 5px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 4px;
//           z-index: 20;
//         }

//         .carousel-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           transition: all 0.2s;
//           cursor: pointer;
//         }

//         .carousel-dot:hover {
//           background: rgba(255,255,255,0.8);
//         }

//         .carousel-dot.active {
//           background: white;
//           width: 12px;
//           border-radius: 3px;
//         }

//         .popup-carousel {
//           position: relative;
//           width: 100%;
//           height: 200px;
//           overflow: hidden;
//           border-radius: 8px;
//           margin-bottom: 16px;
//         }

//         .popup-carousel-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .popup-carousel-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(0,0,0,0.6);
//           color: white;
//           border: none;
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 30;
//           transition: all 0.2s;
//         }

//         .popup-carousel-btn:hover {
//           background: rgba(0,0,0,0.9);
//           transform: translateY(-50%) scale(1.1);
//         }

//         .popup-carousel-btn.prev {
//           left: 10px;
//         }

//         .popup-carousel-btn.next {
//           right: 10px;
//         }

//         .popup-carousel-indicators {
//           position: absolute;
//           bottom: 10px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 6px;
//           z-index: 30;
//         }

//         .popup-carousel-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           transition: all 0.2s;
//           cursor: pointer;
//         }

//         .popup-carousel-dot:hover {
//           background: rgba(255,255,255,0.8);
//         }

//         .popup-carousel-dot.active {
//           background: white;
//           width: 16px;
//           border-radius: 4px;
//         }

//         /* Map location button */
//         .leaflet-control-custom {
//           background: white;
//           border: 2px solid rgba(0,0,0,0.1);
//           border-radius: 4px;
//           padding: 8px 12px;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//           transition: all 0.2s;
//           margin-right: 10px;
//           margin-top: 10px;
//         }
//         .leaflet-control-custom:hover {
//           background-color: #f0f0f0;
//           transform: scale(1.02);
//         }
//       `}</style>

//       {/* Mobile Header */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-xl font-bold text-slate-800">🏨 RoomFinder</h1>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
//           >
//             <span className="material-icons">
//               {mobileMenuOpen ? 'close' : 'menu'}
//             </span>
//           </button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-50">
//             <div className="space-y-3">
//               {!isLoggedIn() ? (
//                 <>
//                   <button
//                     onClick={() => {
//                       navigate('/login');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">login</span>
//                     Login
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/register');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">person_add</span>
//                     Register
//                   </button>
//                 </>
//               ) : (
//                 <div className="px-4 py-3 bg-blue-50 rounded-lg">
//                   <p className="text-sm font-medium text-blue-800">Welcome, {user.name}!</p>
//                   <p className="text-xs text-blue-600 mt-1 capitalize">{user.role}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Desktop Header - Hide location button from header, now on map */}
//         <div className="hidden lg:flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800">Find Your Perfect Stay</h1>
//             <p className="text-slate-500 mt-1">Discover and book amazing rooms</p>
//           </div>
//         </div>

//         {/* Location Error */}
//         {locationError && (
//           <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-start gap-3">
//               <span className="material-icons text-amber-600">location_off</span>
//               <div className="flex-1">
//                 <p className="text-sm text-amber-800">{locationError}</p>
//                 {locationPermission === 'denied' && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     To enable location access:
//                     <br />• Chrome: Click the lock icon in address bar → Site settings → Location → Allow
//                     <br />• Firefox: Click the shield icon → Blocked → Allow temporarily
//                     <br />• Safari: Safari menu → Settings → Websites → Location → Allow
//                   </p>
//                 )}
//                 <button
//                   onClick={getMyLocation}
//                   className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors"
//                 >
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Login Banner */}
//         {!isLoggedIn() && (
//           <div className="mt-4 lg:mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex items-start sm:items-center gap-3">
//                 <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
//                   <span className="material-icons text-white text-sm">info</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Login to Book Rooms & Leave Reviews</h3>
//                   <p className="text-xs sm:text-sm text-blue-600 mt-0.5">
//                     You're browsing as a guest. Sign in to book rooms and share your experiences!
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2 w-full sm:w-auto">
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
//                 >
//                   <span className="material-icons text-sm">login</span>
//                   Login
//                 </button>
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="flex-1 sm:flex-none px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <span className="material-icons text-sm">person_add</span>
//                   Register
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Message */}
//         {message.text && (
//           <div className={`mt-4 mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${
//             message.type === 'success'
//               ? 'bg-green-50 text-green-800 border border-green-200'
//               : 'bg-red-50 text-red-800 border border-red-200'
//           }`}>
//             <span className={`material-icons flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//               {message.type === 'success' ? 'check_circle' : 'error'}
//             </span>
//             <span className="flex-1 break-words">{message.text}</span>
//           </div>
//         )}

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search Box */}
//             <div className="flex-1 relative">
//               <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
//               <input
//                 type="text"
//                 placeholder="Search rooms..."
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {/* Filter Button */}
//             <button
//               onClick={toggleFilterPanel}
//               className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                 showFilterPanel 
//                   ? 'bg-blue-600 text-white' 
//                   : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//               }`}
//             >
//               <span className="material-icons text-sm">filter_list</span>
//               Filters
//               {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
//                 <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
//                   !
//                 </span>
//               )}
//             </button>
//           </div>

//           {/* Filter Panel */}
//           {showFilterPanel && (
//             <div className="mt-4 pt-4 border-t border-slate-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Min Price ($)</label>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.minPrice}
//                     onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Max Price ($)</label>
//                   <input
//                     type="number"
//                     placeholder="1000"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.maxPrice}
//                     onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Min Beds</label>
//                   <input
//                     type="number"
//                     placeholder="1"
//                     min="1"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.beds}
//                     onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Min Size (sqft)</label>
//                   <input
//                     type="number"
//                     placeholder="20"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.minSize}
//                     onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
//                   />
//                 </div>
//               </div>

//               {/* Radius Filter */}
//               <div className="mt-4 pt-4 border-t border-slate-200">
//                 <div className="flex items-center gap-3 mb-3">
//                   <input
//                     type="checkbox"
//                     id="radiusFilter"
//                     checked={radiusFilter.enabled}
//                     onChange={(e) => setRadiusFilter({ ...radiusFilter, enabled: e.target.checked })}
//                     className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="radiusFilter" className="text-sm font-medium text-slate-700">
//                     Search near my location
//                   </label>
//                 </div>

//                 {radiusFilter.enabled && (
//                   <div className="ml-7">
//                     <label className="block text-xs font-medium text-slate-600 mb-2">
//                       Distance: {radiusFilter.distance} {radiusFilter.unit}
//                     </label>
//                     <input
//                       type="range"
//                       min="5"
//                       max="200"
//                       step="5"
//                       value={radiusFilter.distance}
//                       onChange={(e) => setRadiusFilter({ ...radiusFilter, distance: parseInt(e.target.value) })}
//                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
//                     />
//                     <div className="flex justify-between text-xs text-slate-500 mt-1">
//                       <span>5 km</span>
//                       <span>50 km</span>
//                       <span>100 km</span>
//                       <span>150 km</span>
//                       <span>200 km</span>
//                     </div>

//                     {!myLocation && (
//                       <p className="text-xs text-amber-600 mt-2">
//                         Please click location button on map first
//                       </p>
//                     )}

//                     {myLocation && (
//                       <p className="text-xs text-blue-600 mt-2">
//                         🎯 Showing rooms within {radiusFilter.distance}km of your location
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Clear Filters Button */}
//               {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
//                 <div className="mt-3 flex justify-end">
//                   <button
//                     onClick={() => {
//                       setFilters({ minPrice: '', maxPrice: '', beds: '', minSize: '' });
//                       setRadiusFilter({ enabled: false, distance: 50, unit: 'km' });
//                       setFilteredRooms(rooms);
//                       if (mapInstanceRef.current && window.L) {
//                         setTimeout(updateMapMarkers, 100);
//                       }
//                     }}
//                     className="text-xs text-blue-600 hover:text-blue-800"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Results Count */}
//           <div className="mt-3 text-xs text-slate-500">
//             Found <span className="font-semibold text-blue-600">{filteredRooms.length}</span> rooms
//             {!isLoggedIn() && filteredRooms.length > 5 && (
//               <span className="ml-1 text-amber-600">(Showing 5 of {filteredRooms.length} - Login to see all)</span>
//             )}
//             {radiusFilter.enabled && myLocation && (
//               <span className="ml-1">within {radiusFilter.distance}km of your location</span>
//             )}
//           </div>
//         </div>

//         {/* Map Section */}
//         <div className="mb-8">
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="material-icons text-blue-600">map</span>
//                 <h3 className="text-sm font-semibold text-slate-700">Room Locations</h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                   {roomsWithLocationCount} room{roomsWithLocationCount !== 1 ? 's' : ''} on map
//                 </span>
//               </div>
//             </div>
//             {mapError ? (
//               <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-slate-100">
//                 <div className="text-center">
//                   <span className="material-icons text-4xl text-slate-400 mb-2">map</span>
//                   <p className="text-slate-500">Failed to load map</p>
//                   <button 
//                     onClick={() => {
//                       setMapError(false);
//                       setMapRetryCount(0);
//                       loadLeafletScript();
//                     }}
//                     className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div 
//                 ref={mapRef}
//                 className={`w-full h-[300px] sm:h-[400px] transition-all duration-300 ${
//                   (showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom) 
//                     ? 'pointer-events-none opacity-90' 
//                     : 'pointer-events-auto opacity-100'
//                 }`}
//                 style={{ 
//                   minHeight: '300px',
//                   position: 'relative',
//                   zIndex: (showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom) ? 1 : 10
//                 }}
//               />
//             )}
//           </div>
//         </div>

//         {/* Selected Room from Map */}
//         {selectedRoomFromMap && (
//           <div className="mb-6">
//             <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-3 mb-3 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="material-icons text-blue-600">location_on</span>
//                 <p className="text-sm text-blue-800">
//                   Room selected from map: <span className="font-semibold">{selectedRoomFromMap.title}</span>
//                   {selectedRoomFromMap.distanceFromMe && (
//                     <span className="ml-2 text-xs bg-blue-200 px-2 py-0.5 rounded-full">
//                       {selectedRoomFromMap.distanceFromMe} km from you
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <button
//                 onClick={clearSelectedRoomFromMap}
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 <span className="material-icons text-sm">close</span>
//               </button>
//             </div>

//             {/* Mini Room Card */}
//             <div 
//               id={`room-card-${selectedRoomFromMap._id}`}
//               className="bg-white rounded-xl border-2 border-blue-400 shadow-lg overflow-hidden cursor-pointer"
//               onClick={() => setSelectedRoom(selectedRoomFromMap)}
//             >
//               <div className="flex flex-col sm:flex-row">
//                 <div className="sm:w-48 h-32 bg-slate-100">
//                   {selectedRoomFromMap.images && selectedRoomFromMap.images.length > 0 ? (
//                     <img
//                       src={selectedRoomFromMap.images[0]}
//                       alt={selectedRoomFromMap.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                       <span className="material-icons text-3xl text-slate-400">image</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 p-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-semibold text-slate-800">{selectedRoomFromMap.title}</h3>
//                       <p className="text-xs text-slate-500 mt-1 line-clamp-1">{selectedRoomFromMap.description}</p>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       selectedRoomFromMap.isAvailable
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-amber-100 text-amber-700'
//                     }`}>
//                       {selectedRoomFromMap.isAvailable ? 'Available' : 'Booked'}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-4 mt-3">
//                     <span className="text-lg font-bold text-blue-600">{formatCurrency(selectedRoomFromMap.pricePerDay)}</span>
//                     <span className="text-xs text-slate-500">/night</span>
//                   </div>

//                   <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">bed</span>
//                       {selectedRoomFromMap.noOfBeds} bed
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">straighten</span>
//                       {selectedRoomFromMap.roomSize} sqft
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">people</span>
//                       {selectedRoomFromMap.maxOccupancy}
//                     </span>
//                   </div>

//                   <div className="mt-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedRoom(selectedRoomFromMap);
//                       }}
//                       className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       View full details →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rooms Grid */}
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <>
//             <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${isLoggedIn() ? '3' : '4'} gap-4 sm:gap-6`}>
//               {displayRooms.map((room) => {
//                 const reviews = userReviews[room._id] || [];
//                 const avgRating = calculateAverageRating(reviews);
//                 const userReview = getUserReview(room._id);
//                 const isSelectedFromMap = selectedRoomFromMap?._id === room._id;
//                 const currentImageIndex = carouselIndexes[room._id] || 0;
//                 const hasMultipleImages = room.images && room.images.length > 1;
//                 const isAvailableNow = checkRoomAvailability(room);

//                 return (
//                   <div
//                     key={room._id}
//                     id={`room-card-${room._id}`}
//                     className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
//                       isSelectedFromMap 
//                         ? 'border-blue-400 ring-2 ring-blue-200' 
//                         : 'border-slate-200'
//                     }`}
//                     onClick={() => {
//                       setSelectedRoom(room);
//                       setPopupCarouselIndex(0);
//                     }}
//                     onMouseEnter={() => handleMouseEnter(room._id)}
//                     onMouseLeave={() => handleMouseLeave(room._id)}
//                   >
//                     {/* Room Image with Auto-Play Carousel */}
//                     <div className="h-40 sm:h-48 bg-slate-100 relative group">
//                       {room.images && room.images.length > 0 ? (
//                         <div className="carousel-container">
//                           <img
//                             src={room.images[currentImageIndex]}
//                             alt={`${room.title} - Image ${currentImageIndex + 1}`}
//                             className="carousel-image"
//                           />

//                           {/* Carousel Controls - Always visible on hover */}
//                           {hasMultipleImages && (
//                             <>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   prevImage(room._id, room.images.length, e);
//                                 }}
//                                 className="carousel-btn prev opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <span className="material-icons text-sm">chevron_left</span>
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   nextImage(room._id, room.images.length, e);
//                                 }}
//                                 className="carousel-btn next opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <span className="material-icons text-sm">chevron_right</span>
//                               </button>
//                             </>
//                           )}

//                           {/* Image Indicators */}
//                           <div className="carousel-indicators">
//                             {room.images.map((_, idx) => (
//                               <div
//                                 key={idx}
//                                 className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setCarouselIndexes(prev => ({ ...prev, [room._id]: idx }));
//                                 }}
//                               />
//                             ))}
//                           </div>

//                           {/* Image Counter */}
//                           <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
//                             {currentImageIndex + 1} / {room.images.length}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                           <span className="material-icons text-4xl text-slate-400">image</span>
//                         </div>
//                       )}

//                       {/* Availability Badge */}
//                       <div className="absolute top-2 right-2 z-20">
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           isAvailableNow
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-amber-100 text-amber-700'
//                         }`}>
//                           {isAvailableNow ? 'Available' : 'Booked'}
//                         </span>
//                       </div>

//                       {/* Price Tag */}
//                       <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold z-20">
//                         {formatCurrency(room.pricePerDay)} <span className="text-xs font-normal">/night</span>
//                       </div>

//                       {/* Distance Badge */}
//                       {room.distanceFromMe && (
//                         <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-20">
//                           📍 {room.distanceFromMe} km
//                         </div>
//                       )}
//                     </div>

//                     {/* Room Details */}
//                     <div className="p-3 sm:p-4">
//                       <h3 className="font-semibold text-slate-800 text-base sm:text-lg mb-1 line-clamp-1">{room.title}</h3>
//                       <p className="text-xs sm:text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>

//                       {/* Rating Section */}
//                       <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
//                         <div className="flex items-center gap-1">
//                           <div className="flex">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <span key={star} className={`material-icons text-xs sm:text-sm ${
//                                 star <= avgRating ? 'text-amber-400' : 'text-slate-300'
//                               }`}>
//                                 star
//                               </span>
//                             ))}
//                           </div>
//                           <span className="text-xs text-slate-500">
//                             ({reviews.length})
//                           </span>
//                         </div>

//                         {isLoggedIn() && userReview && (
//                           <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
//                             Your review: {userReview.rating}★
//                           </span>
//                         )}
//                       </div>

//                       {/* Room Features */}
//                       <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mb-4">
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">bed</span>
//                           {room.noOfBeds} bed
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">straighten</span>
//                           {room.roomSize} sqft
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">people</span>
//                           {room.maxOccupancy}
//                         </span>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (isAvailableNow) {
//                               openBookingModal(room);
//                             }
//                           }}
//                           disabled={!isAvailableNow}
//                           className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
//                             isAvailableNow
//                               ? 'bg-blue-600 text-white hover:bg-blue-700'
//                               : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                           }`}
//                         >
//                           {isAvailableNow ? 'Book' : 'Unavail'}
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openReviewModal(room);
//                           }}
//                           className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
//                             userReview
//                               ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                               : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                           }`}
//                         >
//                           {userReview ? 'Update' : 'Review'}
//                         </button>
//                         {room.location && (room.location.lat || room.location.latitude) && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openInGoogleMaps(room.location);
//                             }}
//                             className="px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
//                             title="View on Google Maps"
//                           >
//                             <span className="material-icons text-sm">map</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* View More Button for Non-Logged In Users */}
//             {hasMoreRooms && (
//               <div className="mt-8 text-center">
//                 <button
//                   onClick={() => setShowLoginPopup(true)}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg"
//                 >
//                   Login to View All {rooms.length} Rooms
//                 </button>
//               </div>
//             )}

//             {displayRooms.length === 0 && (
//               <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-slate-200 px-4">
//                 <span className="material-icons text-5xl text-slate-300 mb-4">search_off</span>
//                 <p className="text-slate-500 text-lg">No rooms found</p>
//                 <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Login Popup Modal */}
//         {showLoginPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all">
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">Login Required</h2>
//                 <button
//                   onClick={() => {
//                     setShowLoginPopup(false);
//                     setPendingAction(null);
//                     setSelectedRoomForBooking(null);
//                     setSelectedRoomForReview(null);
//                   }}
//                   className="p-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <div className="p-4 sm:p-6">
//                 <div className="text-center mb-6">
//                   <span className="material-icons text-5xl text-blue-600 mb-3">lock</span>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                     {pendingAction === 'book' ? 'Want to book this room?' : pendingAction === 'review' ? 'Want to leave a review?' : 'Want to see all rooms?'}
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Please login or create an account to continue
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <button
//                     onClick={handleLoginFromPopup}
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">login</span>
//                     Login to Your Account
//                   </button>

//                   <button
//                     onClick={handleRegisterFromPopup}
//                     className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">person_add</span>
//                     Create New Account
//                   </button>

//                   <button
//                     onClick={() => {
//                       setShowLoginPopup(false);
//                       setPendingAction(null);
//                       setSelectedRoomForBooking(null);
//                       setSelectedRoomForReview(null);
//                     }}
//                     className="w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
//                   >
//                     Maybe Later
//                   </button>
//                 </div>

//                 <div className="mt-6 text-center text-xs text-slate-400">
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Room Details Modal with Clickable Carousel */}
//         {selectedRoom && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4" onClick={() => setSelectedRoom(null)}>
//             <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1">{selectedRoom.title}</h2>
//                 <button
//                   onClick={() => setSelectedRoom(null)}
//                   className="p-2 hover:bg-slate-100 rounded-full flex-shrink-0"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <div className="p-4 sm:p-6">
//                 {/* Clickable Popup Carousel */}
//                 {selectedRoom.images && selectedRoom.images.length > 0 && (
//                   <div className="mb-6">
//                     <div className="popup-carousel">
//                       <img
//                         src={selectedRoom.images[popupCarouselIndex]}
//                         alt={`${selectedRoom.title} - Image ${popupCarouselIndex + 1}`}
//                         className="popup-carousel-image"
//                       />

//                       {/* Carousel Controls */}
//                       {selectedRoom.images.length > 1 && (
//                         <>
//                           <button
//                             onClick={prevPopupImage}
//                             className="popup-carousel-btn prev"
//                           >
//                             <span className="material-icons">chevron_left</span>
//                           </button>
//                           <button
//                             onClick={nextPopupImage}
//                             className="popup-carousel-btn next"
//                           >
//                             <span className="material-icons">chevron_right</span>
//                           </button>
//                         </>
//                       )}

//                       {/* Image Indicators */}
//                       <div className="popup-carousel-indicators">
//                         {selectedRoom.images.map((_, idx) => (
//                           <div
//                             key={idx}
//                             className={`popup-carousel-dot ${idx === popupCarouselIndex ? 'active' : ''}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setPopupCarouselIndex(idx);
//                             }}
//                           />
//                         ))}
//                       </div>

//                       {/* Image Counter */}
//                       <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//                         {popupCarouselIndex + 1} / {selectedRoom.images.length}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{selectedRoom.title}</h3>
//                     <p className="text-sm sm:text-base text-slate-600">{selectedRoom.description}</p>
//                   </div>

//                   {/* Reviews Section */}
//                   <div className="bg-slate-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
//                       <span className="material-icons text-amber-400">star</span>
//                       Guest Reviews ({userReviews[selectedRoom._id]?.length || 0})
//                     </h4>

//                     {userReviews[selectedRoom._id]?.length > 0 ? (
//                       <div className="space-y-3 max-h-48 overflow-y-auto">
//                         {userReviews[selectedRoom._id].map((review) => (
//                           <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
//                             <div className="flex flex-wrap items-center justify-between gap-2">
//                               <span className="text-sm font-medium text-slate-800">
//                                 {review.userId?.name || 'Guest'}
//                                 {isLoggedIn() && review.userId?._id === user.id && (
//                                   <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                                     You
//                                   </span>
//                                 )}
//                               </span>
//                               <span className="text-xs text-slate-500">
//                                 {formatDate(review.createdAt)}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-1 mt-1">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <span key={star} className={`material-icons text-xs ${
//                                   star <= review.rating ? 'text-amber-400' : 'text-slate-300'
//                                 }`}>
//                                   star
//                                 </span>
//                               ))}
//                             </div>
//                             <p className="text-xs sm:text-sm text-slate-600 mt-1">{review.comment}</p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-slate-500 text-center py-4">
//                         No reviews yet for this room.
//                       </p>
//                     )}
//                   </div>

//                   {/* Room Specifications */}
//                   <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-4 rounded-lg">
//                     <div>
//                       <p className="text-xs text-slate-500">Price per night</p>
//                       <p className="text-lg sm:text-xl font-bold text-blue-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Status</p>
//                       <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
//                         checkRoomAvailability(selectedRoom)
//                           ? 'bg-green-100 text-green-700' 
//                           : 'bg-amber-100 text-amber-700'
//                       }`}>
//                         {checkRoomAvailability(selectedRoom) ? 'Available' : 'Booked'}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Beds</p>
//                       <p className="font-medium">{selectedRoom.noOfBeds}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Room Size</p>
//                       <p className="font-medium">{selectedRoom.roomSize} sqft</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Max Occupancy</p>
//                       <p className="font-medium">{selectedRoom.maxOccupancy} guests</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Checkout Time</p>
//                       <p className="font-medium">{selectedRoom.timeForCheckout}:00</p>
//                     </div>
//                   </div>

//                   {/* Location with Google Maps Button */}
//                   <div className="bg-slate-50 p-4 rounded-lg">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
//                       <p className="text-xs text-slate-500 font-semibold">Location</p>
//                       {selectedRoom.location && (selectedRoom.location.lat || selectedRoom.location.latitude || selectedRoom.location.city) && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openInGoogleMaps(selectedRoom.location);
//                           }}
//                           className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors w-full sm:w-auto"
//                         >
//                           <span className="material-icons text-sm">map</span>
//                           View on Google Maps
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-sm break-words">
//                       {selectedRoom.location?.city || ''} {selectedRoom.location?.state || ''} {selectedRoom.location?.country || ''}
//                     </p>
//                     {selectedRoom.distanceFromMe && (
//                       <p className="text-xs text-blue-600 mt-1">
//                         📍 {selectedRoom.distanceFromMe} km from your location
//                       </p>
//                     )}
//                     <p className="text-xs text-slate-500 mt-1 break-words">
//                       Coordinates: {selectedRoom.location?.lat || selectedRoom.location?.latitude || 'N/A'}, {selectedRoom.location?.lng || selectedRoom.location?.longitude || 'N/A'}
//                     </p>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                     {isLoggedIn() ? (
//                       <>
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             openBookingModal(selectedRoom);
//                           }}
//                           disabled={!checkRoomAvailability(selectedRoom)}
//                           className={`w-full sm:flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
//                             checkRoomAvailability(selectedRoom)
//                               ? 'bg-blue-600 text-white hover:bg-blue-700'
//                               : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                           }`}
//                         >
//                           {checkRoomAvailability(selectedRoom) ? 'Book This Room' : 'Not Available'}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             openReviewModal(selectedRoom);
//                           }}
//                           className="w-full sm:flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
//                         >
//                           Write a Review
//                         </button>
//                       </>
//                     ) : (
//                       <div className="w-full">
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             setShowLoginPopup(true);
//                             setPendingAction('book');
//                             setSelectedRoomForBooking(selectedRoom);
//                           }}
//                           className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
//                         >
//                           Login to Book
//                         </button>
//                         <p className="text-xs text-center text-slate-500 mt-2">
//                           New user?{' '}
//                           <button
//                             onClick={() => {
//                               setSelectedRoom(null);
//                               setShowLoginPopup(true);
//                               setPendingAction('register');
//                             }}
//                             className="text-blue-600 hover:underline"
//                           >
//                             Register here
//                           </button>
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Image Zoom Modal */}
//         {showImageZoom && selectedImage && (
//           <div 
//             className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] p-4"
//             onClick={() => {
//               setShowImageZoom(false);
//               setSelectedImage(null);
//             }}
//           >
//             <div className="relative w-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
//               <button
//                 onClick={() => {
//                   setShowImageZoom(false);
//                   setSelectedImage(null);
//                 }}
//                 className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
//               >
//                 <span className="material-icons text-2xl sm:text-3xl">close</span>
//               </button>

//               <img
//                 src={selectedImage}
//                 alt="Zoomed view"
//                 className="w-full h-full object-contain max-h-[80vh] sm:max-h-[90vh] rounded-lg"
//               />
//             </div>
//           </div>
//         )}

//         {/* FIXED: Booking Modal with Advance Payment */}
//         {showBookingModal && selectedRoomForBooking && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">Book Room</h2>
//                 <button
//                   onClick={() => setShowBookingModal(false)}
//                   className="p-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <form onSubmit={createBooking} className="p-4 sm:p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
//                   <input
//                     type="text"
//                     value={selectedRoomForBooking.title}
//                     disabled
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">Price per night</label>
//                   <input
//                     type="text"
//                     value={formatCurrency(selectedRoomForBooking.pricePerDay)}
//                     disabled
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Check-in Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       required
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       value={bookingForm.bookingStartDate}
//                       onChange={(e) => setBookingForm({ ...bookingForm, bookingStartDate: e.target.value })}
//                       min={new Date().toISOString().slice(0, 16)}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Check-out Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       required
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       value={bookingForm.bookingEndDate}
//                       onChange={(e) => setBookingForm({ ...bookingForm, bookingEndDate: e.target.value })}
//                       min={bookingForm.bookingStartDate}
//                     />
//                   </div>
//                 </div>

//                 {/* Advance Payment Section */}
//                 <div className="border-t border-slate-200 pt-4">
//                   <h3 className="text-md font-semibold text-slate-700 mb-3">Advance Payment</h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Advance Amount ($)
//                       </label>
//                       <input
//                         type="number"
//                         min="0"
//                         max={selectedRoomForBooking.pricePerDay * 10} // Max 10 days advance
//                         step="10"
//                         value={bookingForm.advance}
//                         onChange={(e) => setBookingForm({ ...bookingForm, advance: parseFloat(e.target.value) || 0 })}
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                       <p className="text-xs text-slate-500 mt-1">
//                         Leave 0 for no advance
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Payment Method
//                       </label>
//                       <select
//                         value={bookingForm.advanceMethod}
//                         onChange={(e) => setBookingForm({ ...bookingForm, advanceMethod: e.target.value })}
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="card">Card</option>
//                         <option value="upi">UPI</option>
//                         <option value="bank">Bank Transfer</option>
//                       </select>
//                     </div>
//                   </div>

//                   {bookingForm.advance > 0 && (
//                     <div className="mt-3 p-3 bg-blue-50 rounded-lg">
//                       <p className="text-xs text-blue-700">
//                         <span className="font-semibold">Note:</span> You will pay ${bookingForm.advance} as advance payment via {bookingForm.advanceMethod}.
//                         {bookingForm.advance < selectedRoomForBooking.pricePerDay && (
//                           <span className="block mt-1">Remaining ${selectedRoomForBooking.pricePerDay - bookingForm.advance} will be paid at check-in.</span>
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
//                   >
//                     {loading ? 'Booking...' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Review Modal */}
//         {showReviewModal && selectedRoomForReview && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">
//                   {reviewForm.isEditing ? 'Update Your Review' : 'Write a Review'}
//                 </h2>
//                 <button
//                   onClick={() => setShowReviewModal(false)}
//                   className="p-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <form onSubmit={submitReview} className="p-4 sm:p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
//                   <input
//                     type="text"
//                     value={selectedRoomForReview.title}
//                     disabled
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Rating <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex flex-wrap items-center gap-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setReviewForm({ ...reviewForm, rating: star })}
//                         className="focus:outline-none"
//                       >
//                         <span className={`material-icons text-2xl sm:text-3xl ${
//                           star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300'
//                         }`}>
//                           star
//                         </span>
//                       </button>
//                     ))}
//                     <span className="text-sm text-slate-500 ml-2">{reviewForm.rating}/5</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Comment (Optional)
//                   </label>
//                   <textarea
//                     rows="4"
//                     placeholder="Share your experience..."
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={reviewForm.comment}
//                     onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//                   />
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
//                   >
//                     {loading ? 'Submitting...' : reviewForm.isEditing ? 'Update Review' : 'Submit Review'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






































// 1 show all rooms when cick on that pns hen show  me list of all rooms
// 2 apply filter whenselect range then show range wise rooms and points
// 3 how deatis and isttance fro my loction to room


// import React, { useState, useEffect, useRef } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import 'material-icons/iconfont/material-icons.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [user, setUser] = useState({});
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [selectedRoomFromMap, setSelectedRoomFromMap] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
//   const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
//   const [userReviews, setUserReviews] = useState({});
//   const [pendingAction, setPendingAction] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showFilterPanel, setShowFilterPanel] = useState(false);
//   const [mapError, setMapError] = useState(false);
//   const [mapRetryCount, setMapRetryCount] = useState(0);
//   const [mapReady, setMapReady] = useState(false);

//   // My location state
//   const [myLocation, setMyLocation] = useState(null);
//   const [myLocationMarker, setMyLocationMarker] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [locationPermission, setLocationPermission] = useState('prompt');

//   // Radius filter state
//   const [radiusFilter, setRadiusFilter] = useState({
//     enabled: false,
//     distance: 50,
//     unit: 'km'
//   });

//   // Image carousel state
//   const [carouselIndexes, setCarouselIndexes] = useState({});
//   const [popupCarouselIndex, setPopupCarouselIndex] = useState(0);
//   const [autoPlayIntervals, setAutoPlayIntervals] = useState({});
//   const [isHovering, setIsHovering] = useState({});

//   // Map refs
//   const mapRef = useRef(null);
//   const markersRef = useRef([]);
//   const mapInstanceRef = useRef(null);
//   const popupCarouselTimerRef = useRef(null);

//   // Image zoom states
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showImageZoom, setShowImageZoom] = useState(false);

//   // Room search filters
//   const [filters, setFilters] = useState({
//     minPrice: '',
//     maxPrice: '',
//     beds: '',
//     minSize: ''
//   });

//   // Booking form state with advance payment
//   const [bookingForm, setBookingForm] = useState({
//     bookingStartDate: '',
//     bookingEndDate: '',
//     advance: 0,
//     advanceMethod: 'cash'
//   });

//   // Review form state
//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     comment: '',
//     isEditing: false,
//     reviewId: null
//   });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const GEOAPIFY_API_KEY = 'e9331e493ca845b0a445921eca3f278b';

//   // India center coordinates
//   const INDIA_CENTER = [20.5937, 78.9629];
//   const INDIA_ZOOM = 5;

//   // Load Leaflet script
//   useEffect(() => {
//     loadLeafletScript();
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//       // Clear all auto-play intervals
//       Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, []);

//   // Load user data
//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//     }
//     fetchAllRooms();

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//     }
//   }, []);

//   // Update map when filtered rooms change
//   useEffect(() => {
//     if (mapInstanceRef.current && window.L) {
//       console.log('Filtered rooms changed, updating markers');
//       setTimeout(updateMapMarkers, 300);
//     }
//   }, [filteredRooms]);

//   // Force map update when rooms data changes
//   useEffect(() => {
//     if (rooms.length > 0 && mapInstanceRef.current && window.L) {
//       console.log('Rooms loaded, updating map markers');
//       setTimeout(updateMapMarkers, 1000);
//     }
//   }, [rooms]);

//   // Retry map initialization
//   useEffect(() => {
//     if (mapRetryCount < 3 && rooms.length > 0 && !mapInstanceRef.current && !mapError) {
//       const timer = setTimeout(() => {
//         console.log(`Retrying map initialization (attempt ${mapRetryCount + 1})`);
//         loadLeafletScript();
//         setMapRetryCount(prev => prev + 1);
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [mapRetryCount, rooms, mapError]);

//   // Control map interactions when modals are open
//   useEffect(() => {
//     if (!mapInstanceRef.current) return;

//     const isAnyModalOpen = showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom;

//     try {
//       if (isAnyModalOpen) {
//         mapInstanceRef.current.dragging.disable();
//         mapInstanceRef.current.touchZoom.disable();
//         mapInstanceRef.current.doubleClickZoom.disable();
//         mapInstanceRef.current.scrollWheelZoom.disable();
//         mapInstanceRef.current.boxZoom.disable();
//         mapInstanceRef.current.keyboard.disable();

//         if (mapInstanceRef.current.getContainer()) {
//           mapInstanceRef.current.getContainer().style.cursor = 'default';
//         }
//       } else {
//         mapInstanceRef.current.dragging.enable();
//         mapInstanceRef.current.touchZoom.enable();
//         mapInstanceRef.current.doubleClickZoom.enable();
//         mapInstanceRef.current.scrollWheelZoom.enable();
//         mapInstanceRef.current.boxZoom.enable();
//         mapInstanceRef.current.keyboard.enable();

//         if (mapInstanceRef.current.getContainer()) {
//           mapInstanceRef.current.getContainer().style.cursor = '';
//         }
//       }
//     } catch (e) {
//       console.log('Error toggling map interactions:', e);
//     }
//   }, [showBookingModal, showReviewModal, showLoginPopup, selectedRoom, showImageZoom]);

//   // Apply radius filter
//   useEffect(() => {
//     if (radiusFilter.enabled && myLocation) {
//       applyRadiusFilter();
//     } else if (!radiusFilter.enabled) {
//       setFilteredRooms(rooms);
//       if (mapInstanceRef.current && window.L) {
//         setTimeout(() => {
//           updateMapMarkers();
//           // Zoom out to show all rooms
//           if (rooms.length > 0) {
//             const allRoomsWithLocation = rooms.filter(room =>
//               room.location && (room.location.lat || room.location.latitude)
//             );
//             if (allRoomsWithLocation.length > 0) {
//               const bounds = allRoomsWithLocation.map(room => [
//                 parseFloat(room.location.lat || room.location.latitude),
//                 parseFloat(room.location.lng || room.location.longitude)
//               ]);
//               if (myLocation) {
//                 bounds.push([myLocation.lat, myLocation.lng]);
//               }
//               mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
//             }
//           }
//         }, 100);
//       }
//     }
//   }, [radiusFilter.enabled, radiusFilter.distance, myLocation]);

//   // Force map update when filteredRooms changes
//   useEffect(() => {
//     if (mapInstanceRef.current && window.L) {
//       console.log('Filtered rooms changed, updating map markers');
//       updateMapMarkers();
//     }
//   }, [filteredRooms]);

//   // Start auto-play for all rooms when they load
//   useEffect(() => {
//     if (rooms.length > 0) {
//       startAllAutoPlay();
//     }
//     return () => {
//       // Cleanup intervals on unmount
//       Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, [rooms]);

//   // Auto-play for popup carousel when selectedRoom changes
//   useEffect(() => {
//     if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 1) {
//       // Clear previous timer
//       if (popupCarouselTimerRef.current) {
//         clearInterval(popupCarouselTimerRef.current);
//       }

//       // Start new timer
//       popupCarouselTimerRef.current = setInterval(() => {
//         setPopupCarouselIndex(prev =>
//           prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
//         );
//       }, 3000);
//     }

//     return () => {
//       if (popupCarouselTimerRef.current) {
//         clearInterval(popupCarouselTimerRef.current);
//       }
//     };
//   }, [selectedRoom]);

//   const loadLeafletScript = () => {
//     if (window.L) {
//       initializeMap();
//       return;
//     }

//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//     document.head.appendChild(link);

//     const script = document.createElement('script');
//     script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//     script.async = true;
//     script.onload = () => {
//       console.log('Leaflet loaded successfully');
//       initializeMap();
//     };
//     script.onerror = () => {
//       console.error('Failed to load Leaflet');
//       setMapError(true);
//     };
//     document.head.appendChild(script);
//   };

//   const initializeMap = () => {
//     if (!mapRef.current || !window.L) {
//       console.log('Map container or Leaflet not ready');
//       return;
//     }

//     try {
//       console.log('Initializing map...');

//       // Center on India by default
//       mapInstanceRef.current = window.L.map(mapRef.current).setView(INDIA_CENTER, INDIA_ZOOM);

//       setMapReady(true);

//       const isRetina = window.L.Browser.retina;

//       const tileUrl = isRetina
//         ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${GEOAPIFY_API_KEY}`
//         : `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

//       window.L.tileLayer(tileUrl, {
//         attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
//         maxZoom: 20
//       }).addTo(mapInstanceRef.current);

//       setMapError(false);

//       // Add custom location button to map (like Google Maps)
//       addLocationButtonToMap();

//       setTimeout(updateMapMarkers, 500);

//     } catch (error) {
//       console.error('Error initializing map:', error);
//       setMapError(true);
//     }
//   };

//   // Add custom location button to map (like Google Maps)
//   const addLocationButtonToMap = () => {
//     if (!mapInstanceRef.current) return;

//     // Create custom control
//     const locationControl = window.L.control({ position: 'topright' });

//     locationControl.onAdd = () => {
//       const button = window.L.DomUtil.create('button', 'leaflet-control-custom');
//       button.innerHTML = `
//         <span class="material-icons" style="font-size: 20px;">my_location</span>
//         <span style="margin-left: 4px;">My Location</span>
//       `;
//       button.style.backgroundColor = 'white';
//       button.style.border = '2px solid rgba(0,0,0,0.2)';
//       button.style.borderRadius = '4px';
//       button.style.padding = '6px 12px';
//       button.style.cursor = 'pointer';
//       button.style.display = 'flex';
//       button.style.alignItems = 'center';
//       button.style.gap = '4px';
//       button.style.fontSize = '14px';
//       button.style.fontWeight = '500';
//       button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

//       button.onclick = () => {
//         getMyLocation();
//       };

//       return button;
//     };

//     locationControl.addTo(mapInstanceRef.current);
//   };

//   // Auto-play function
//   const startAutoPlay = (roomId, imagesLength) => {
//     if (imagesLength <= 1) return;

//     // Clear existing interval for this room
//     if (autoPlayIntervals[roomId]) {
//       clearInterval(autoPlayIntervals[roomId]);
//     }

//     // Start new interval
//     const interval = setInterval(() => {
//       setCarouselIndexes(prev => {
//         // Don't advance if hovering
//         if (isHovering[roomId]) return prev;

//         const currentIndex = prev[roomId] || 0;
//         const nextIndex = currentIndex === (imagesLength - 1) ? 0 : currentIndex + 1;
//         return { ...prev, [roomId]: nextIndex };
//       });
//     }, 3000);

//     setAutoPlayIntervals(prev => ({ ...prev, [roomId]: interval }));
//   };

//   const startAllAutoPlay = () => {
//     rooms.forEach(room => {
//       if (room.images && room.images.length > 1) {
//         startAutoPlay(room._id, room.images.length);
//       }
//     });
//   };

//   const handleMouseEnter = (roomId) => {
//     setIsHovering(prev => ({ ...prev, [roomId]: true }));
//   };

//   const handleMouseLeave = (roomId) => {
//     setIsHovering(prev => ({ ...prev, [roomId]: false }));
//   };

//   // Get user's location and jump to it
//   const getMyLocation = () => {
//     setIsGettingLocation(true);
//     setLocationError(null);

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//       setIsGettingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log('Got location:', latitude, longitude);

//         setMyLocation({ lat: latitude, lng: longitude });
//         setLocationPermission('granted');
//         setIsGettingLocation(false);

//         if (mapInstanceRef.current && window.L) {
//           // Remove existing my location marker
//           if (myLocationMarker) {
//             mapInstanceRef.current.removeLayer(myLocationMarker);
//           }

//           // Create pulsing blue dot for my location
//           const marker = window.L.marker([latitude, longitude], {
//             icon: window.L.divIcon({
//               className: 'my-location-marker',
//               html: `<div style="
//                 background-color: #3b82f6;
//                 width: 20px;
//                 height: 20px;
//                 border-radius: 50%;
//                 border: 3px solid white;
//                 box-shadow: 0 0 0 2px rgba(59,130,246,0.5), 0 2px 10px rgba(0,0,0,0.3);
//                 animation: pulse 1.5s infinite;
//               "></div>`,
//               iconSize: [20, 20],
//               iconAnchor: [10, 10]
//             })
//           }).addTo(mapInstanceRef.current);

//           marker.bindPopup('📍 You are here');
//           setMyLocationMarker(marker);

//           // JUMP TO MY LOCATION - center map with zoom level 12
//           mapInstanceRef.current.setView([latitude, longitude], 12);

//           // Apply radius filter if enabled
//           if (radiusFilter.enabled) {
//             applyRadiusFilter();
//           } else {
//             // Update markers to show all rooms
//             updateMapMarkers();
//           }
//         }
//       },
//       (error) => {
//         setIsGettingLocation(false);

//         let errorMessage = '';
//         let permissionState = 'denied';

//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = '📍 Location permission denied. Please click "Allow" when your browser asks for location access.';
//             permissionState = 'denied';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = '📍 Location information is unavailable. Please check your device settings.';
//             permissionState = 'denied';
//             break;
//           case error.TIMEOUT:
//             errorMessage = '📍 Location request timed out. Please try again.';
//             permissionState = 'prompt';
//             break;
//           default:
//             errorMessage = '📍 An unknown error occurred. Please try again.';
//             permissionState = 'prompt';
//         }

//         setLocationError(errorMessage);
//         setLocationPermission(permissionState);
//         console.error('Geolocation error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Calculate distance
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;
//     return distance;
//   };

//   // Apply radius filter and zoom to show only rooms within range
//   const applyRadiusFilter = () => {
//     if (!myLocation || !radiusFilter.enabled) return;

//     console.log('Applying radius filter:', radiusFilter.distance, 'km');

//     // Filter rooms within radius and add distance property
//     const filtered = rooms
//       .filter(room => {
//         if (!room.location) return false;

//         const roomLat = parseFloat(room.location.lat || room.location.latitude);
//         const roomLng = parseFloat(room.location.lng || room.location.longitude);

//         if (isNaN(roomLat) || isNaN(roomLng)) return false;

//         const distance = calculateDistance(
//           myLocation.lat, myLocation.lng,
//           roomLat, roomLng
//         );

//         // Store distance on the room object
//         room.distanceFromMe = Math.round(distance * 10) / 10;

//         return distance <= radiusFilter.distance;
//       })
//       .map(room => ({ ...room })); // Create copy to avoid reference issues

//     console.log(`Found ${filtered.length} rooms within ${radiusFilter.distance}km`);

//     // Update filtered rooms
//     setFilteredRooms(filtered);

//     // Force map to update and zoom to filtered rooms
//     if (mapInstanceRef.current && window.L) {
//       setTimeout(() => {
//         updateMapMarkers();
//         // After markers are updated, zoom to show all filtered rooms
//         zoomToFilteredRooms(filtered);
//       }, 100);
//     }
//   };

//   // Zoom map to show only the filtered rooms
//   const zoomToFilteredRooms = (filteredRoomsList) => {
//     if (!mapInstanceRef.current || !window.L) return;

//     // Get rooms with valid coordinates
//     const roomsWithLocation = filteredRoomsList.filter(room => {
//       if (!room.location) return false;

//       const lat = parseFloat(room.location?.lat || room.location?.latitude);
//       const lng = parseFloat(room.location?.lng || room.location?.longitude);

//       return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
//     });

//     if (roomsWithLocation.length === 0) {
//       // If no rooms in range, center on my location with zoom level 10
//       if (myLocation) {
//         mapInstanceRef.current.setView([myLocation.lat, myLocation.lng], 10);
//       }
//       return;
//     }

//     // Calculate bounds from all filtered rooms
//     const bounds = roomsWithLocation.map(room => {
//       const lat = parseFloat(room.location.lat || room.location.latitude);
//       const lng = parseFloat(room.location.lng || room.location.longitude);
//       return [lat, lng];
//     });

//     // Add my location to bounds to keep it in view
//     if (myLocation) {
//       bounds.push([myLocation.lat, myLocation.lng]);
//     }

//     if (bounds.length > 0) {
//       // Fit map to bounds with padding
//       mapInstanceRef.current.fitBounds(bounds, {
//         padding: [50, 50],
//         maxZoom: 15 // Limit max zoom to prevent zooming too close
//       });
//     }
//   };

//   // Update map markers
//   const updateMapMarkers = () => {
//     if (!mapInstanceRef.current || !window.L) {
//       console.log('Map not ready for markers');
//       return;
//     }

//     console.log('Updating map markers...');
//     console.log('Total rooms:', filteredRooms.length);

//     // Clear existing markers (keep my location marker)
//     markersRef.current.forEach(marker => marker.remove());
//     markersRef.current = [];

//     // Get rooms with valid coordinates from filteredRooms
//     const roomsWithLocation = filteredRooms.filter(room => {
//       if (!room.location) return false;

//       const lat = parseFloat(room.location?.lat || room.location?.latitude);
//       const lng = parseFloat(room.location?.lng || room.location?.longitude);

//       return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
//     });

//     console.log(`Found ${roomsWithLocation.length} rooms with valid coordinates`);

//     if (roomsWithLocation.length === 0) {
//       // If no rooms with location, center on India
//       mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
//       return;
//     }

//     // Add markers for each room
//     roomsWithLocation.forEach(room => {
//       const lat = parseFloat(room.location.lat || room.location.latitude);
//       const lng = parseFloat(room.location.lng || room.location.longitude);

//       // Check if room is available based on current date
//       const isAvailableNow = room.isAvailable;

//       // Use availability for marker color
//       const markerColor = isAvailableNow ? '#22c55e' : '#ef4444';

//       // Add a subtle ring if within range filter
//       const ringStyle = (radiusFilter.enabled && room.distanceFromMe)
//         ? `outline: 2px solid #3b82f6; outline-offset: 2px;`
//         : '';

//       const marker = window.L.marker([lat, lng], {
//         icon: window.L.divIcon({
//           className: 'custom-marker',
//           html: `<div style="
//             background-color: ${markerColor}; 
//             width: 24px; 
//             height: 24px; 
//             border-radius: 50%; 
//             border: 3px solid white; 
//             box-shadow: 0 2px 10px rgba(0,0,0,0.3);
//             cursor: pointer;
//             transition: transform 0.2s;
//             ${ringStyle}
//           "></div>`,
//           iconSize: [24, 24],
//           iconAnchor: [12, 12]
//         })
//       }).addTo(mapInstanceRef.current);

//       const distanceText = room.distanceFromMe
//         ? `<p style="margin: 0 0 8px; font-size: 12px; color: #3b82f6;">📍 ${room.distanceFromMe} km from you</p>`
//         : '';

//       const popupContent = `
//         <div style="
//           padding: 16px; 
//           min-width: 240px; 
//           background: white; 
//           position: relative;
//           z-index: 9999;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.2);
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//         ">
//           <h3 style="
//             margin: 0 0 8px; 
//             font-size: 18px; 
//             font-weight: bold; 
//             color: #1e293b;
//           ">${room.title}</h3>

//           <p style="
//             margin: 0 0 8px; 
//             font-size: 16px; 
//             color: #2563eb; 
//             font-weight: bold;
//           ">$${room.pricePerDay}/night</p>

//           <p style="
//             margin: 0 0 8px; 
//             font-size: 14px; 
//             color: #64748b;
//             display: flex;
//             gap: 12px;
//           ">
//             <span>🛏️ ${room.noOfBeds} beds</span>
//             <span>📏 ${room.roomSize} sqft</span>
//           </p>

//           ${distanceText}

//           <p style="
//             margin: 0 0 12px; 
//             font-size: 14px; 
//             color: ${isAvailableNow ? '#22c55e' : '#ef4444'}; 
//             font-weight: 500;
//           ">
//             ${isAvailableNow ? '✓ Available Now' : '✗ Currently Booked'}
//           </p>

//           <button 
//             onclick="window.selectRoom('${room._id}')"
//             style="
//               width: 100%; 
//               padding: 10px; 
//               background: #2563eb; 
//               color: white; 
//               border: none; 
//               border-radius: 8px; 
//               font-size: 14px; 
//               font-weight: 500; 
//               cursor: pointer;
//               transition: background 0.2s;
//             "
//             onmouseover="this.style.background='#1d4ed8'"
//             onmouseout="this.style.background='#2563eb'"
//           >
//             View Details
//           </button>
//         </div>
//       `;

//       marker.bindPopup(popupContent, {
//         className: 'custom-popup',
//         maxWidth: 300,
//         minWidth: 240
//       });

//       marker.on('click', () => {
//         setSelectedRoomFromMap(room);
//         setTimeout(() => marker.openPopup(), 100);

//         // Scroll to the room card after a short delay
//         setTimeout(() => {
//           const roomCard = document.getElementById(`room-card-${room._id}`);
//           if (roomCard) {
//             roomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             // Highlight the card
//             roomCard.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-50');
//             setTimeout(() => {
//               roomCard.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-50');
//             }, 2000);
//           }
//         }, 300);
//       });

//       markersRef.current.push(marker);
//     });

//     // After adding markers, zoom to show all filtered rooms (if radius filter is enabled)
//     if (radiusFilter.enabled) {
//       zoomToFilteredRooms(filteredRooms);
//     } else {
//       // If no rooms, stay on India view
//       if (roomsWithLocation.length === 0) {
//         mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
//       } else {
//         // Otherwise fit bounds to show all rooms
//         const bounds = roomsWithLocation.map(room => {
//           const lat = parseFloat(room.location.lat || room.location.latitude);
//           const lng = parseFloat(room.location.lng || room.location.longitude);
//           return [lat, lng];
//         });

//         if (myLocation) {
//           bounds.push([myLocation.lat, myLocation.lng]);
//         }

//         if (bounds.length > 0) {
//           mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
//         }
//       }
//     }
//   };

//   // Carousel navigation
//   const nextImage = (roomId, imagesLength, e) => {
//     e.stopPropagation();
//     setCarouselIndexes(prev => ({
//       ...prev,
//       [roomId]: ((prev[roomId] || 0) + 1) % imagesLength
//     }));
//   };

//   const prevImage = (roomId, imagesLength, e) => {
//     e.stopPropagation();
//     setCarouselIndexes(prev => ({
//       ...prev,
//       [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength
//     }));
//   };

//   // Popup carousel navigation
//   const nextPopupImage = (e) => {
//     e.stopPropagation();
//     if (selectedRoom && selectedRoom.images) {
//       setPopupCarouselIndex(prev =>
//         prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
//       );
//     }
//   };

//   const prevPopupImage = (e) => {
//     e.stopPropagation();
//     if (selectedRoom && selectedRoom.images) {
//       setPopupCarouselIndex(prev =>
//         prev === 0 ? selectedRoom.images.length - 1 : prev - 1
//       );
//     }
//   };

//   // Expose selectRoom to global scope
//   useEffect(() => {
//     window.selectRoom = (roomId) => {
//       const room = rooms.find(r => r._id === roomId);
//       if (room) {
//         setSelectedRoom(room);
//         setPopupCarouselIndex(0); // Reset popup carousel index
//       }
//     };
//     return () => {
//       delete window.selectRoom;
//     };
//   }, [rooms]);

//   // Check if user is logged in
//   const isLoggedIn = () => {
//     const token = Cookies.get('token');
//     return !!token && Object.keys(user).length > 0;
//   };

//   // Show login popup
//   const requireAuth = (action, room) => {
//     if (!isLoggedIn()) {
//       setPendingAction(action);
//       if (action === 'book') {
//         setSelectedRoomForBooking(room);
//       } else if (action === 'review') {
//         setSelectedRoomForReview(room);
//       }
//       setShowLoginPopup(true);
//       return false;
//     }
//     return true;
//   };

//   // Get auth headers
//   const getAuthHeaders = () => {
//     const token = Cookies.get('token');
//     return {
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // GET ALL ROOMS
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
//         console.log('Rooms fetched:', data);

//         const cleanedData = data.map(room => {
//           const { distanceFromMe, ...cleanRoom } = room;
//           return cleanRoom;
//         });

//         setRooms(cleanedData);
//         setFilteredRooms(cleanedData);

//         cleanedData.forEach(room => {
//           fetchRoomReviews(room._id);
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GET ROOM REVIEWS
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

//   // CREATE BOOKING with advance payment
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
//           bookingEndDate: new Date(bookingForm.bookingEndDate).toISOString(),
//           advance: parseFloat(bookingForm.advance) || 0,
//           advancemethod: bookingForm.advanceMethod
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({
//           type: 'success',
//           text: '✅ Room booked successfully!'
//         });
//         setShowBookingModal(false);
//         setBookingForm({
//           bookingStartDate: '',
//           bookingEndDate: '',
//           advance: 0,
//           advanceMethod: 'cash'
//         });
//         fetchAllRooms(); // Refresh rooms to update availability
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

//   // CREATE/UPDATE REVIEW
//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!selectedRoomForReview) return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       let response;
//       if (reviewForm.isEditing) {
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
//           text: reviewForm.isEditing ? '✅ Review updated!' : '✅ Review added!'
//         });
//         setShowReviewModal(false);
//         setReviewForm({ rating: 5, comment: '', isEditing: false, reviewId: null });
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

//   // Get user's review
//   const getUserReview = (roomId) => {
//     const reviews = userReviews[roomId] || [];
//     return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
//   };

//   // Handle search and filters
//   useEffect(() => {
//     let filtered = [...rooms];

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter(room =>
//         room.title?.toLowerCase().includes(query) ||
//         room.description?.toLowerCase().includes(query) ||
//         room.location?.city?.toLowerCase().includes(query) ||
//         room.location?.country?.toLowerCase().includes(query)
//       );
//     }

//     if (filters.minPrice) {
//       filtered = filtered.filter(room => room.pricePerDay >= Number(filters.minPrice));
//     }
//     if (filters.maxPrice) {
//       filtered = filtered.filter(room => room.pricePerDay <= Number(filters.maxPrice));
//     }
//     if (filters.beds) {
//       filtered = filtered.filter(room => room.noOfBeds >= Number(filters.beds));
//     }
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
//     if (!requireAuth('book', room)) return;
//     setSelectedRoomForBooking(room);
//     setShowBookingModal(true);
//   };

//   const openReviewModal = (room) => {
//     if (!requireAuth('review', room)) return;

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

//   const handleLoginFromPopup = () => {
//     setShowLoginPopup(false);
//     navigate('/login');
//   };

//   const handleRegisterFromPopup = () => {
//     setShowLoginPopup(false);
//     navigate('/register');
//   };

//   // Open in Google Maps
//   const openInGoogleMaps = (location) => {
//     if (!location) return;

//     let url = '#';
//     if (location.lat || location.latitude) {
//       const lat = location.lat || location.latitude;
//       const lng = location.lng || location.longitude;
//       url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
//     } else if (location.city || location.country) {
//       const address = [location.city, location.state, location.country].filter(Boolean).join(', ');
//       url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
//     }

//     if (url !== '#') {
//       window.open(url, '_blank');
//     }
//   };

//   const clearSelectedRoomFromMap = () => {
//     setSelectedRoomFromMap(null);
//   };

//   const toggleFilterPanel = () => {
//     setShowFilterPanel(!showFilterPanel);
//   };

//   const roomsWithLocationCount = filteredRooms.filter(room =>
//     room.location && (room.location.lat || room.location.latitude)
//   ).length;

//   // Get display rooms - show 4-5 cards for non-logged in users
//   const getDisplayRooms = () => {
//     if (isLoggedIn()) {
//       return filteredRooms;
//     }
//     // Show first 4-5 rooms for non-logged in users (minimum 4, maximum 5)
//     const displayCount = Math.min(filteredRooms.length, 5);
//     return filteredRooms.slice(0, displayCount);
//   };

//   const displayRooms = getDisplayRooms();
//   const hasMoreRooms = !isLoggedIn() && rooms.length > 5;

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Map Styles */}
//       <style>{`
//         .custom-marker {
//           cursor: pointer;
//         }
//         .custom-marker:hover div {
//           transform: scale(1.2);
//           transition: transform 0.2s;
//         }

//         @keyframes pulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
//           }
//         }

//         .my-location-marker {
//           cursor: pointer;
//           z-index: 1000 !important;
//         }

//         .leaflet-popup-content-wrapper {
//           background: white !important;
//           padding: 0 !important;
//           border-radius: 12px !important;
//           overflow: hidden !important;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
//           border: 1px solid #e2e8f0 !important;
//           opacity: 1 !important;
//           backdrop-filter: none !important;
//           -webkit-backdrop-filter: none !important;
//         }

//         .leaflet-popup-content {
//           margin: 0 !important;
//           min-width: 240px !important;
//           max-width: 300px !important;
//           background: white !important;
//           opacity: 1 !important;
//         }

//         .leaflet-popup-tip {
//           background: white !important;
//           box-shadow: none !important;
//           border: 1px solid #e2e8f0 !important;
//         }

//         .leaflet-popup {
//           z-index: 9999 !important;
//         }

//         .leaflet-popup-close-button {
//           display: none !important;
//         }

//         .leaflet-tile {
//           filter: brightness(0.95) contrast(0.9);
//         }

//         .leaflet-tile-pane {
//           opacity: 0.9;
//         }

//         .leaflet-container {
//           z-index: 1 !important;
//         }

//         .leaflet-pane {
//           z-index: 2 !important;
//         }

//         .fixed.inset-0 {
//           z-index: 10000 !important;
//         }

//         .z-50, .z-\\[60\\], .z-\\[100\\] {
//           z-index: 10000 !important;
//         }

//         .carousel-container {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//         }

//         .carousel-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: opacity 0.3s ease;
//         }

//         .carousel-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(0,0,0,0.5);
//           color: white;
//           border: none;
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 20;
//           transition: all 0.2s;
//         }

//         .carousel-btn:hover {
//           background: rgba(0,0,0,0.8);
//           transform: translateY(-50%) scale(1.1);
//         }

//         .carousel-btn.prev {
//           left: 5px;
//         }

//         .carousel-btn.next {
//           right: 5px;
//         }

//         .carousel-indicators {
//           position: absolute;
//           bottom: 5px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 4px;
//           z-index: 20;
//         }

//         .carousel-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           transition: all 0.2s;
//           cursor: pointer;
//         }

//         .carousel-dot:hover {
//           background: rgba(255,255,255,0.8);
//         }

//         .carousel-dot.active {
//           background: white;
//           width: 12px;
//           border-radius: 3px;
//         }

//         .popup-carousel {
//           position: relative;
//           width: 100%;
//           height: 200px;
//           overflow: hidden;
//           border-radius: 8px;
//           margin-bottom: 16px;
//         }

//         .popup-carousel-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .popup-carousel-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(0,0,0,0.6);
//           color: white;
//           border: none;
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 30;
//           transition: all 0.2s;
//         }

//         .popup-carousel-btn:hover {
//           background: rgba(0,0,0,0.9);
//           transform: translateY(-50%) scale(1.1);
//         }

//         .popup-carousel-btn.prev {
//           left: 10px;
//         }

//         .popup-carousel-btn.next {
//           right: 10px;
//         }

//         .popup-carousel-indicators {
//           position: absolute;
//           bottom: 10px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 6px;
//           z-index: 30;
//         }

//         .popup-carousel-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           transition: all 0.2s;
//           cursor: pointer;
//         }

//         .popup-carousel-dot:hover {
//           background: rgba(255,255,255,0.8);
//         }

//         .popup-carousel-dot.active {
//           background: white;
//           width: 16px;
//           border-radius: 4px;
//         }

//         /* Map location button */
//         .leaflet-control-custom {
//           background: white;
//           border: 2px solid rgba(0,0,0,0.1);
//           border-radius: 4px;
//           padding: 8px 12px;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.2);
//           transition: all 0.2s;
//           margin-right: 10px;
//           margin-top: 10px;
//         }
//         .leaflet-control-custom:hover {
//           background-color: #f0f0f0;
//           transform: scale(1.02);
//         }

//         /* Room card highlight animation */
//         .ring-highlight {
//           animation: highlightPulse 1.5s infinite;
//         }
//       `}</style>

//       {/* Mobile Header */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-xl font-bold text-slate-800">🏨 RoomFinder</h1>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
//           >
//             <span className="material-icons">
//               {mobileMenuOpen ? 'close' : 'menu'}
//             </span>
//           </button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-50">
//             <div className="space-y-3">
//               {!isLoggedIn() ? (
//                 <>
//                   <button
//                     onClick={() => {
//                       navigate('/login');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">login</span>
//                     Login
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/register');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">person_add</span>
//                     Register
//                   </button>
//                 </>
//               ) : (
//                 <div className="px-4 py-3 bg-blue-50 rounded-lg">
//                   <p className="text-sm font-medium text-blue-800">Welcome, {user.name}!</p>
//                   <p className="text-xs text-blue-600 mt-1 capitalize">{user.role}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Desktop Header */}
//         <div className="hidden lg:flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800">Find Your Perfect Stay</h1>
//             <p className="text-slate-500 mt-1">Discover and book amazing rooms</p>
//           </div>
//         </div>

//         {/* Location Error */}
//         {locationError && (
//           <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
//             <div className="flex items-start gap-3">
//               <span className="material-icons text-amber-600">location_off</span>
//               <div className="flex-1">
//                 <p className="text-sm text-amber-800">{locationError}</p>
//                 {locationPermission === 'denied' && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     To enable location access:
//                     <br />• Chrome: Click the lock icon in address bar → Site settings → Location → Allow
//                     <br />• Firefox: Click the shield icon → Blocked → Allow temporarily
//                     <br />• Safari: Safari menu → Settings → Websites → Location → Allow
//                   </p>
//                 )}
//                 <button
//                   onClick={getMyLocation}
//                   className="mt-2 px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors"
//                 >
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Login Banner */}
//         {!isLoggedIn() && (
//           <div className="mt-4 lg:mt-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex items-start sm:items-center gap-3">
//                 <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
//                   <span className="material-icons text-white text-sm">info</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Login to Book Rooms & Leave Reviews</h3>
//                   <p className="text-xs sm:text-sm text-blue-600 mt-0.5">
//                     You're browsing as a guest. Sign in to book rooms and share your experiences!
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2 w-full sm:w-auto">
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
//                 >
//                   <span className="material-icons text-sm">login</span>
//                   Login
//                 </button>
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="flex-1 sm:flex-none px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <span className="material-icons text-sm">person_add</span>
//                   Register
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Message */}
//         {message.text && (
//           <div className={`mt-4 mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${message.type === 'success'
//             ? 'bg-green-50 text-green-800 border border-green-200'
//             : 'bg-red-50 text-red-800 border border-red-200'
//             }`}>
//             <span className={`material-icons flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//               {message.type === 'success' ? 'check_circle' : 'error'}
//             </span>
//             <span className="flex-1 break-words">{message.text}</span>
//           </div>
//         )}

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search Box */}
//             <div className="flex-1 relative">
//               <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
//               <input
//                 type="text"
//                 placeholder="Search rooms..."
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {/* Filter Button */}
//             <button
//               onClick={toggleFilterPanel}
//               className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${showFilterPanel
//                 ? 'bg-blue-600 text-white'
//                 : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                 }`}
//             >
//               <span className="material-icons text-sm">filter_list</span>
//               Filters
//               {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
//                 <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
//                   !
//                 </span>
//               )}
//             </button>
//           </div>

//           {/* Filter Panel */}
//           {showFilterPanel && (
//             <div className="mt-4 pt-4 border-t border-slate-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Min Price ($)</label>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.minPrice}
//                     onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Max Price ($)</label>
//                   <input
//                     type="number"
//                     placeholder="1000"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.maxPrice}
//                     onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Min Beds</label>
//                   <input
//                     type="number"
//                     placeholder="1"
//                     min="1"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.beds}
//                     onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-slate-600 mb-1">Min Size (sqft)</label>
//                   <input
//                     type="number"
//                     placeholder="20"
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={filters.minSize}
//                     onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
//                   />
//                 </div>
//               </div>

//               {/* Radius Filter */}
//               <div className="mt-4 pt-4 border-t border-slate-200">
//                 <div className="flex items-center gap-3 mb-3">
//                   <input
//                     type="checkbox"
//                     id="radiusFilter"
//                     checked={radiusFilter.enabled}
//                     onChange={(e) => setRadiusFilter({ ...radiusFilter, enabled: e.target.checked })}
//                     className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor="radiusFilter" className="text-sm font-medium text-slate-700">
//                     Search near my location
//                   </label>
//                 </div>

//                 {radiusFilter.enabled && (
//                   <div className="ml-7">
//                     <label className="block text-xs font-medium text-slate-600 mb-2">
//                       Distance: {radiusFilter.distance} {radiusFilter.unit}
//                     </label>
//                     <input
//                       type="range"
//                       min="5"
//                       max="200"
//                       step="5"
//                       value={radiusFilter.distance}
//                       onChange={(e) => setRadiusFilter({ ...radiusFilter, distance: parseInt(e.target.value) })}
//                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
//                     />
//                     <div className="flex justify-between text-xs text-slate-500 mt-1">
//                       <span>5 km</span>
//                       <span>50 km</span>
//                       <span>100 km</span>
//                       <span>150 km</span>
//                       <span>200 km</span>
//                     </div>

//                     {!myLocation && (
//                       <p className="text-xs text-amber-600 mt-2">
//                         Please click location button on map first
//                       </p>
//                     )}

//                     {myLocation && (
//                       <p className="text-xs text-blue-600 mt-2">
//                         🎯 Showing rooms within {radiusFilter.distance}km of your location
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Clear Filters Button */}
//               {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
//                 <div className="mt-3 flex justify-end">
//                   <button
//                     onClick={() => {
//                       setFilters({ minPrice: '', maxPrice: '', beds: '', minSize: '' });
//                       setRadiusFilter({ enabled: false, distance: 50, unit: 'km' });
//                       setFilteredRooms(rooms);
//                       if (mapInstanceRef.current && window.L) {
//                         setTimeout(updateMapMarkers, 100);
//                       }
//                     }}
//                     className="text-xs text-blue-600 hover:text-blue-800"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Results Count */}
//           <div className="mt-3 text-xs text-slate-500">
//             Found <span className="font-semibold text-blue-600">{filteredRooms.length}</span> rooms
//             {!isLoggedIn() && filteredRooms.length > 5 && (
//               <span className="ml-1 text-amber-600">(Showing 5 of {filteredRooms.length} - Login to see all)</span>
//             )}
//             {radiusFilter.enabled && myLocation && (
//               <span className="ml-1">within {radiusFilter.distance}km of your location</span>
//             )}
//           </div>
//         </div>

//         {/* Map Section */}
//         <div className="mb-8">
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="material-icons text-blue-600">map</span>
//                 <h3 className="text-sm font-semibold text-slate-700">Room Locations</h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                   {roomsWithLocationCount} room{roomsWithLocationCount !== 1 ? 's' : ''} on map
//                 </span>
//               </div>
//             </div>
//             {mapError ? (
//               <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-slate-100">
//                 <div className="text-center">
//                   <span className="material-icons text-4xl text-slate-400 mb-2">map</span>
//                   <p className="text-slate-500">Failed to load map</p>
//                   <button
//                     onClick={() => {
//                       setMapError(false);
//                       setMapRetryCount(0);
//                       loadLeafletScript();
//                     }}
//                     className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 ref={mapRef}
//                 className={`w-full h-[300px] sm:h-[400px] transition-all duration-300 ${(showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom)
//                   ? 'pointer-events-none opacity-90'
//                   : 'pointer-events-auto opacity-100'
//                   }`}
//                 style={{
//                   minHeight: '300px',
//                   position: 'relative',
//                   zIndex: (showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom) ? 1 : 10
//                 }}
//               />
//             )}
//           </div>
//         </div>

//         {/* Selected Room from Map */}
//         {selectedRoomFromMap && (
//           <div className="mb-6">
//             <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-3 mb-3 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="material-icons text-blue-600">location_on</span>
//                 <p className="text-sm text-blue-800">
//                   Room selected from map: <span className="font-semibold">{selectedRoomFromMap.title}</span>
//                   {selectedRoomFromMap.distanceFromMe && (
//                     <span className="ml-2 text-xs bg-blue-200 px-2 py-0.5 rounded-full">
//                       {selectedRoomFromMap.distanceFromMe} km from you
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <button
//                 onClick={clearSelectedRoomFromMap}
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 <span className="material-icons text-sm">close</span>
//               </button>
//             </div>

//             {/* Mini Room Card */}
//             <div
//               id={`room-card-${selectedRoomFromMap._id}`}
//               className="bg-white rounded-xl border-2 border-blue-400 shadow-lg overflow-hidden cursor-pointer"
//               onClick={() => setSelectedRoom(selectedRoomFromMap)}
//             >
//               <div className="flex flex-col sm:flex-row">
//                 <div className="sm:w-48 h-32 bg-slate-100">
//                   {selectedRoomFromMap.images && selectedRoomFromMap.images.length > 0 ? (
//                     <img
//                       src={selectedRoomFromMap.images[0]}
//                       alt={selectedRoomFromMap.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                       <span className="material-icons text-3xl text-slate-400">image</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 p-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-semibold text-slate-800">{selectedRoomFromMap.title}</h3>
//                       <p className="text-xs text-slate-500 mt-1 line-clamp-1">{selectedRoomFromMap.description}</p>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedRoomFromMap.isAvailable
//                       ? 'bg-green-100 text-green-700'
//                       : 'bg-amber-100 text-amber-700'
//                       }`}>
//                       {selectedRoomFromMap.isAvailable ? 'Available' : 'Booked'}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-4 mt-3">
//                     <span className="text-lg font-bold text-blue-600">{formatCurrency(selectedRoomFromMap.pricePerDay)}</span>
//                     <span className="text-xs text-slate-500">/night</span>
//                   </div>

//                   <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">bed</span>
//                       {selectedRoomFromMap.noOfBeds} bed
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">straighten</span>
//                       {selectedRoomFromMap.roomSize} sqft
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">people</span>
//                       {selectedRoomFromMap.maxOccupancy}
//                     </span>
//                   </div>

//                   <div className="mt-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedRoom(selectedRoomFromMap);
//                       }}
//                       className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                       View full details →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rooms Grid */}
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <>
//             <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${isLoggedIn() ? '3' : '4'} gap-4 sm:gap-6`}>
//               {displayRooms.map((room) => {
//                 const reviews = userReviews[room._id] || [];
//                 const avgRating = calculateAverageRating(reviews);
//                 const userReview = getUserReview(room._id);
//                 const isSelectedFromMap = selectedRoomFromMap?._id === room._id;
//                 const currentImageIndex = carouselIndexes[room._id] || 0;
//                 const hasMultipleImages = room.images && room.images.length > 1;
//                 const isAvailableNow = room.isAvailable;

//                 return (
//                   <div
//                     key={room._id}
//                     id={`room-card-${room._id}`}
//                     className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer ${isSelectedFromMap
//                       ? 'border-blue-400 ring-4 ring-blue-200'
//                       : 'border-slate-200'
//                       }`}
//                     onClick={() => {
//                       setSelectedRoom(room);
//                       setPopupCarouselIndex(0);
//                     }}
//                     onMouseEnter={() => handleMouseEnter(room._id)}
//                     onMouseLeave={() => handleMouseLeave(room._id)}
//                   >
//                     {/* Room Image with Auto-Play Carousel */}
//                     <div className="h-40 sm:h-48 bg-slate-100 relative group">
//                       {room.images && room.images.length > 0 ? (
//                         <div className="carousel-container">
//                           <img
//                             src={room.images[currentImageIndex]}
//                             alt={`${room.title} - Image ${currentImageIndex + 1}`}
//                             className="carousel-image"
//                           />

//                           {/* Carousel Controls - Always visible on hover */}
//                           {hasMultipleImages && (
//                             <>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   prevImage(room._id, room.images.length, e);
//                                 }}
//                                 className="carousel-btn prev opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <span className="material-icons text-sm">chevron_left</span>
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   nextImage(room._id, room.images.length, e);
//                                 }}
//                                 className="carousel-btn next opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <span className="material-icons text-sm">chevron_right</span>
//                               </button>
//                             </>
//                           )}

//                           {/* Image Indicators */}
//                           <div className="carousel-indicators">
//                             {room.images.map((_, idx) => (
//                               <div
//                                 key={idx}
//                                 className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setCarouselIndexes(prev => ({ ...prev, [room._id]: idx }));
//                                 }}
//                               />
//                             ))}
//                           </div>

//                           {/* Image Counter */}
//                           <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
//                             {currentImageIndex + 1} / {room.images.length}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-slate-200">
//                           <span className="material-icons text-4xl text-slate-400">image</span>
//                         </div>
//                       )}

//                       {/* Availability Badge */}
//                       <div className="absolute top-2 right-2 z-20">
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isAvailableNow
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-amber-100 text-amber-700'
//                           }`}>
//                           {isAvailableNow ? 'Available' : 'Booked'}
//                         </span>
//                       </div>

//                       {/* Price Tag */}
//                       <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold z-20">
//                         {formatCurrency(room.pricePerDay)} <span className="text-xs font-normal">/night</span>
//                       </div>

//                       {/* Distance Badge */}
//                       {room.distanceFromMe && (
//                         <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-20">
//                           📍 {room.distanceFromMe} km
//                         </div>
//                       )}
//                     </div>

//                     {/* Room Details */}
//                     <div className="p-3 sm:p-4">
//                       <h3 className="font-semibold text-slate-800 text-base sm:text-lg mb-1 line-clamp-1">{room.title}</h3>
//                       <p className="text-xs sm:text-sm text-slate-500 mb-2 line-clamp-2">{room.description}</p>

//                       {/* Rating Section */}
//                       <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
//                         <div className="flex items-center gap-1">
//                           <div className="flex">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <span key={star} className={`material-icons text-xs sm:text-sm ${star <= avgRating ? 'text-amber-400' : 'text-slate-300'
//                                 }`}>
//                                 star
//                               </span>
//                             ))}
//                           </div>
//                           <span className="text-xs text-slate-500">
//                             ({reviews.length})
//                           </span>
//                         </div>

//                         {isLoggedIn() && userReview && (
//                           <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
//                             Your review: {userReview.rating}★
//                           </span>
//                         )}
//                       </div>

//                       {/* Room Features */}
//                       <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mb-4">
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">bed</span>
//                           {room.noOfBeds} bed
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">straighten</span>
//                           {room.roomSize} sqft
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">people</span>
//                           {room.maxOccupancy}
//                         </span>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (isAvailableNow) {
//                               openBookingModal(room);
//                             }
//                           }}
//                           disabled={!isAvailableNow}
//                           className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isAvailableNow
//                             ? 'bg-blue-600 text-white hover:bg-blue-700'
//                             : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                             }`}
//                           style={{
//                             background: 'linear-gradient(135deg, #EAB308 0%, #EF4444 100%)',
   
//                             color: 'white'
//                           }}
//                         >
//                           {isAvailableNow ? 'Book' : 'Unavail'}
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openReviewModal(room);
//                           }}
//                           className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${userReview
//                             ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
//                             : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                             }`}
//                         >
//                           {userReview ? 'Update' : 'Review'}
//                         </button>
//                         {room.location && (room.location.lat || room.location.latitude) && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openInGoogleMaps(room.location);
//                             }}
//                             className="px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
//                             title="View on Google Maps"
//                           >
//                             <span className="material-icons text-sm">map</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* View More Button for Non-Logged In Users */}
//             {hasMoreRooms && (
//               <div className="mt-8 text-center">
//                 <button
//                   onClick={() => setShowLoginPopup(true)}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg"
//                 >
//                   Login to View All {rooms.length} Rooms
//                 </button>
//               </div>
//             )}

//             {displayRooms.length === 0 && (
//               <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-slate-200 px-4">
//                 <span className="material-icons text-5xl text-slate-300 mb-4">search_off</span>
//                 <p className="text-slate-500 text-lg">No rooms found</p>
//                 <p className="text-slate-400 text-sm mt-1">Try adjusting your search filters</p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Login Popup Modal */}
//         {showLoginPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all">
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">Login Required</h2>
//                 <button
//                   onClick={() => {
//                     setShowLoginPopup(false);
//                     setPendingAction(null);
//                     setSelectedRoomForBooking(null);
//                     setSelectedRoomForReview(null);
//                   }}
//                   className="p-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <div className="p-4 sm:p-6">
//                 <div className="text-center mb-6">
//                   <span className="material-icons text-5xl text-blue-600 mb-3">lock</span>
//                   <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                     {pendingAction === 'book' ? 'Want to book this room?' : pendingAction === 'review' ? 'Want to leave a review?' : 'Want to see all rooms?'}
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Please login or create an account to continue
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <button
//                     onClick={handleLoginFromPopup}
//                     className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">login</span>
//                     Login to Your Account
//                   </button>

//                   <button
//                     onClick={handleRegisterFromPopup}
//                     className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">person_add</span>
//                     Create New Account
//                   </button>

//                   <button
//                     onClick={() => {
//                       setShowLoginPopup(false);
//                       setPendingAction(null);
//                       setSelectedRoomForBooking(null);
//                       setSelectedRoomForReview(null);
//                     }}
//                     className="w-full px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
//                   >
//                     Maybe Later
//                   </button>
//                 </div>

//                 <div className="mt-6 text-center text-xs text-slate-400">
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Room Details Modal with Clickable Carousel */}
//         {selectedRoom && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4" onClick={() => setSelectedRoom(null)}>
//             <div className="bg-white rounded-xl max-w-3xl w-[50vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1">{selectedRoom.title}</h2>
//                 <button
//                   onClick={() => setSelectedRoom(null)}
//                   className="p-2 hover:bg-slate-100 rounded-full flex-shrink-0"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <div className="p-4 sm:p-6">
//                 {/* Clickable Popup Carousel */}
//                 {selectedRoom.images && selectedRoom.images.length > 0 && (
//                   <div className="mb-6">
//                     <div className="popup-carousel">
//                       <img
//                         src={selectedRoom.images[popupCarouselIndex]}
//                         alt={`${selectedRoom.title} - Image ${popupCarouselIndex + 1}`}
//                         className="popup-carousel-image"
//                       />

//                       {/* Carousel Controls */}
//                       {selectedRoom.images.length > 1 && (
//                         <>
//                           <button
//                             onClick={prevPopupImage}
//                             className="popup-carousel-btn prev"
//                           >
//                             <span className="material-icons">chevron_left</span>
//                           </button>
//                           <button
//                             onClick={nextPopupImage}
//                             className="popup-carousel-btn next"
//                           >
//                             <span className="material-icons">chevron_right</span>
//                           </button>
//                         </>
//                       )}

//                       {/* Image Indicators */}
//                       <div className="popup-carousel-indicators">
//                         {selectedRoom.images.map((_, idx) => (
//                           <div
//                             key={idx}
//                             className={`popup-carousel-dot ${idx === popupCarouselIndex ? 'active' : ''}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setPopupCarouselIndex(idx);
//                             }}
//                           />
//                         ))}
//                       </div>

//                       {/* Image Counter */}
//                       <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//                         {popupCarouselIndex + 1} / {selectedRoom.images.length}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{selectedRoom.title}</h3>
//                     <p className="text-sm sm:text-base text-slate-600">{selectedRoom.description}</p>
//                   </div>

//                   {/* Reviews Section */}
//                   <div className="bg-slate-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
//                       <span className="material-icons text-amber-400">star</span>
//                       Guest Reviews ({userReviews[selectedRoom._id]?.length || 0})
//                     </h4>

//                     {userReviews[selectedRoom._id]?.length > 0 ? (
//                       <div className="space-y-3 max-h-48 overflow-y-auto">
//                         {userReviews[selectedRoom._id].map((review) => (
//                           <div key={review._id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
//                             <div className="flex flex-wrap items-center justify-between gap-2">
//                               <span className="text-sm font-medium text-slate-800">
//                                 {review.userId?.name || 'Guest'}
//                                 {isLoggedIn() && review.userId?._id === user.id && (
//                                   <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                                     You
//                                   </span>
//                                 )}
//                               </span>
//                               <span className="text-xs text-slate-500">
//                                 {formatDate(review.createdAt)}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-1 mt-1">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <span key={star} className={`material-icons text-xs ${star <= review.rating ? 'text-amber-400' : 'text-slate-300'
//                                   }`}>
//                                   star
//                                 </span>
//                               ))}
//                             </div>
//                             <p className="text-xs sm:text-sm text-slate-600 mt-1">{review.comment}</p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-slate-500 text-center py-4">
//                         No reviews yet for this room.
//                       </p>
//                     )}
//                   </div>

//                   {/* Room Specifications */}
//                   <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-4 rounded-lg">
//                     <div>
//                       <p className="text-xs text-slate-500">Price per night</p>
//                       <p className="text-lg sm:text-xl font-bold text-blue-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Status</p>
//                       <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${selectedRoom.isAvailable
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-amber-100 text-amber-700'
//                         }`}>
//                         {selectedRoom.isAvailable ? 'Available' : 'Booked'}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Beds</p>
//                       <p className="font-medium">{selectedRoom.noOfBeds}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Room Size</p>
//                       <p className="font-medium">{selectedRoom.roomSize} sqft</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Max Occupancy</p>
//                       <p className="font-medium">{selectedRoom.maxOccupancy} guests</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500">Checkout Time</p>
//                       <p className="font-medium">{selectedRoom.timeForCheckout}:00</p>
//                     </div>
//                   </div>

//                   {/* Location with Google Maps Button */}
//                   <div className="bg-slate-50 p-4 rounded-lg">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
//                       <p className="text-xs text-slate-500 font-semibold">Location</p>
//                       {selectedRoom.location && (selectedRoom.location.lat || selectedRoom.location.latitude || selectedRoom.location.city) && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openInGoogleMaps(selectedRoom.location);
//                           }}
//                           className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors w-full sm:w-auto"
//                         >
//                           <span className="material-icons text-sm">map</span>
//                           View on Google Maps
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-sm break-words">
//                       {selectedRoom.location?.city || ''} {selectedRoom.location?.state || ''} {selectedRoom.location?.country || ''}
//                     </p>
//                     {selectedRoom.distanceFromMe && (
//                       <p className="text-xs text-blue-600 mt-1">
//                         📍 {selectedRoom.distanceFromMe} km from your location
//                       </p>
//                     )}
//                     <p className="text-xs text-slate-500 mt-1 break-words">
//                       Coordinates: {selectedRoom.location?.lat || selectedRoom.location?.latitude || 'N/A'}, {selectedRoom.location?.lng || selectedRoom.location?.longitude || 'N/A'}
//                     </p>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                     {isLoggedIn() ? (
//                       <>
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             openBookingModal(selectedRoom);
//                           }}
//                           disabled={!selectedRoom.isAvailable}
//                           className={`w-full sm:flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${selectedRoom.isAvailable
//                             ? 'bg-blue-600 text-white hover:bg-blue-700'
//                             : 'bg-slate-100 text-slate-400 cursor-not-allowed'
//                             }`}
//                         >
//                           {selectedRoom.isAvailable ? 'Book This Room' : 'Not Available'}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             openReviewModal(selectedRoom);
//                           }}
//                           className="w-full sm:flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors"
//                         >
//                           Write a Review
//                         </button>
//                       </>
//                     ) : (
//                       <div className="w-full">
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             setShowLoginPopup(true);
//                             setPendingAction('book');
//                             setSelectedRoomForBooking(selectedRoom);
//                           }}
//                           className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
//                         >
//                           Login to Book
//                         </button>
//                         <p className="text-xs text-center text-slate-500 mt-2">
//                           New user?{' '}
//                           <button
//                             onClick={() => {
//                               setSelectedRoom(null);
//                               setShowLoginPopup(true);
//                               setPendingAction('register');
//                             }}
//                             className="text-blue-600 hover:underline"
//                           >
//                             Register here
//                           </button>
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Image Zoom Modal */}
//         {showImageZoom && selectedImage && (
//           <div
//             className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] p-4"
//             onClick={() => {
//               setShowImageZoom(false);
//               setSelectedImage(null);
//             }}
//           >
//             <div className="relative w-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
//               <button
//                 onClick={() => {
//                   setShowImageZoom(false);
//                   setSelectedImage(null);
//                 }}
//                 className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
//               >
//                 <span className="material-icons text-2xl sm:text-3xl">close</span>
//               </button>

//               <img
//                 src={selectedImage}
//                 alt="Zoomed view"
//                 className="w-full h-full object-contain max-h-[80vh] sm:max-h-[90vh] rounded-lg"
//               />
//             </div>
//           </div>
//         )}

//         {/* Booking Modal with Advance Payment */}
//         {showBookingModal && selectedRoomForBooking && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">Book Room</h2>
//                 <button
//                   onClick={() => setShowBookingModal(false)}
//                   className="p-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <form onSubmit={createBooking} className="p-4 sm:p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
//                   <input
//                     type="text"
//                     value={selectedRoomForBooking.title}
//                     disabled
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">Price per night</label>
//                   <input
//                     type="text"
//                     value={formatCurrency(selectedRoomForBooking.pricePerDay)}
//                     disabled
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Check-in Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       required
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       value={bookingForm.bookingStartDate}
//                       onChange={(e) => setBookingForm({ ...bookingForm, bookingStartDate: e.target.value })}
//                       min={new Date().toISOString().slice(0, 16)}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Check-out Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       required
//                       className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       value={bookingForm.bookingEndDate}
//                       onChange={(e) => setBookingForm({ ...bookingForm, bookingEndDate: e.target.value })}
//                       min={bookingForm.bookingStartDate}
//                     />
//                   </div>
//                 </div>

//                 {/* Advance Payment Section */}
//                 <div className="border-t border-slate-200 pt-4">
//                   <h3 className="text-md font-semibold text-slate-700 mb-3">Advance Payment</h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Advance Amount ($)
//                       </label>
//                       <input
//                         type="number"
//                         min="0"
//                         max={selectedRoomForBooking.pricePerDay * 10}
//                         step="10"
//                         value={bookingForm.advance}
//                         onChange={(e) => setBookingForm({ ...bookingForm, advance: parseFloat(e.target.value) || 0 })}
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       />
//                       <p className="text-xs text-slate-500 mt-1">
//                         Leave 0 for no advance
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-1">
//                         Payment Method
//                       </label>
//                       <select
//                         value={bookingForm.advanceMethod}
//                         onChange={(e) => setBookingForm({ ...bookingForm, advanceMethod: e.target.value })}
//                         className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="card">Card</option>
//                         <option value="upi">UPI</option>
//                         <option value="bank">Bank Transfer</option>
//                       </select>
//                     </div>
//                   </div>

//                   {bookingForm.advance > 0 && (
//                     <div className="mt-3 p-3 bg-blue-50 rounded-lg">
//                       <p className="text-xs text-blue-700">
//                         <span className="font-semibold">Note:</span> You will pay ${bookingForm.advance} as advance payment via {bookingForm.advanceMethod}.
//                         {bookingForm.advance < selectedRoomForBooking.pricePerDay && (
//                           <span className="block mt-1">Remaining ${selectedRoomForBooking.pricePerDay - bookingForm.advance} will be paid at check-in.</span>
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
//                      style={{
//                             background: 'linear-gradient(135deg, #EAB308 0%, #EF4444 100%)',
   
//                             color: 'white'
//                           }}
//                   >
//                     {loading ? 'Booking...' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Review Modal */}
//         {showReviewModal && selectedRoomForReview && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-slate-800">
//                   {reviewForm.isEditing ? 'Update Your Review' : 'Write a Review'}
//                 </h2>
//                 <button
//                   onClick={() => setShowReviewModal(false)}
//                   className="p-2 hover:bg-slate-100 rounded-full"
//                 >
//                   <span className="material-icons">close</span>
//                 </button>
//               </div>

//               <form onSubmit={submitReview} className="p-4 sm:p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
//                   <input
//                     type="text"
//                     value={selectedRoomForReview.title}
//                     disabled
//                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Rating <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex flex-wrap items-center gap-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setReviewForm({ ...reviewForm, rating: star })}
//                         className="focus:outline-none"
//                       >
//                         <span className={`material-icons text-2xl sm:text-3xl ${star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-300'
//                           }`}>
//                           star
//                         </span>
//                       </button>
//                     ))}
//                     <span className="text-sm text-slate-500 ml-2">{reviewForm.rating}/5</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Comment (Optional)
//                   </label>
//                   <textarea
//                     rows="4"
//                     placeholder="Share your experience..."
//                     className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none"
//                     value={reviewForm.comment}
//                     onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//                   />
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
//                   >
//                     {loading ? 'Submitting...' : reviewForm.isEditing ? 'Update Review' : 'Submit Review'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default Dashboard;



































// import React, { useState, useEffect, useRef } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import 'material-icons/iconfont/material-icons.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [user, setUser] = useState({});
//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [selectedRoomFromMap, setSelectedRoomFromMap] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
//   const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
//   const [userReviews, setUserReviews] = useState({});
//   const [pendingAction, setPendingAction] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showFilterPanel, setShowFilterPanel] = useState(false);
//   const [mapError, setMapError] = useState(false);
//   const [mapRetryCount, setMapRetryCount] = useState(0);
//   const [mapReady, setMapReady] = useState(false);

//   // My location state
//   const [myLocation, setMyLocation] = useState(null);
//   const [myLocationMarker, setMyLocationMarker] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [isGettingLocation, setIsGettingLocation] = useState(false);
//   const [locationPermission, setLocationPermission] = useState('prompt');

//   // Radius filter state
//   const [radiusFilter, setRadiusFilter] = useState({
//     enabled: false,
//     distance: 50,
//     unit: 'km'
//   });

//   // Image carousel state
//   const [carouselIndexes, setCarouselIndexes] = useState({});
//   const [popupCarouselIndex, setPopupCarouselIndex] = useState(0);
//   const [autoPlayIntervals, setAutoPlayIntervals] = useState({});
//   const [isHovering, setIsHovering] = useState({});

//   // Map refs
//   const mapRef = useRef(null);
//   const markersRef = useRef([]);
//   const mapInstanceRef = useRef(null);
//   const popupCarouselTimerRef = useRef(null);

//   // Image zoom states
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showImageZoom, setShowImageZoom] = useState(false);

//   // Room search filters
//   const [filters, setFilters] = useState({
//     minPrice: '',
//     maxPrice: '',
//     beds: '',
//     minSize: ''
//   });

//   // Booking form state with advance payment
//   const [bookingForm, setBookingForm] = useState({
//     bookingStartDate: '',
//     bookingEndDate: '',
//     advance: 0,
//     advanceMethod: 'cash'
//   });

//   // Review form state
//   const [reviewForm, setReviewForm] = useState({
//     rating: 5,
//     comment: '',
//     isEditing: false,
//     reviewId: null
//   });

//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const GEOAPIFY_API_KEY = 'e9331e493ca845b0a445921eca3f278b';

//   // India center coordinates
//   const INDIA_CENTER = [20.5937, 78.9629];
//   const INDIA_ZOOM = 5;

//   // Load Leaflet script
//   useEffect(() => {
//     loadLeafletScript();
//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//       // Clear all auto-play intervals
//       Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, []);

//   // Load user data
//   useEffect(() => {
//     const userData = Cookies.get('user');
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//     }
//     fetchAllRooms();

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//     }
//   }, []);

//   // Update map when filtered rooms change
//   useEffect(() => {
//     if (mapInstanceRef.current && window.L) {
//       console.log('Filtered rooms changed, updating markers');
//       setTimeout(updateMapMarkers, 300);
//     }
//   }, [filteredRooms]);

//   // Force map update when rooms data changes
//   useEffect(() => {
//     if (rooms.length > 0 && mapInstanceRef.current && window.L) {
//       console.log('Rooms loaded, updating map markers');
//       setTimeout(updateMapMarkers, 1000);
//     }
//   }, [rooms]);

//   // Retry map initialization
//   useEffect(() => {
//     if (mapRetryCount < 3 && rooms.length > 0 && !mapInstanceRef.current && !mapError) {
//       const timer = setTimeout(() => {
//         console.log(`Retrying map initialization (attempt ${mapRetryCount + 1})`);
//         loadLeafletScript();
//         setMapRetryCount(prev => prev + 1);
//       }, 2000);

//       return () => clearTimeout(timer);
//     }
//   }, [mapRetryCount, rooms, mapError]);

//   // Control map interactions when modals are open
//   useEffect(() => {
//     if (!mapInstanceRef.current) return;

//     const isAnyModalOpen = showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom;

//     try {
//       if (isAnyModalOpen) {
//         mapInstanceRef.current.dragging.disable();
//         mapInstanceRef.current.touchZoom.disable();
//         mapInstanceRef.current.doubleClickZoom.disable();
//         mapInstanceRef.current.scrollWheelZoom.disable();
//         mapInstanceRef.current.boxZoom.disable();
//         mapInstanceRef.current.keyboard.disable();

//         if (mapInstanceRef.current.getContainer()) {
//           mapInstanceRef.current.getContainer().style.cursor = 'default';
//         }
//       } else {
//         mapInstanceRef.current.dragging.enable();
//         mapInstanceRef.current.touchZoom.enable();
//         mapInstanceRef.current.doubleClickZoom.enable();
//         mapInstanceRef.current.scrollWheelZoom.enable();
//         mapInstanceRef.current.boxZoom.enable();
//         mapInstanceRef.current.keyboard.enable();

//         if (mapInstanceRef.current.getContainer()) {
//           mapInstanceRef.current.getContainer().style.cursor = '';
//         }
//       }
//     } catch (e) {
//       console.log('Error toggling map interactions:', e);
//     }
//   }, [showBookingModal, showReviewModal, showLoginPopup, selectedRoom, showImageZoom]);

//   // Apply radius filter
//   useEffect(() => {
//     if (radiusFilter.enabled && myLocation) {
//       applyRadiusFilter();
//     } else if (!radiusFilter.enabled) {
//       setFilteredRooms(rooms);
//       if (mapInstanceRef.current && window.L) {
//         setTimeout(() => {
//           updateMapMarkers();
//           // Zoom out to show all rooms
//           if (rooms.length > 0) {
//             const allRoomsWithLocation = rooms.filter(room =>
//               room.location && (room.location.lat || room.location.latitude)
//             );
//             if (allRoomsWithLocation.length > 0) {
//               const bounds = allRoomsWithLocation.map(room => [
//                 parseFloat(room.location.lat || room.location.latitude),
//                 parseFloat(room.location.lng || room.location.longitude)
//               ]);
//               if (myLocation) {
//                 bounds.push([myLocation.lat, myLocation.lng]);
//               }
//               mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
//             }
//           }
//         }, 100);
//       }
//     }
//   }, [radiusFilter.enabled, radiusFilter.distance, myLocation]);

//   // Force map update when filteredRooms changes
//   useEffect(() => {
//     if (mapInstanceRef.current && window.L) {
//       console.log('Filtered rooms changed, updating map markers');
//       updateMapMarkers();
//     }
//   }, [filteredRooms]);

//   // Start auto-play for all rooms when they load
//   useEffect(() => {
//     if (rooms.length > 0) {
//       startAllAutoPlay();
//     }
//     return () => {
//       // Cleanup intervals on unmount
//       Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
//     };
//   }, [rooms]);

//   // Auto-play for popup carousel when selectedRoom changes
//   useEffect(() => {
//     if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 1) {
//       // Clear previous timer
//       if (popupCarouselTimerRef.current) {
//         clearInterval(popupCarouselTimerRef.current);
//       }

//       // Start new timer
//       popupCarouselTimerRef.current = setInterval(() => {
//         setPopupCarouselIndex(prev =>
//           prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
//         );
//       }, 3000);
//     }

//     return () => {
//       if (popupCarouselTimerRef.current) {
//         clearInterval(popupCarouselTimerRef.current);
//       }
//     };
//   }, [selectedRoom]);

//   const loadLeafletScript = () => {
//     if (window.L) {
//       initializeMap();
//       return;
//     }

//     const link = document.createElement('link');
//     link.rel = 'stylesheet';
//     link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//     document.head.appendChild(link);

//     const script = document.createElement('script');
//     script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//     script.async = true;
//     script.onload = () => {
//       console.log('Leaflet loaded successfully');
//       initializeMap();
//     };
//     script.onerror = () => {
//       console.error('Failed to load Leaflet');
//       setMapError(true);
//     };
//     document.head.appendChild(script);
//   };

//   const initializeMap = () => {
//     if (!mapRef.current || !window.L) {
//       console.log('Map container or Leaflet not ready');
//       return;
//     }

//     try {
//       console.log('Initializing map...');

//       // Center on India by default
//       mapInstanceRef.current = window.L.map(mapRef.current).setView(INDIA_CENTER, INDIA_ZOOM);

//       setMapReady(true);

//       const isRetina = window.L.Browser.retina;

//       const tileUrl = isRetina
//         ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${GEOAPIFY_API_KEY}`
//         : `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

//       window.L.tileLayer(tileUrl, {
//         attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
//         maxZoom: 20
//       }).addTo(mapInstanceRef.current);

//       setMapError(false);

//       // Add custom location button to map (like Google Maps)
//       addLocationButtonToMap();

//       setTimeout(updateMapMarkers, 500);

//     } catch (error) {
//       console.error('Error initializing map:', error);
//       setMapError(true);
//     }
//   };

//   // Add custom location button to map (like Google Maps)
//   const addLocationButtonToMap = () => {
//     if (!mapInstanceRef.current) return;

//     // Create custom control
//     const locationControl = window.L.control({ position: 'topright' });

//     locationControl.onAdd = () => {
//       const button = window.L.DomUtil.create('button', 'leaflet-control-custom');
//       button.innerHTML = `
//         <span class="material-icons" style="font-size: 20px;">my_location</span>
//         <span style="margin-left: 4px;">My Location</span>
//       `;
//       button.style.backgroundColor = 'white';
//       button.style.border = '2px solid #EAB308';
//       button.style.borderRadius = '4px';
//       button.style.padding = '6px 12px';
//       button.style.cursor = 'pointer';
//       button.style.display = 'flex';
//       button.style.alignItems = 'center';
//       button.style.gap = '4px';
//       button.style.fontSize = '14px';
//       button.style.fontWeight = '500';
//       button.style.color = '#1F2937';
//       button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

//       button.onclick = () => {
//         getMyLocation();
//       };

//       return button;
//     };

//     locationControl.addTo(mapInstanceRef.current);
//   };

//   // Auto-play function
//   const startAutoPlay = (roomId, imagesLength) => {
//     if (imagesLength <= 1) return;

//     // Clear existing interval for this room
//     if (autoPlayIntervals[roomId]) {
//       clearInterval(autoPlayIntervals[roomId]);
//     }

//     // Start new interval
//     const interval = setInterval(() => {
//       setCarouselIndexes(prev => {
//         // Don't advance if hovering
//         if (isHovering[roomId]) return prev;

//         const currentIndex = prev[roomId] || 0;
//         const nextIndex = currentIndex === (imagesLength - 1) ? 0 : currentIndex + 1;
//         return { ...prev, [roomId]: nextIndex };
//       });
//     }, 3000);

//     setAutoPlayIntervals(prev => ({ ...prev, [roomId]: interval }));
//   };

//   const startAllAutoPlay = () => {
//     rooms.forEach(room => {
//       if (room.images && room.images.length > 1) {
//         startAutoPlay(room._id, room.images.length);
//       }
//     });
//   };

//   const handleMouseEnter = (roomId) => {
//     setIsHovering(prev => ({ ...prev, [roomId]: true }));
//   };

//   const handleMouseLeave = (roomId) => {
//     setIsHovering(prev => ({ ...prev, [roomId]: false }));
//   };

//   // Get user's location and jump to it
//   const getMyLocation = () => {
//     setIsGettingLocation(true);
//     setLocationError(null);

//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       setLocationPermission('denied');
//       setIsGettingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log('Got location:', latitude, longitude);

//         setMyLocation({ lat: latitude, lng: longitude });
//         setLocationPermission('granted');
//         setIsGettingLocation(false);

//         if (mapInstanceRef.current && window.L) {
//           // Remove existing my location marker
//           if (myLocationMarker) {
//             mapInstanceRef.current.removeLayer(myLocationMarker);
//           }

//           // Create pulsing red dot for my location
//           const marker = window.L.marker([latitude, longitude], {
//             icon: window.L.divIcon({
//               className: 'my-location-marker',
//               html: `<div style="
//                 background-color: #EF4444;
//                 width: 20px;
//                 height: 20px;
//                 border-radius: 50%;
//                 border: 3px solid white;
//                 box-shadow: 0 0 0 2px rgba(239,68,68,0.5), 0 2px 10px rgba(0,0,0,0.3);
//                 animation: pulse 1.5s infinite;
//               "></div>`,
//               iconSize: [20, 20],
//               iconAnchor: [10, 10]
//             })
//           }).addTo(mapInstanceRef.current);

//           marker.bindPopup('📍 You are here');
//           setMyLocationMarker(marker);

//           // JUMP TO MY LOCATION - center map with zoom level 12
//           mapInstanceRef.current.setView([latitude, longitude], 12);

//           // Apply radius filter if enabled
//           if (radiusFilter.enabled) {
//             applyRadiusFilter();
//           } else {
//             // Update markers to show all rooms
//             updateMapMarkers();
//           }
//         }
//       },
//       (error) => {
//         setIsGettingLocation(false);

//         let errorMessage = '';
//         let permissionState = 'denied';

//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage = '📍 Location permission denied. Please click "Allow" when your browser asks for location access.';
//             permissionState = 'denied';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage = '📍 Location information is unavailable. Please check your device settings.';
//             permissionState = 'denied';
//             break;
//           case error.TIMEOUT:
//             errorMessage = '📍 Location request timed out. Please try again.';
//             permissionState = 'prompt';
//             break;
//           default:
//             errorMessage = '📍 An unknown error occurred. Please try again.';
//             permissionState = 'prompt';
//         }

//         setLocationError(errorMessage);
//         setLocationPermission(permissionState);
//         console.error('Geolocation error:', error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       }
//     );
//   };

//   // Calculate distance
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;
//     return distance;
//   };

//   // Apply radius filter and zoom to show only rooms within range
//   const applyRadiusFilter = () => {
//     if (!myLocation || !radiusFilter.enabled) return;

//     console.log('Applying radius filter:', radiusFilter.distance, 'km');

//     // Filter rooms within radius and add distance property
//     const filtered = rooms
//       .filter(room => {
//         if (!room.location) return false;

//         const roomLat = parseFloat(room.location.lat || room.location.latitude);
//         const roomLng = parseFloat(room.location.lng || room.location.longitude);

//         if (isNaN(roomLat) || isNaN(roomLng)) return false;

//         const distance = calculateDistance(
//           myLocation.lat, myLocation.lng,
//           roomLat, roomLng
//         );

//         // Store distance on the room object
//         room.distanceFromMe = Math.round(distance * 10) / 10;

//         return distance <= radiusFilter.distance;
//       })
//       .map(room => ({ ...room })); // Create copy to avoid reference issues

//     console.log(`Found ${filtered.length} rooms within ${radiusFilter.distance}km`);

//     // Update filtered rooms
//     setFilteredRooms(filtered);

//     // Force map to update and zoom to filtered rooms
//     if (mapInstanceRef.current && window.L) {
//       setTimeout(() => {
//         updateMapMarkers();
//         // After markers are updated, zoom to show all filtered rooms
//         zoomToFilteredRooms(filtered);
//       }, 100);
//     }
//   };

//   // Zoom map to show only the filtered rooms
//   const zoomToFilteredRooms = (filteredRoomsList) => {
//     if (!mapInstanceRef.current || !window.L) return;

//     // Get rooms with valid coordinates
//     const roomsWithLocation = filteredRoomsList.filter(room => {
//       if (!room.location) return false;

//       const lat = parseFloat(room.location?.lat || room.location?.latitude);
//       const lng = parseFloat(room.location?.lng || room.location?.longitude);

//       return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
//     });

//     if (roomsWithLocation.length === 0) {
//       // If no rooms in range, center on my location with zoom level 10
//       if (myLocation) {
//         mapInstanceRef.current.setView([myLocation.lat, myLocation.lng], 10);
//       }
//       return;
//     }

//     // Calculate bounds from all filtered rooms
//     const bounds = roomsWithLocation.map(room => {
//       const lat = parseFloat(room.location.lat || room.location.latitude);
//       const lng = parseFloat(room.location.lng || room.location.longitude);
//       return [lat, lng];
//     });

//     // Add my location to bounds to keep it in view
//     if (myLocation) {
//       bounds.push([myLocation.lat, myLocation.lng]);
//     }

//     if (bounds.length > 0) {
//       // Fit map to bounds with padding
//       mapInstanceRef.current.fitBounds(bounds, {
//         padding: [50, 50],
//         maxZoom: 15 // Limit max zoom to prevent zooming too close
//       });
//     }
//   };

//   // Update map markers
//   const updateMapMarkers = () => {
//     if (!mapInstanceRef.current || !window.L) {
//       console.log('Map not ready for markers');
//       return;
//     }

//     console.log('Updating map markers...');
//     console.log('Total rooms:', filteredRooms.length);

//     // Clear existing markers (keep my location marker)
//     markersRef.current.forEach(marker => marker.remove());
//     markersRef.current = [];

//     // Get rooms with valid coordinates from filteredRooms
//     const roomsWithLocation = filteredRooms.filter(room => {
//       if (!room.location) return false;

//       const lat = parseFloat(room.location?.lat || room.location?.latitude);
//       const lng = parseFloat(room.location?.lng || room.location?.longitude);

//       return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
//     });

//     console.log(`Found ${roomsWithLocation.length} rooms with valid coordinates`);

//     if (roomsWithLocation.length === 0) {
//       // If no rooms with location, center on India
//       mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
//       return;
//     }

//     // Add markers for each room
//     roomsWithLocation.forEach(room => {
//       const lat = parseFloat(room.location.lat || room.location.latitude);
//       const lng = parseFloat(room.location.lng || room.location.longitude);

//       // Check if room is available based on current date
//       const isAvailableNow = room.isAvailable;

//       // Use availability for marker color
//       const markerColor = isAvailableNow ? '#22c55e' : '#EF4444';

//       // Add a subtle ring if within range filter
//       const ringStyle = (radiusFilter.enabled && room.distanceFromMe)
//         ? `outline: 2px solid #EAB308; outline-offset: 2px;`
//         : '';

//       const marker = window.L.marker([lat, lng], {
//         icon: window.L.divIcon({
//           className: 'custom-marker',
//           html: `<div style="
//             background-color: ${markerColor}; 
//             width: 24px; 
//             height: 24px; 
//             border-radius: 50%; 
//             border: 3px solid white; 
//             box-shadow: 0 2px 10px rgba(0,0,0,0.3);
//             cursor: pointer;
//             transition: transform 0.2s;
//             ${ringStyle}
//           "></div>`,
//           iconSize: [24, 24],
//           iconAnchor: [12, 12]
//         })
//       }).addTo(mapInstanceRef.current);

//       const distanceText = room.distanceFromMe
//         ? `<p style="margin: 0 0 8px; font-size: 12px; color: #EAB308;">📍 ${room.distanceFromMe} km from you</p>`
//         : '';

//       const popupContent = `
//         <div style="
//           padding: 16px; 
//           min-width: 240px; 
//           background: white; 
//           position: relative;
//           z-index: 9999;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//           border-radius: 12px;
//           border: 1px solid #EAB308;
//         ">
//           <h3 style="
//             margin: 0 0 8px; 
//             font-size: 18px; 
//             font-weight: bold; 
//             color: #1F2937;
//           ">${room.title}</h3>

//           <p style="
//             margin: 0 0 8px; 
//             font-size: 16px; 
//             color: #EF4444; 
//             font-weight: bold;
//           ">$${room.pricePerDay}/night</p>

//           <p style="
//             margin: 0 0 8px; 
//             font-size: 14px; 
//             color: #6B7280;
//             display: flex;
//             gap: 12px;
//           ">
//             <span>🛏️ ${room.noOfBeds} beds</span>
//             <span>📏 ${room.roomSize} sqft</span>
//           </p>

//           ${distanceText}

//           <p style="
//             margin: 0 0 12px; 
//             font-size: 14px; 
//             color: ${isAvailableNow ? '#22c55e' : '#EF4444'}; 
//             font-weight: 500;
//           ">
//             ${isAvailableNow ? '✓ Available Now' : '✗ Currently Booked'}
//           </p>

//           <button 
//             onclick="window.selectRoom('${room._id}')"
//             style="
//               width: 100%; 
//               padding: 10px; 
//               background: #EAB308; 
//               color: white; 
//               border: none; 
//               border-radius: 8px; 
//               font-size: 14px; 
//               font-weight: 500; 
//               cursor: pointer;
//               transition: background 0.2s;
//             "
//             onmouseover="this.style.background='#EF4444'"
//             onmouseout="this.style.background='#EAB308'"
//           >
//             View Details
//           </button>
//         </div>
//       `;

//       marker.bindPopup(popupContent, {
//         className: 'custom-popup',
//         maxWidth: 300,
//         minWidth: 240
//       });

//       marker.on('click', () => {
//         setSelectedRoomFromMap(room);
//         setTimeout(() => marker.openPopup(), 100);

//         // Scroll to the room card after a short delay
//         setTimeout(() => {
//           const roomCard = document.getElementById(`room-card-${room._id}`);
//           if (roomCard) {
//             roomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             // Highlight the card with Yellow ring
//             roomCard.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-50');
//             setTimeout(() => {
//               roomCard.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-50');
//             }, 2000);
//           }
//         }, 300);
//       });

//       markersRef.current.push(marker);
//     });

//     // After adding markers, zoom to show all filtered rooms (if radius filter is enabled)
//     if (radiusFilter.enabled) {
//       zoomToFilteredRooms(filteredRooms);
//     } else {
//       // If no rooms, stay on India view
//       if (roomsWithLocation.length === 0) {
//         mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
//       } else {
//         // Otherwise fit bounds to show all rooms
//         const bounds = roomsWithLocation.map(room => {
//           const lat = parseFloat(room.location.lat || room.location.latitude);
//           const lng = parseFloat(room.location.lng || room.location.longitude);
//           return [lat, lng];
//         });

//         if (myLocation) {
//           bounds.push([myLocation.lat, myLocation.lng]);
//         }

//         if (bounds.length > 0) {
//           mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
//         }
//       }
//     }
//   };

//   // Carousel navigation
//   const nextImage = (roomId, imagesLength, e) => {
//     e.stopPropagation();
//     setCarouselIndexes(prev => ({
//       ...prev,
//       [roomId]: ((prev[roomId] || 0) + 1) % imagesLength
//     }));
//   };

//   const prevImage = (roomId, imagesLength, e) => {
//     e.stopPropagation();
//     setCarouselIndexes(prev => ({
//       ...prev,
//       [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength
//     }));
//   };

//   // Popup carousel navigation
//   const nextPopupImage = (e) => {
//     e.stopPropagation();
//     if (selectedRoom && selectedRoom.images) {
//       setPopupCarouselIndex(prev =>
//         prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
//       );
//     }
//   };

//   const prevPopupImage = (e) => {
//     e.stopPropagation();
//     if (selectedRoom && selectedRoom.images) {
//       setPopupCarouselIndex(prev =>
//         prev === 0 ? selectedRoom.images.length - 1 : prev - 1
//       );
//     }
//   };

//   // Expose selectRoom to global scope
//   useEffect(() => {
//     window.selectRoom = (roomId) => {
//       const room = rooms.find(r => r._id === roomId);
//       if (room) {
//         setSelectedRoom(room);
//         setPopupCarouselIndex(0); // Reset popup carousel index
//       }
//     };
//     return () => {
//       delete window.selectRoom;
//     };
//   }, [rooms]);

//   // Check if user is logged in
//   const isLoggedIn = () => {
//     const token = Cookies.get('token');
//     return !!token && Object.keys(user).length > 0;
//   };

//   // Show login popup
//   const requireAuth = (action, room) => {
//     if (!isLoggedIn()) {
//       setPendingAction(action);
//       if (action === 'book') {
//         setSelectedRoomForBooking(room);
//       } else if (action === 'review') {
//         setSelectedRoomForReview(room);
//       }
//       setShowLoginPopup(true);
//       return false;
//     }
//     return true;
//   };

//   // Get auth headers
//   const getAuthHeaders = () => {
//     const token = Cookies.get('token');
//     return {
//       'Authorization': `Bearer ${token}`
//     };
//   };

//   // GET ALL ROOMS
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
//         console.log('Rooms fetched:', data);

//         const cleanedData = data.map(room => {
//           const { distanceFromMe, ...cleanRoom } = room;
//           return cleanRoom;
//         });

//         setRooms(cleanedData);
//         setFilteredRooms(cleanedData);

//         cleanedData.forEach(room => {
//           fetchRoomReviews(room._id);
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GET ROOM REVIEWS
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

//   // CREATE BOOKING with advance payment
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
//           bookingEndDate: new Date(bookingForm.bookingEndDate).toISOString(),
//           advance: parseFloat(bookingForm.advance) || 0,
//           advancemethod: bookingForm.advanceMethod
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage({
//           type: 'success',
//           text: '✅ Room booked successfully!'
//         });
//         setShowBookingModal(false);
//         setBookingForm({
//           bookingStartDate: '',
//           bookingEndDate: '',
//           advance: 0,
//           advanceMethod: 'cash'
//         });
//         fetchAllRooms(); // Refresh rooms to update availability
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

//   // CREATE/UPDATE REVIEW
//   const submitReview = async (e) => {
//     e.preventDefault();
//     if (!selectedRoomForReview) return;

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       let response;
//       if (reviewForm.isEditing) {
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
//           text: reviewForm.isEditing ? '✅ Review updated!' : '✅ Review added!'
//         });
//         setShowReviewModal(false);
//         setReviewForm({ rating: 5, comment: '', isEditing: false, reviewId: null });
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

//   // Get user's review
//   const getUserReview = (roomId) => {
//     const reviews = userReviews[roomId] || [];
//     return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
//   };

//   // Handle search and filters
//   useEffect(() => {
//     let filtered = [...rooms];

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase().trim();
//       filtered = filtered.filter(room =>
//         room.title?.toLowerCase().includes(query) ||
//         room.description?.toLowerCase().includes(query) ||
//         room.location?.city?.toLowerCase().includes(query) ||
//         room.location?.country?.toLowerCase().includes(query)
//       );
//     }

//     if (filters.minPrice) {
//       filtered = filtered.filter(room => room.pricePerDay >= Number(filters.minPrice));
//     }
//     if (filters.maxPrice) {
//       filtered = filtered.filter(room => room.pricePerDay <= Number(filters.maxPrice));
//     }
//     if (filters.beds) {
//       filtered = filtered.filter(room => room.noOfBeds >= Number(filters.beds));
//     }
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
//     if (!requireAuth('book', room)) return;
//     setSelectedRoomForBooking(room);
//     setShowBookingModal(true);
//   };

//   const openReviewModal = (room) => {
//     if (!requireAuth('review', room)) return;

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

//   const handleLoginFromPopup = () => {
//     setShowLoginPopup(false);
//     navigate('/login');
//   };

//   const handleRegisterFromPopup = () => {
//     setShowLoginPopup(false);
//     navigate('/register');
//   };

//   // Open in Google Maps
//   const openInGoogleMaps = (location) => {
//     if (!location) return;

//     let url = '#';
//     if (location.lat || location.latitude) {
//       const lat = location.lat || location.latitude;
//       const lng = location.lng || location.longitude;
//       url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
//     } else if (location.city || location.country) {
//       const address = [location.city, location.state, location.country].filter(Boolean).join(', ');
//       url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
//     }

//     if (url !== '#') {
//       window.open(url, '_blank');
//     }
//   };

//   const clearSelectedRoomFromMap = () => {
//     setSelectedRoomFromMap(null);
//   };

//   const toggleFilterPanel = () => {
//     setShowFilterPanel(!showFilterPanel);
//   };

//   const roomsWithLocationCount = filteredRooms.filter(room =>
//     room.location && (room.location.lat || room.location.latitude)
//   ).length;

//   // Get display rooms - show 4-5 cards for non-logged in users
//   const getDisplayRooms = () => {
//     if (isLoggedIn()) {
//       return filteredRooms;
//     }
//     // Show first 4-5 rooms for non-logged in users (minimum 4, maximum 5)
//     const displayCount = Math.min(filteredRooms.length, 5);
//     return filteredRooms.slice(0, displayCount);
//   };

//   const displayRooms = getDisplayRooms();
//   const hasMoreRooms = !isLoggedIn() && rooms.length > 5;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-red-50">
//       {/* Map Styles - Updated with yellow/red theme */}
//       <style>{`
//         .custom-marker {
//           cursor: pointer;
//         }
//         .custom-marker:hover div {
//           transform: scale(1.2);
//           transition: transform 0.2s;
//         }

//         @keyframes pulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
//           }
//         }

//         .my-location-marker {
//           cursor: pointer;
//           z-index: 1000 !important;
//         }

//         .leaflet-popup-content-wrapper {
//           background: white !important;
//           padding: 0 !important;
//           border-radius: 12px !important;
//           overflow: hidden !important;
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
//           border: 1px solid #EAB308 !important;
//           opacity: 1 !important;
//         }

//         .leaflet-popup-content {
//           margin: 0 !important;
//           min-width: 240px !important;
//           max-width: 300px !important;
//           background: white !important;
//           opacity: 1 !important;
//         }

//         .leaflet-popup-tip {
//           background: white !important;
//           box-shadow: none !important;
//           border: 1px solid #EAB308 !important;
//         }

//         .leaflet-popup {
//           z-index: 9999 !important;
//         }

//         .leaflet-popup-close-button {
//           display: none !important;
//         }

//         .leaflet-tile {
//           filter: brightness(0.95) contrast(0.9);
//         }

//         .leaflet-tile-pane {
//           opacity: 0.9;
//         }

//         .leaflet-container {
//           z-index: 1 !important;
//         }

//         .leaflet-pane {
//           z-index: 2 !important;
//         }

//         .fixed.inset-0 {
//           z-index: 10000 !important;
//         }

//         .z-50, .z-\\[60\\], .z-\\[100\\] {
//           z-index: 10000 !important;
//         }

//         .carousel-container {
//           position: relative;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//         }

//         .carousel-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: opacity 0.3s ease;
//         }

//         .carousel-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(0,0,0,0.5);
//           color: white;
//           border: none;
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 20;
//           transition: all 0.2s;
//         }

//         .carousel-btn:hover {
//           background: #EAB308;
//           transform: translateY(-50%) scale(1.1);
//         }

//         .carousel-btn.prev {
//           left: 5px;
//         }

//         .carousel-btn.next {
//           right: 5px;
//         }

//         .carousel-indicators {
//           position: absolute;
//           bottom: 5px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 4px;
//           z-index: 20;
//         }

//         .carousel-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           transition: all 0.2s;
//           cursor: pointer;
//         }

//         .carousel-dot:hover {
//           background: #EAB308;
//         }

//         .carousel-dot.active {
//           background: #EF4444;
//           width: 12px;
//           border-radius: 3px;
//         }

//         .popup-carousel {
//           position: relative;
//           width: 100%;
//           height: 200px;
//           overflow: hidden;
//           border-radius: 8px;
//           margin-bottom: 16px;
//         }

//         .popup-carousel-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .popup-carousel-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(0,0,0,0.6);
//           color: white;
//           border: none;
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 30;
//           transition: all 0.2s;
//         }

//         .popup-carousel-btn:hover {
//           background: #EAB308;
//           transform: translateY(-50%) scale(1.1);
//         }

//         .popup-carousel-btn.prev {
//           left: 10px;
//         }

//         .popup-carousel-btn.next {
//           right: 10px;
//         }

//         .popup-carousel-indicators {
//           position: absolute;
//           bottom: 10px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 6px;
//           z-index: 30;
//         }

//         .popup-carousel-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: rgba(255,255,255,0.5);
//           transition: all 0.2s;
//           cursor: pointer;
//         }

//         .popup-carousel-dot:hover {
//           background: #EAB308;
//         }

//         .popup-carousel-dot.active {
//           background: #EF4444;
//           width: 16px;
//           border-radius: 4px;
//         }

//         /* Map location button */
//         .leaflet-control-custom {
//           background: white;
//           border: 2px solid #EAB308;
//           border-radius: 4px;
//           padding: 8px 12px;
//           font-size: 14px;
//           font-weight: 500;
//           cursor: pointer;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           transition: all 0.2s;
//           margin-right: 10px;
//           margin-top: 10px;
//           color: #1F2937;
//         }
//         .leaflet-control-custom:hover {
//           background-color: #FEF3C7;
//           border-color: #EF4444;
//           transform: scale(1.02);
//         }

//         /* Room card highlight animation */
//         .ring-highlight {
//           animation: highlightPulse 1.5s infinite;
//         }

//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -30px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
        
//         .animate-blob {
//           animation: blob 15s infinite ease-in-out;
//         }
        
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 20px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #EAB308;
//           border-radius: 20px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #EF4444;
//         }
//       `}</style>

//       {/* Decorative background elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute bottom-0 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//       </div>

//       {/* Mobile Header - Updated colors */}
//       <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">🏨 RoomFinder</h1>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2 rounded-lg hover:bg-yellow-50 transition-colors"
//           >
//             <span className="material-icons text-gray-700">
//               {mobileMenuOpen ? 'close' : 'menu'}
//             </span>
//           </button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg p-4 z-50">
//             <div className="space-y-3">
//               {!isLoggedIn() ? (
//                 <>
//                   <button
//                     onClick={() => {
//                       navigate('/login');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">login</span>
//                     Login
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate('/register');
//                       setMobileMenuOpen(false);
//                     }}
//                     className="w-full px-4 py-3 border-2 border-yellow-500 text-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-all flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">person_add</span>
//                     Register
//                   </button>
//                 </>
//               ) : (
//                 <div className="px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <p className="text-sm font-medium text-gray-900">Welcome, {user.name}!</p>
//                   <p className="text-xs text-red-600 mt-1 capitalize flex items-center gap-1">
//                     <span className="material-icons text-xs">verified</span>
//                     {user.role}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
//         {/* Desktop Header - Updated colors */}
//         <div className="hidden lg:flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
//               Find Your Perfect Stay
//             </h1>
//             <p className="text-gray-600 mt-1">Discover and book amazing rooms</p>
//           </div>
//         </div>

//         {/* Location Error - Updated colors */}
//         {locationError && (
//           <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <div className="flex items-start gap-3">
//               <span className="material-icons text-yellow-600">location_off</span>
//               <div className="flex-1">
//                 <p className="text-sm text-gray-800">{locationError}</p>
//                 {locationPermission === 'denied' && (
//                   <p className="text-xs text-yellow-600 mt-1">
//                     To enable location access:
//                     <br />• Chrome: Click the lock icon in address bar → Site settings → Location → Allow
//                     <br />• Firefox: Click the shield icon → Blocked → Allow temporarily
//                     <br />• Safari: Safari menu → Settings → Websites → Location → Allow
//                   </p>
//                 )}
//                 <button
//                   onClick={getMyLocation}
//                   className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
//                 >
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Login Banner - Updated to yellow/red gradient */}
//         {!isLoggedIn() && (
//           <div className="mt-4 lg:mt-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg p-4 shadow-lg">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex items-start sm:items-center gap-3 text-white">
//                 <div className="bg-white/20 rounded-full p-2">
//                   <span className="material-icons text-white">info</span>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-sm sm:text-base">Login to Book Rooms & Leave Reviews</h3>
//                   <p className="text-xs text-yellow-100 mt-0.5">
//                     You're browsing as a guest. Sign in to book rooms and share your experiences!
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2 w-full sm:w-auto">
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="flex-1 sm:flex-none px-4 py-2 bg-white text-red-600 rounded-lg text-xs sm:text-sm font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2"
//                 >
//                   <span className="material-icons text-sm">login</span>
//                   Login
//                 </button>
//                 <button
//                   onClick={() => navigate('/register')}
//                   className="flex-1 sm:flex-none px-4 py-2 bg-transparent border-2 border-white text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
//                 >
//                   <span className="material-icons text-sm">person_add</span>
//                   Register
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Message - Keep as is (success green, error red) */}
//         {message.text && (
//           <div className={`mt-4 mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${
//             message.type === 'success'
//               ? 'bg-green-50 text-green-800 border border-green-200'
//               : 'bg-red-50 text-red-800 border border-red-200'
//           }`}>
//             <span className={`material-icons flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
//               {message.type === 'success' ? 'check_circle' : 'error'}
//             </span>
//             <span className="flex-1 break-words">{message.text}</span>
//           </div>
//         )}

//         {/* Search and Filter Bar - Updated colors */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-3">
//             {/* Search Box */}
//             <div className="flex-1 relative">
//               <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
//               <input
//                 type="text"
//                 placeholder="Search rooms..."
//                 className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {/* Filter Button */}
//             <button
//               onClick={toggleFilterPanel}
//               className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                 showFilterPanel 
//                   ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               <span className="material-icons text-sm">filter_list</span>
//               Filters
//               {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
//                 <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
//                   !
//                 </span>
//               )}
//             </button>
//           </div>

//           {/* Filter Panel */}
//           {showFilterPanel && (
//             <div className="mt-4 pt-4 border-t border-gray-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">Min Price ($)</label>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
//                     value={filters.minPrice}
//                     onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">Max Price ($)</label>
//                   <input
//                     type="number"
//                     placeholder="1000"
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
//                     value={filters.maxPrice}
//                     onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">Min Beds</label>
//                   <input
//                     type="number"
//                     placeholder="1"
//                     min="1"
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
//                     value={filters.beds}
//                     onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">Min Size (sqft)</label>
//                   <input
//                     type="number"
//                     placeholder="20"
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
//                     value={filters.minSize}
//                     onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
//                   />
//                 </div>
//               </div>

//               {/* Radius Filter */}
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <div className="flex items-center gap-3 mb-3">
//                   <input
//                     type="checkbox"
//                     id="radiusFilter"
//                     checked={radiusFilter.enabled}
//                     onChange={(e) => setRadiusFilter({ ...radiusFilter, enabled: e.target.checked })}
//                     className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
//                   />
//                   <label htmlFor="radiusFilter" className="text-sm font-medium text-gray-700">
//                     Search near my location
//                   </label>
//                 </div>

//                 {radiusFilter.enabled && (
//                   <div className="ml-7">
//                     <label className="block text-xs font-medium text-gray-600 mb-2">
//                       Distance: {radiusFilter.distance} {radiusFilter.unit}
//                     </label>
//                     <input
//                       type="range"
//                       min="5"
//                       max="200"
//                       step="5"
//                       value={radiusFilter.distance}
//                       onChange={(e) => setRadiusFilter({ ...radiusFilter, distance: parseInt(e.target.value) })}
//                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
//                     />
//                     <div className="flex justify-between text-xs text-gray-500 mt-1">
//                       <span>5 km</span>
//                       <span>50 km</span>
//                       <span>100 km</span>
//                       <span>150 km</span>
//                       <span>200 km</span>
//                     </div>

//                     {!myLocation && (
//                       <p className="text-xs text-yellow-600 mt-2">
//                         Please click location button on map first
//                       </p>
//                     )}

//                     {myLocation && (
//                       <p className="text-xs text-red-600 mt-2">
//                         🎯 Showing rooms within {radiusFilter.distance}km of your location
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Clear Filters Button */}
//               {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
//                 <div className="mt-3 flex justify-end">
//                   <button
//                     onClick={() => {
//                       setFilters({ minPrice: '', maxPrice: '', beds: '', minSize: '' });
//                       setRadiusFilter({ enabled: false, distance: 50, unit: 'km' });
//                       setFilteredRooms(rooms);
//                       if (mapInstanceRef.current && window.L) {
//                         setTimeout(updateMapMarkers, 100);
//                       }
//                     }}
//                     className="text-xs text-red-600 hover:text-red-800"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Results Count */}
//           <div className="mt-3 text-xs text-gray-500">
//             Found <span className="font-semibold text-red-600">{filteredRooms.length}</span> rooms
//             {!isLoggedIn() && filteredRooms.length > 5 && (
//               <span className="ml-1 text-yellow-600">(Showing 5 of {filteredRooms.length} - Login to see all)</span>
//             )}
//             {radiusFilter.enabled && myLocation && (
//               <span className="ml-1">within {radiusFilter.distance}km of your location</span>
//             )}
//           </div>
//         </div>

//         {/* Map Section - Updated colors */}
//         <div className="mb-8">
//           <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//             <div className="p-3 bg-gradient-to-r from-yellow-50 to-red-50 border-b border-gray-200 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="material-icons text-red-500">map</span>
//                 <h3 className="text-sm font-semibold text-gray-700">Room Locations</h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs bg-white text-red-600 px-2 py-1 rounded-full shadow-sm border border-yellow-200">
//                   {roomsWithLocationCount} room{roomsWithLocationCount !== 1 ? 's' : ''} on map
//                 </span>
//               </div>
//             </div>
//             {mapError ? (
//               <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-gray-100">
//                 <div className="text-center">
//                   <span className="material-icons text-4xl text-gray-400 mb-2">map</span>
//                   <p className="text-gray-500">Failed to load map</p>
//                   <button 
//                     onClick={() => {
//                       setMapError(false);
//                       setMapRetryCount(0);
//                       loadLeafletScript();
//                     }}
//                     className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div 
//                 ref={mapRef}
//                 className={`w-full h-[300px] sm:h-[400px] transition-all duration-300 ${
//                   (showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom) 
//                     ? 'pointer-events-none opacity-90' 
//                     : 'pointer-events-auto opacity-100'
//                 }`}
//                 style={{ 
//                   minHeight: '300px',
//                   position: 'relative',
//                   zIndex: (showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom) ? 1 : 10
//                 }}
//               />
//             )}
//           </div>
//         </div>

//         {/* Selected Room from Map - Updated colors */}
//         {selectedRoomFromMap && (
//           <div className="mb-6">
//             <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-3 flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <span className="material-icons text-red-500">location_on</span>
//                 <p className="text-sm text-gray-800">
//                   Room selected from map: <span className="font-semibold">{selectedRoomFromMap.title}</span>
//                   {selectedRoomFromMap.distanceFromMe && (
//                     <span className="ml-2 text-xs bg-yellow-200 px-2 py-0.5 rounded-full">
//                       {selectedRoomFromMap.distanceFromMe} km from you
//                     </span>
//                   )}
//                 </p>
//               </div>
//               <button
//                 onClick={clearSelectedRoomFromMap}
//                 className="text-red-600 hover:text-red-800"
//               >
//                 <span className="material-icons text-sm">close</span>
//               </button>
//             </div>

//             {/* Mini Room Card - Updated colors */}
//             <div 
//               id={`room-card-${selectedRoomFromMap._id}`}
//               className="bg-white rounded-xl border-2 border-yellow-400 shadow-lg overflow-hidden cursor-pointer"
//               onClick={() => setSelectedRoom(selectedRoomFromMap)}
//             >
//               <div className="flex flex-col sm:flex-row">
//                 <div className="sm:w-48 h-32 bg-gray-100">
//                   {selectedRoomFromMap.images && selectedRoomFromMap.images.length > 0 ? (
//                     <img
//                       src={selectedRoomFromMap.images[0]}
//                       alt={selectedRoomFromMap.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                       <span className="material-icons text-3xl text-gray-400">image</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1 p-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{selectedRoomFromMap.title}</h3>
//                       <p className="text-xs text-gray-500 mt-1 line-clamp-1">{selectedRoomFromMap.description}</p>
//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       selectedRoomFromMap.isAvailable
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}>
//                       {selectedRoomFromMap.isAvailable ? 'Available' : 'Booked'}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-4 mt-3">
//                     <span className="text-lg font-bold text-red-600">{formatCurrency(selectedRoomFromMap.pricePerDay)}</span>
//                     <span className="text-xs text-gray-500">/night</span>
//                   </div>

//                   <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">bed</span>
//                       {selectedRoomFromMap.noOfBeds} bed
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">straighten</span>
//                       {selectedRoomFromMap.roomSize} sqft
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <span className="material-icons text-sm">people</span>
//                       {selectedRoomFromMap.maxOccupancy}
//                     </span>
//                   </div>

//                   <div className="mt-3">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedRoom(selectedRoomFromMap);
//                       }}
//                       className="text-xs text-red-600 hover:text-red-800 font-medium"
//                     >
//                       View full details →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rooms Grid - Updated colors */}
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="w-12 h-12 border-4 border-yellow-200 border-t-red-500 rounded-full animate-spin"></div>
//           </div>
//         ) : (
//           <>
//             <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${isLoggedIn() ? '3' : '4'} gap-4 sm:gap-6`}>
//               {displayRooms.map((room) => {
//                 const reviews = userReviews[room._id] || [];
//                 const avgRating = calculateAverageRating(reviews);
//                 const userReview = getUserReview(room._id);
//                 const isSelectedFromMap = selectedRoomFromMap?._id === room._id;
//                 const currentImageIndex = carouselIndexes[room._id] || 0;
//                 const hasMultipleImages = room.images && room.images.length > 1;
//                 const isAvailableNow = room.isAvailable;

//                 return (
//                   <div
//                     key={room._id}
//                     id={`room-card-${room._id}`}
//                     className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
//                       isSelectedFromMap 
//                         ? 'border-yellow-400 ring-4 ring-yellow-200' 
//                         : 'border-gray-200'
//                     } ${isAvailableNow ? '' : 'opacity-75'}`}
//                     onClick={() => {
//                       setSelectedRoom(room);
//                       setPopupCarouselIndex(0);
//                     }}
//                     onMouseEnter={() => handleMouseEnter(room._id)}
//                     onMouseLeave={() => handleMouseLeave(room._id)}
//                   >
//                     {/* Room Image with Auto-Play Carousel */}
//                     <div className="h-40 sm:h-48 bg-gray-100 relative group">
//                       {room.images && room.images.length > 0 ? (
//                         <div className="carousel-container">
//                           <img
//                             src={room.images[currentImageIndex]}
//                             alt={`${room.title} - Image ${currentImageIndex + 1}`}
//                             className="carousel-image"
//                           />

//                           {/* Carousel Controls - Always visible on hover */}
//                           {hasMultipleImages && (
//                             <>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   prevImage(room._id, room.images.length, e);
//                                 }}
//                                 className="carousel-btn prev opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <span className="material-icons text-sm">chevron_left</span>
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   nextImage(room._id, room.images.length, e);
//                                 }}
//                                 className="carousel-btn next opacity-0 group-hover:opacity-100 transition-opacity"
//                               >
//                                 <span className="material-icons text-sm">chevron_right</span>
//                               </button>
//                             </>
//                           )}

//                           {/* Image Indicators */}
//                           <div className="carousel-indicators">
//                             {room.images.map((_, idx) => (
//                               <div
//                                 key={idx}
//                                 className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setCarouselIndexes(prev => ({ ...prev, [room._id]: idx }));
//                                 }}
//                               />
//                             ))}
//                           </div>

//                           {/* Image Counter */}
//                           <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
//                             {currentImageIndex + 1} / {room.images.length}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                           <span className="material-icons text-4xl text-gray-400">image</span>
//                         </div>
//                       )}

//                       {/* Availability Badge */}
//                       <div className="absolute top-2 right-2 z-20">
//                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           isAvailableNow
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}>
//                           {isAvailableNow ? 'Available' : 'Booked'}
//                         </span>
//                       </div>

//                       {/* Price Tag */}
//                       <div className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold z-20 shadow-lg">
//                         {formatCurrency(room.pricePerDay)} <span className="text-xs font-normal">/night</span>
//                       </div>

//                       {/* Distance Badge */}
//                       {room.distanceFromMe && (
//                         <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-20 shadow-lg">
//                           📍 {room.distanceFromMe} km
//                         </div>
//                       )}
//                     </div>

//                     {/* Room Details */}
//                     <div className="p-3 sm:p-4">
//                       <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">{room.title}</h3>
//                       <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{room.description}</p>

//                       {/* Rating Section */}
//                       <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
//                         <div className="flex items-center gap-1">
//                           <div className="flex">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <span key={star} className={`material-icons text-xs sm:text-sm ${
//                                 star <= avgRating ? 'text-yellow-400' : 'text-gray-300'
//                               }`}>
//                                 star
//                               </span>
//                             ))}
//                           </div>
//                           <span className="text-xs text-gray-500">
//                             ({reviews.length})
//                           </span>
//                         </div>

//                         {isLoggedIn() && userReview && (
//                           <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full whitespace-nowrap">
//                             Your review: {userReview.rating}★
//                           </span>
//                         )}
//                       </div>

//                       {/* Room Features */}
//                       <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-4">
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">bed</span>
//                           {room.noOfBeds} bed
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">straighten</span>
//                           {room.roomSize} sqft
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <span className="material-icons text-sm">people</span>
//                           {room.maxOccupancy}
//                         </span>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (isAvailableNow) {
//                               openBookingModal(room);
//                             }
//                           }}
//                           disabled={!isAvailableNow}
//                           className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {isAvailableNow ? 'Book' : 'Unavail'}
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openReviewModal(room);
//                           }}
//                           className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
//                             userReview
//                               ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
//                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                           }`}
//                         >
//                           {userReview ? 'Update' : 'Review'}
//                         </button>
//                         {room.location && (room.location.lat || room.location.latitude) && (
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openInGoogleMaps(room.location);
//                             }}
//                             className="px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
//                             title="View on Google Maps"
//                           >
//                             <span className="material-icons text-sm">map</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* View More Button for Non-Logged In Users - Updated colors */}
//             {hasMoreRooms && (
//               <div className="mt-8 text-center">
//                 <button
//                   onClick={() => setShowLoginPopup(true)}
//                   className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all shadow-lg"
//                 >
//                   Login to View All {rooms.length} Rooms
//                 </button>
//               </div>
//             )}

//             {displayRooms.length === 0 && (
//               <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 px-4">
//                 <span className="material-icons text-5xl text-gray-300 mb-4">search_off</span>
//                 <p className="text-gray-500 text-lg">No rooms found</p>
//                 <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Login Popup Modal - Updated colors */}
//         {showLoginPopup && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all">
//               <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">Login Required</h2>
//                 <button
//                   onClick={() => {
//                     setShowLoginPopup(false);
//                     setPendingAction(null);
//                     setSelectedRoomForBooking(null);
//                     setSelectedRoomForReview(null);
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                 >
//                   <span className="material-icons text-gray-600">close</span>
//                 </button>
//               </div>

//               <div className="p-4 sm:p-6">
//                 <div className="text-center mb-6">
//                   <span className="material-icons text-5xl text-red-500 mb-3">lock</span>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {pendingAction === 'book' ? 'Want to book this room?' : pendingAction === 'review' ? 'Want to leave a review?' : 'Want to see all rooms?'}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     Please login or create an account to continue
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <button
//                     onClick={handleLoginFromPopup}
//                     className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">login</span>
//                     Login to Your Account
//                   </button>

//                   <button
//                     onClick={handleRegisterFromPopup}
//                     className="w-full px-4 py-3 border-2 border-yellow-500 text-yellow-600 rounded-lg text-sm font-bold hover:bg-yellow-50 transition-all flex items-center justify-center gap-2"
//                   >
//                     <span className="material-icons text-sm">person_add</span>
//                     Create New Account
//                   </button>

//                   <button
//                     onClick={() => {
//                       setShowLoginPopup(false);
//                       setPendingAction(null);
//                       setSelectedRoomForBooking(null);
//                       setSelectedRoomForReview(null);
//                     }}
//                     className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     Maybe Later
//                   </button>
//                 </div>

//                 <div className="mt-6 text-center text-xs text-gray-400">
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Room Details Modal with Clickable Carousel - Updated colors */}
//         {selectedRoom && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4" onClick={() => setSelectedRoom(null)}>
//             <div className="bg-white rounded-xl max-w-3xl w-[50vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//               <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">{selectedRoom.title}</h2>
//                 <button
//                   onClick={() => setSelectedRoom(null)}
//                   className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
//                 >
//                   <span className="material-icons text-gray-600">close</span>
//                 </button>
//               </div>

//               <div className="p-4 sm:p-6">
//                 {/* Clickable Popup Carousel */}
//                 {selectedRoom.images && selectedRoom.images.length > 0 && (
//                   <div className="mb-6">
//                     <div className="popup-carousel">
//                       <img
//                         src={selectedRoom.images[popupCarouselIndex]}
//                         alt={`${selectedRoom.title} - Image ${popupCarouselIndex + 1}`}
//                         className="popup-carousel-image"
//                       />

//                       {/* Carousel Controls */}
//                       {selectedRoom.images.length > 1 && (
//                         <>
//                           <button
//                             onClick={prevPopupImage}
//                             className="popup-carousel-btn prev"
//                           >
//                             <span className="material-icons">chevron_left</span>
//                           </button>
//                           <button
//                             onClick={nextPopupImage}
//                             className="popup-carousel-btn next"
//                           >
//                             <span className="material-icons">chevron_right</span>
//                           </button>
//                         </>
//                       )}

//                       {/* Image Indicators */}
//                       <div className="popup-carousel-indicators">
//                         {selectedRoom.images.map((_, idx) => (
//                           <div
//                             key={idx}
//                             className={`popup-carousel-dot ${idx === popupCarouselIndex ? 'active' : ''}`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setPopupCarouselIndex(idx);
//                             }}
//                           />
//                         ))}
//                       </div>

//                       {/* Image Counter */}
//                       <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
//                         {popupCarouselIndex + 1} / {selectedRoom.images.length}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedRoom.title}</h3>
//                     <p className="text-sm sm:text-base text-gray-600">{selectedRoom.description}</p>
//                   </div>

//                   {/* Reviews Section */}
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                       <span className="material-icons text-yellow-400">star</span>
//                       Guest Reviews ({userReviews[selectedRoom._id]?.length || 0})
//                     </h4>

//                     {userReviews[selectedRoom._id]?.length > 0 ? (
//                       <div className="space-y-3 max-h-48 overflow-y-auto">
//                         {userReviews[selectedRoom._id].map((review) => (
//                           <div key={review._id} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
//                             <div className="flex flex-wrap items-center justify-between gap-2">
//                               <span className="text-sm font-medium text-gray-900">
//                                 {review.userId?.name || 'Guest'}
//                                 {isLoggedIn() && review.userId?._id === user.id && (
//                                   <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
//                                     You
//                                   </span>
//                                 )}
//                               </span>
//                               <span className="text-xs text-gray-500">
//                                 {formatDate(review.createdAt)}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-1 mt-1">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <span key={star} className={`material-icons text-xs ${
//                                   star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
//                                 }`}>
//                                   star
//                                 </span>
//                               ))}
//                             </div>
//                             <p className="text-xs sm:text-sm text-gray-600 mt-1">{review.comment}</p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-500 text-center py-4">
//                         No reviews yet for this room.
//                       </p>
//                     )}
//                   </div>

//                   {/* Room Specifications */}
//                   <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-4 rounded-lg">
//                     <div>
//                       <p className="text-xs text-gray-500">Price per night</p>
//                       <p className="text-lg sm:text-xl font-bold text-red-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Status</p>
//                       <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
//                         selectedRoom.isAvailable
//                           ? 'bg-green-100 text-green-700' 
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {selectedRoom.isAvailable ? 'Available' : 'Booked'}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Beds</p>
//                       <p className="font-medium text-gray-900">{selectedRoom.noOfBeds}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Room Size</p>
//                       <p className="font-medium text-gray-900">{selectedRoom.roomSize} sqft</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Max Occupancy</p>
//                       <p className="font-medium text-gray-900">{selectedRoom.maxOccupancy} guests</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Checkout Time</p>
//                       <p className="font-medium text-gray-900">{selectedRoom.timeForCheckout}:00</p>
//                     </div>
//                   </div>

//                   {/* Location with Google Maps Button */}
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
//                       <p className="text-xs text-gray-500 font-semibold">Location</p>
//                       {selectedRoom.location && (selectedRoom.location.lat || selectedRoom.location.latitude || selectedRoom.location.city) && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openInGoogleMaps(selectedRoom.location);
//                           }}
//                           className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors w-full sm:w-auto"
//                         >
//                           <span className="material-icons text-sm">map</span>
//                           View on Google Maps
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-sm break-words">
//                       {selectedRoom.location?.city || ''} {selectedRoom.location?.state || ''} {selectedRoom.location?.country || ''}
//                     </p>
//                     {selectedRoom.distanceFromMe && (
//                       <p className="text-xs text-red-600 mt-1">
//                         📍 {selectedRoom.distanceFromMe} km from your location
//                       </p>
//                     )}
//                     <p className="text-xs text-gray-500 mt-1 break-words">
//                       Coordinates: {selectedRoom.location?.lat || selectedRoom.location?.latitude || 'N/A'}, {selectedRoom.location?.lng || selectedRoom.location?.longitude || 'N/A'}
//                     </p>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                     {isLoggedIn() ? (
//                       <>
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             openBookingModal(selectedRoom);
//                           }}
//                           disabled={!selectedRoom.isAvailable}
//                           className={`w-full sm:flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
//                             selectedRoom.isAvailable
//                               ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:shadow-lg'
//                               : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           }`}
//                         >
//                           {selectedRoom.isAvailable ? 'Book This Room' : 'Not Available'}
//                         </button>
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             openReviewModal(selectedRoom);
//                           }}
//                           className="w-full sm:flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors"
//                         >
//                           Write a Review
//                         </button>
//                       </>
//                     ) : (
//                       <div className="w-full">
//                         <button
//                           onClick={() => {
//                             setSelectedRoom(null);
//                             setShowLoginPopup(true);
//                             setPendingAction('book');
//                             setSelectedRoomForBooking(selectedRoom);
//                           }}
//                           className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-colors"
//                         >
//                           Login to Book
//                         </button>
//                         <p className="text-xs text-center text-gray-500 mt-2">
//                           New user?{' '}
//                           <button
//                             onClick={() => {
//                               setSelectedRoom(null);
//                               setShowLoginPopup(true);
//                               setPendingAction('register');
//                             }}
//                             className="text-red-600 hover:underline"
//                           >
//                             Register here
//                           </button>
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Image Zoom Modal */}
//         {showImageZoom && selectedImage && (
//           <div 
//             className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] p-4"
//             onClick={() => {
//               setShowImageZoom(false);
//               setSelectedImage(null);
//             }}
//           >
//             <div className="relative w-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
//               <button
//                 onClick={() => {
//                   setShowImageZoom(false);
//                   setSelectedImage(null);
//                 }}
//                 className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
//               >
//                 <span className="material-icons text-2xl sm:text-3xl">close</span>
//               </button>

//               <img
//                 src={selectedImage}
//                 alt="Zoomed view"
//                 className="w-full h-full object-contain max-h-[80vh] sm:max-h-[90vh] rounded-lg"
//               />
//             </div>
//           </div>
//         )}

//         {/* Booking Modal with Advance Payment - Updated colors */}
//         {showBookingModal && selectedRoomForBooking && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">Book Room</h2>
//                 <button
//                   onClick={() => setShowBookingModal(false)}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                 >
//                   <span className="material-icons text-gray-600">close</span>
//                 </button>
//               </div>

//               <form onSubmit={createBooking} className="p-4 sm:p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
//                   <input
//                     type="text"
//                     value={selectedRoomForBooking.title}
//                     disabled
//                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
//                   <input
//                     type="text"
//                     value={formatCurrency(selectedRoomForBooking.pricePerDay)}
//                     disabled
//                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
//                   />
//                 </div>

//                 {/* Show distance if available */}
//                 {selectedRoomForBooking.distanceFromMe && (
//                   <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                     <p className="text-xs text-yellow-700 flex items-center gap-1">
//                       <span className="material-icons text-sm">my_location</span>
//                       Distance from your location: <span className="font-bold">{selectedRoomForBooking.distanceFromMe} km</span>
//                     </p>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Check-in Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       required
//                       className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
//                       value={bookingForm.bookingStartDate}
//                       onChange={(e) => setBookingForm({ ...bookingForm, bookingStartDate: e.target.value })}
//                       min={new Date().toISOString().slice(0, 16)}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Check-out Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       required
//                       className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
//                       value={bookingForm.bookingEndDate}
//                       onChange={(e) => setBookingForm({ ...bookingForm, bookingEndDate: e.target.value })}
//                       min={bookingForm.bookingStartDate}
//                     />
//                   </div>
//                 </div>

//                 {/* Advance Payment Section */}
//                 <div className="border-t border-gray-200 pt-4">
//                   <h3 className="text-md font-semibold text-gray-700 mb-3">Advance Payment</h3>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Advance Amount ($)
//                       </label>
//                       <input
//                         type="number"
//                         min="0"
//                         max={selectedRoomForBooking.pricePerDay * 10}
//                         step="10"
//                         value={bookingForm.advance}
//                         onChange={(e) => setBookingForm({ ...bookingForm, advance: parseFloat(e.target.value) || 0 })}
//                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Leave 0 for no advance
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Payment Method
//                       </label>
//                       <select
//                         value={bookingForm.advanceMethod}
//                         onChange={(e) => setBookingForm({ ...bookingForm, advanceMethod: e.target.value })}
//                         className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
//                       >
//                         <option value="cash">Cash</option>
//                         <option value="card">Card</option>
//                         <option value="upi">UPI</option>
//                         <option value="bank">Bank Transfer</option>
//                       </select>
//                     </div>
//                   </div>

//                   {bookingForm.advance > 0 && (
//                     <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                       <p className="text-xs text-yellow-700">
//                         <span className="font-semibold">Note:</span> You will pay ${bookingForm.advance} as advance payment via {bookingForm.advanceMethod}.
//                         {bookingForm.advance < selectedRoomForBooking.pricePerDay && (
//                           <span className="block mt-1">Remaining ${selectedRoomForBooking.pricePerDay - bookingForm.advance} will be paid at check-in.</span>
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-colors disabled:opacity-50 shadow-md"
//                   >
//                     {loading ? 'Booking...' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Review Modal - Updated colors */}
//         {showReviewModal && selectedRoomForReview && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//                   {reviewForm.isEditing ? 'Update Your Review' : 'Write a Review'}
//                 </h2>
//                 <button
//                   onClick={() => setShowReviewModal(false)}
//                   className="p-2 hover:bg-gray-100 rounded-full"
//                 >
//                   <span className="material-icons text-gray-600">close</span>
//                 </button>
//               </div>

//               <form onSubmit={submitReview} className="p-4 sm:p-6 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
//                   <input
//                     type="text"
//                     value={selectedRoomForReview.title}
//                     disabled
//                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Rating <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex flex-wrap items-center gap-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setReviewForm({ ...reviewForm, rating: star })}
//                         className="focus:outline-none"
//                       >
//                         <span className={`material-icons text-2xl sm:text-3xl ${
//                           star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
//                         }`}>
//                           star
//                         </span>
//                       </button>
//                     ))}
//                     <span className="text-sm text-gray-500 ml-2">{reviewForm.rating}/5</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Comment (Optional)
//                   </label>
//                   <textarea
//                     rows="4"
//                     placeholder="Share your experience..."
//                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
//                     value={reviewForm.comment}
//                     onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
//                   />
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors disabled:opacity-50 shadow-md"
//                   >
//                     {loading ? 'Submitting...' : reviewForm.isEditing ? 'Update Review' : 'Submit Review'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;










































//Perfect
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  const [selectedRoomFromMap, setSelectedRoomFromMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [selectedRoomForReview, setSelectedRoomForReview] = useState(null);
  const [userReviews, setUserReviews] = useState({});
  const [pendingAction, setPendingAction] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapRetryCount, setMapRetryCount] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // My location state
  const [myLocation, setMyLocation] = useState(null);
  const [myLocationMarker, setMyLocationMarker] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState('prompt');

  // Radius filter state
  const [radiusFilter, setRadiusFilter] = useState({
    enabled: false,
    distance: 50,
    unit: 'km'
  });

  // Image carousel state
  const [carouselIndexes, setCarouselIndexes] = useState({});
  const [popupCarouselIndex, setPopupCarouselIndex] = useState(0);
  const [autoPlayIntervals, setAutoPlayIntervals] = useState({});
  const [isHovering, setIsHovering] = useState({});

  // Map refs
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const mapInstanceRef = useRef(null);
  const popupCarouselTimerRef = useRef(null);
  const leafletLoadedRef = useRef(false);
  const mapInitTimeoutRef = useRef(null);

  // Image zoom states
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Room search filters
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    minSize: ''
  });

  // Booking form state with advance payment
  const [bookingForm, setBookingForm] = useState({
    bookingStartDate: '',
    bookingEndDate: '',
    advance: 0,
    advanceMethod: 'cash'
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    isEditing: false,
    reviewId: null
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const GEOAPIFY_API_KEY = 'e9331e493ca845b0a445921eca3f278b';

  // India center coordinates
  const INDIA_CENTER = [20.5937, 78.9629];
  const INDIA_ZOOM = 5;

  // Load Leaflet script once
  useEffect(() => {
    if (!leafletLoadedRef.current) {
      loadLeafletScript();
      leafletLoadedRef.current = true;
    }
    
    return () => {
      if (mapInitTimeoutRef.current) {
        clearTimeout(mapInitTimeoutRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Clear all auto-play intervals
      Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
    };
  }, []);

  // Load user data
  useEffect(() => {
    const userData = Cookies.get('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    fetchAllRooms();

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
    }
  }, []);

  // Update map when filtered rooms change
  useEffect(() => {
    if (mapInstanceRef.current && window.L && filteredRooms.length > 0) {
      const timer = setTimeout(() => {
        updateMapMarkers();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [filteredRooms]);

  // Initialize map when rooms are loaded
  useEffect(() => {
    if (rooms.length > 0 && mapInstanceRef.current && window.L && !mapInitialized) {
      setMapInitialized(true);
      const timer = setTimeout(() => {
        updateMapMarkers();
        // Center on India first
        mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [rooms, mapInitialized]);

  // Retry map initialization
  useEffect(() => {
    if (mapRetryCount < 3 && rooms.length > 0 && !mapInstanceRef.current && !mapError) {
      const timer = setTimeout(() => {
        loadLeafletScript();
        setMapRetryCount(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mapRetryCount, rooms, mapError]);

  // Control map interactions when modals are open
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const isAnyModalOpen = showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom;

    try {
      if (isAnyModalOpen) {
        mapInstanceRef.current.dragging.disable();
        mapInstanceRef.current.touchZoom.disable();
        mapInstanceRef.current.doubleClickZoom.disable();
        mapInstanceRef.current.scrollWheelZoom.disable();
        mapInstanceRef.current.boxZoom.disable();
        mapInstanceRef.current.keyboard.disable();

        if (mapInstanceRef.current.getContainer()) {
          mapInstanceRef.current.getContainer().style.cursor = 'default';
        }
      } else {
        mapInstanceRef.current.dragging.enable();
        mapInstanceRef.current.touchZoom.enable();
        mapInstanceRef.current.doubleClickZoom.enable();
        mapInstanceRef.current.scrollWheelZoom.enable();
        mapInstanceRef.current.boxZoom.enable();
        mapInstanceRef.current.keyboard.enable();

        if (mapInstanceRef.current.getContainer()) {
          mapInstanceRef.current.getContainer().style.cursor = '';
        }
      }
    } catch (e) {
      console.log('Error toggling map interactions:', e);
    }
  }, [showBookingModal, showReviewModal, showLoginPopup, selectedRoom, showImageZoom]);

  // Apply radius filter
  useEffect(() => {
    if (radiusFilter.enabled && myLocation) {
      applyRadiusFilter();
    } else if (!radiusFilter.enabled) {
      setFilteredRooms(rooms);
      if (mapInstanceRef.current && window.L) {
        setTimeout(() => {
          updateMapMarkers();
          // Zoom out to show all rooms
          if (rooms.length > 0) {
            const allRoomsWithLocation = rooms.filter(room => 
              room.location && (room.location.lat || room.location.latitude)
            );
            if (allRoomsWithLocation.length > 0) {
              const bounds = allRoomsWithLocation.map(room => [
                parseFloat(room.location.lat || room.location.latitude),
                parseFloat(room.location.lng || room.location.longitude)
              ]);
              if (myLocation) {
                bounds.push([myLocation.lat, myLocation.lng]);
              }
              mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
          }
        }, 100);
      }
    }
  }, [radiusFilter.enabled, radiusFilter.distance, myLocation, rooms]);

  // Start auto-play for all rooms when they load
  useEffect(() => {
    if (rooms.length > 0) {
      startAllAutoPlay();
    }
    return () => {
      // Cleanup intervals on unmount
      Object.values(autoPlayIntervals).forEach(interval => clearInterval(interval));
    };
  }, [rooms]);

  // Auto-play for popup carousel when selectedRoom changes
  useEffect(() => {
    if (selectedRoom && selectedRoom.images && selectedRoom.images.length > 1) {
      // Clear previous timer
      if (popupCarouselTimerRef.current) {
        clearInterval(popupCarouselTimerRef.current);
      }

      // Start new timer
      popupCarouselTimerRef.current = setInterval(() => {
        setPopupCarouselIndex(prev => 
          prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
        );
      }, 3000);
    }

    return () => {
      if (popupCarouselTimerRef.current) {
        clearInterval(popupCarouselTimerRef.current);
      }
    };
  }, [selectedRoom]);

  const loadLeafletScript = () => {
    if (window.L) {
      initializeMap();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      console.log('Leaflet loaded successfully');
      // Small delay to ensure CSS is applied
      setTimeout(() => {
        initializeMap();
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Leaflet');
      setMapError(true);
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.L) {
      console.log('Map container or Leaflet not ready');
      return;
    }

    try {
      console.log('Initializing map...');
      
      // Center on India by default
      mapInstanceRef.current = window.L.map(mapRef.current).setView(INDIA_CENTER, INDIA_ZOOM);
      
      setMapReady(true);
      setMapError(false);

      const isRetina = window.L.Browser.retina;
      
      const tileUrl = isRetina
        ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${GEOAPIFY_API_KEY}`
        : `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_API_KEY}`;

      window.L.tileLayer(tileUrl, {
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      // Add custom location button to map
      addLocationButtonToMap();

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  };

  // Add custom location button to map
  const addLocationButtonToMap = () => {
    if (!mapInstanceRef.current) return;
    
    const locationControl = window.L.control({ position: 'topright' });
    
    locationControl.onAdd = () => {
      const button = window.L.DomUtil.create('button', 'leaflet-control-custom');
      button.innerHTML = `
        <span class="material-icons" style="font-size: 20px;">my_location</span>
        <span style="margin-left: 4px;">My Location</span>
      `;
      button.style.backgroundColor = 'white';
      button.style.border = '2px solid #EAB308';
      button.style.borderRadius = '4px';
      button.style.padding = '6px 12px';
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.gap = '4px';
      button.style.fontSize = '14px';
      button.style.fontWeight = '500';
      button.style.color = '#1F2937';
      button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      
      button.onclick = () => {
        getMyLocation();
      };
      
      return button;
    };
    
    locationControl.addTo(mapInstanceRef.current);
  };

  // Auto-play function
  const startAutoPlay = (roomId, imagesLength) => {
    if (imagesLength <= 1) return;
    
    if (autoPlayIntervals[roomId]) {
      clearInterval(autoPlayIntervals[roomId]);
    }
    
    const interval = setInterval(() => {
      setCarouselIndexes(prev => {
        if (isHovering[roomId]) return prev;
        const currentIndex = prev[roomId] || 0;
        const nextIndex = currentIndex === (imagesLength - 1) ? 0 : currentIndex + 1;
        return { ...prev, [roomId]: nextIndex };
      });
    }, 3000);
    
    setAutoPlayIntervals(prev => ({ ...prev, [roomId]: interval }));
  };

  const startAllAutoPlay = () => {
    rooms.forEach(room => {
      if (room.images && room.images.length > 1) {
        startAutoPlay(room._id, room.images.length);
      }
    });
  };

  const handleMouseEnter = (roomId) => {
    setIsHovering(prev => ({ ...prev, [roomId]: true }));
  };

  const handleMouseLeave = (roomId) => {
    setIsHovering(prev => ({ ...prev, [roomId]: false }));
  };

  // Get user's location and jump to it
  const getMyLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got location:', latitude, longitude);
        
        setMyLocation({ lat: latitude, lng: longitude });
        setLocationPermission('granted');
        setIsGettingLocation(false);
        
        if (mapInstanceRef.current && window.L) {
          // Remove existing my location marker
          if (myLocationMarker) {
            mapInstanceRef.current.removeLayer(myLocationMarker);
          }
          
          // Create pulsing red dot for my location
          const marker = window.L.marker([latitude, longitude], {
            icon: window.L.divIcon({
              className: 'my-location-marker',
              html: `<div style="
                background-color: #EF4444;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 0 0 2px rgba(239,68,68,0.5), 0 2px 10px rgba(0,0,0,0.3);
                animation: pulse 1.5s infinite;
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(mapInstanceRef.current);
          
          marker.bindPopup('📍 You are here');
          setMyLocationMarker(marker);
          
          // JUMP TO MY LOCATION - center map with zoom level 12
          mapInstanceRef.current.setView([latitude, longitude], 12);
          
          // Apply radius filter if enabled
          if (radiusFilter.enabled) {
            applyRadiusFilter();
          } else {
            updateMapMarkers();
          }
        }
      },
      (error) => {
        setIsGettingLocation(false);
        
        let errorMessage = '';
        let permissionState = 'denied';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '📍 Location permission denied. Please click "Allow" when your browser asks for location access.';
            permissionState = 'denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '📍 Location information is unavailable. Please check your device settings.';
            permissionState = 'denied';
            break;
          case error.TIMEOUT:
            errorMessage = '📍 Location request timed out. Please try again.';
            permissionState = 'prompt';
            break;
          default:
            errorMessage = '📍 An unknown error occurred. Please try again.';
            permissionState = 'prompt';
        }
        
        setLocationError(errorMessage);
        setLocationPermission(permissionState);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Apply radius filter and zoom to show only rooms within range
  const applyRadiusFilter = () => {
    if (!myLocation || !radiusFilter.enabled) return;
    
    console.log('Applying radius filter:', radiusFilter.distance, 'km');
    
    // Filter rooms within radius and add distance property
    const filtered = rooms
      .filter(room => {
        if (!room.location) return false;
        
        const roomLat = parseFloat(room.location.lat || room.location.latitude);
        const roomLng = parseFloat(room.location.lng || room.location.longitude);
        
        if (isNaN(roomLat) || isNaN(roomLng)) return false;
        
        const distance = calculateDistance(
          myLocation.lat, myLocation.lng,
          roomLat, roomLng
        );
        
        room.distanceFromMe = Math.round(distance * 10) / 10;
        
        return distance <= radiusFilter.distance;
      })
      .map(room => ({ ...room }));
    
    console.log(`Found ${filtered.length} rooms within ${radiusFilter.distance}km`);
    
    setFilteredRooms(filtered);
    
    if (mapInstanceRef.current && window.L) {
      setTimeout(() => {
        updateMapMarkers();
        zoomToFilteredRooms(filtered);
      }, 100);
    }
  };

  // Zoom map to show only the filtered rooms
  const zoomToFilteredRooms = (filteredRoomsList) => {
    if (!mapInstanceRef.current || !window.L) return;
    
    const roomsWithLocation = filteredRoomsList.filter(room => {
      if (!room.location) return false;
      const lat = parseFloat(room.location?.lat || room.location?.latitude);
      const lng = parseFloat(room.location?.lng || room.location?.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    if (roomsWithLocation.length === 0) {
      if (myLocation) {
        mapInstanceRef.current.setView([myLocation.lat, myLocation.lng], 10);
      }
      return;
    }

    const bounds = roomsWithLocation.map(room => {
      const lat = parseFloat(room.location.lat || room.location.latitude);
      const lng = parseFloat(room.location.lng || room.location.longitude);
      return [lat, lng];
    });

    if (myLocation) {
      bounds.push([myLocation.lat, myLocation.lng]);
    }

    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 15
      });
    }
  };

  // Update map markers
  const updateMapMarkers = () => {
    if (!mapInstanceRef.current || !window.L) {
      console.log('Map not ready for markers');
      return;
    }

    console.log('Updating map markers...');
    console.log('Total rooms:', filteredRooms.length);

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const roomsWithLocation = filteredRooms.filter(room => {
      if (!room.location) return false;
      const lat = parseFloat(room.location?.lat || room.location?.latitude);
      const lng = parseFloat(room.location?.lng || room.location?.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    console.log(`Found ${roomsWithLocation.length} rooms with valid coordinates`);

    if (roomsWithLocation.length === 0) {
      mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
      return;
    }

    roomsWithLocation.forEach(room => {
      const lat = parseFloat(room.location.lat || room.location.latitude);
      const lng = parseFloat(room.location.lng || room.location.longitude);
      const isAvailableNow = room.isAvailable;
      const markerColor = isAvailableNow ? '#22c55e' : '#EF4444';
      
      const ringStyle = (radiusFilter.enabled && room.distanceFromMe) 
        ? `outline: 2px solid #EAB308; outline-offset: 2px;` 
        : '';
      
      const marker = window.L.marker([lat, lng], {
        icon: window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${markerColor}; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
            ${ringStyle}
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(mapInstanceRef.current);

      const distanceText = room.distanceFromMe 
        ? `<p style="margin: 0 0 8px; font-size: 12px; color: #EAB308;">📍 ${room.distanceFromMe} km from you</p>`
        : '';

      const popupContent = `
        <div style="
          padding: 16px; 
          min-width: 240px; 
          background: white; 
          position: relative;
          z-index: 9999;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-radius: 12px;
          border: 1px solid #EAB308;
        ">
          <h3 style="
            margin: 0 0 8px; 
            font-size: 18px; 
            font-weight: bold; 
            color: #1F2937;
          ">${room.title}</h3>

          <p style="
            margin: 0 0 8px; 
            font-size: 16px; 
            color: #EF4444; 
            font-weight: bold;
          ">$${room.pricePerDay}/night</p>

          <p style="
            margin: 0 0 8px; 
            font-size: 14px; 
            color: #6B7280;
            display: flex;
            gap: 12px;
          ">
            <span>🛏️ ${room.noOfBeds} beds</span>
            <span>📏 ${room.roomSize} sqft</span>
          </p>

          ${distanceText}

          <p style="
            margin: 0 0 12px; 
            font-size: 14px; 
            color: ${isAvailableNow ? '#22c55e' : '#EF4444'}; 
            font-weight: 500;
          ">
            ${isAvailableNow ? '✓ Available Now' : '✗ Currently Booked'}
          </p>

          <button 
            onclick="window.selectRoom('${room._id}')"
            style="
              width: 100%; 
              padding: 10px; 
              background: #EAB308; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              font-size: 14px; 
              font-weight: 500; 
              cursor: pointer;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#EF4444'"
            onmouseout="this.style.background='#EAB308'"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 300,
        minWidth: 240
      });

      marker.on('click', () => {
        setSelectedRoomFromMap(room);
        setTimeout(() => marker.openPopup(), 100);

        setTimeout(() => {
          const roomCard = document.getElementById(`room-card-${room._id}`);
          if (roomCard) {
            roomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            roomCard.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-50');
            setTimeout(() => {
              roomCard.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-50');
            }, 2000);
          }
        }, 300);
      });

      markersRef.current.push(marker);
    });

    if (radiusFilter.enabled) {
      zoomToFilteredRooms(filteredRooms);
    } else {
      if (roomsWithLocation.length === 0) {
        mapInstanceRef.current.setView(INDIA_CENTER, INDIA_ZOOM);
      } else {
        const bounds = roomsWithLocation.map(room => {
          const lat = parseFloat(room.location.lat || room.location.latitude);
          const lng = parseFloat(room.location.lng || room.location.longitude);
          return [lat, lng];
        });

        if (myLocation) {
          bounds.push([myLocation.lat, myLocation.lng]);
        }

        if (bounds.length > 0) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }
  };

  // Carousel navigation
  const nextImage = (roomId, imagesLength, e) => {
    e.stopPropagation();
    setCarouselIndexes(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % imagesLength
    }));
  };

  const prevImage = (roomId, imagesLength, e) => {
    e.stopPropagation();
    setCarouselIndexes(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength
    }));
  };

  // Popup carousel navigation
  const nextPopupImage = (e) => {
    e.stopPropagation();
    if (selectedRoom && selectedRoom.images) {
      setPopupCarouselIndex(prev => 
        prev === (selectedRoom.images.length - 1) ? 0 : prev + 1
      );
    }
  };

  const prevPopupImage = (e) => {
    e.stopPropagation();
    if (selectedRoom && selectedRoom.images) {
      setPopupCarouselIndex(prev => 
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  // Expose selectRoom to global scope
  useEffect(() => {
    window.selectRoom = (roomId) => {
      const room = rooms.find(r => r._id === roomId);
      if (room) {
        setSelectedRoom(room);
        setPopupCarouselIndex(0);
      }
    };
    return () => {
      delete window.selectRoom;
    };
  }, [rooms]);

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = Cookies.get('token');
    return !!token && Object.keys(user).length > 0;
  };

  // Show login popup
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

  // Get auth headers
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // GET ALL ROOMS
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
        console.log('Rooms fetched:', data);
        
        const cleanedData = data.map(room => {
          const { distanceFromMe, ...cleanRoom } = room;
          return cleanRoom;
        });
        
        setRooms(cleanedData);
        setFilteredRooms(cleanedData);

        cleanedData.forEach(room => {
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

  // CREATE BOOKING with advance payment
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
          bookingEndDate: new Date(bookingForm.bookingEndDate).toISOString(),
          advance: parseFloat(bookingForm.advance) || 0,
          advancemethod: bookingForm.advanceMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: '✅ Room booked successfully!'
        });
        setShowBookingModal(false);
        setBookingForm({ 
          bookingStartDate: '', 
          bookingEndDate: '',
          advance: 0,
          advanceMethod: 'cash'
        });
        fetchAllRooms();
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

  // CREATE/UPDATE REVIEW
  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedRoomForReview) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      if (reviewForm.isEditing) {
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
          text: reviewForm.isEditing ? '✅ Review updated!' : '✅ Review added!'
        });
        setShowReviewModal(false);
        setReviewForm({ rating: 5, comment: '', isEditing: false, reviewId: null });
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

  // Get user's review
  const getUserReview = (roomId) => {
    const reviews = userReviews[roomId] || [];
    return reviews.find(review => review.userId?._id === user.id || review.userId === user.id);
  };

  // Handle search and filters - FIXED
  useEffect(() => {
    let filtered = [...rooms];

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(room =>
        room.title?.toLowerCase().includes(query) ||
        room.description?.toLowerCase().includes(query) ||
        room.location?.city?.toLowerCase().includes(query) ||
        room.location?.country?.toLowerCase().includes(query)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(room => room.pricePerDay >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(room => room.pricePerDay <= Number(filters.maxPrice));
    }
    if (filters.beds) {
      filtered = filtered.filter(room => room.noOfBeds >= Number(filters.beds));
    }
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

  // Open in Google Maps
  const openInGoogleMaps = (location) => {
    if (!location) return;
    
    let url = '#';
    if (location.lat || location.latitude) {
      const lat = location.lat || location.latitude;
      const lng = location.lng || location.longitude;
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (location.city || location.country) {
      const address = [location.city, location.state, location.country].filter(Boolean).join(', ');
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  const clearSelectedRoomFromMap = () => {
    setSelectedRoomFromMap(null);
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const roomsWithLocationCount = filteredRooms.filter(room => 
    room.location && (room.location.lat || room.location.latitude)
  ).length;

  // Get display rooms - show 4-5 cards for non-logged in users
  const getDisplayRooms = () => {
    if (isLoggedIn()) {
      return filteredRooms;
    }
    const displayCount = Math.min(filteredRooms.length, 5);
    return filteredRooms.slice(0, displayCount);
  };

  const displayRooms = getDisplayRooms();
  const hasMoreRooms = !isLoggedIn() && rooms.length > 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50 to-red-50">
      <style>{`
        .custom-marker {
          cursor: pointer;
        }
        .custom-marker:hover div {
          transform: scale(1.2);
          transition: transform 0.2s;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        .my-location-marker {
          cursor: pointer;
          z-index: 1000 !important;
        }

        .leaflet-popup-content-wrapper {
          background: white !important;
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
          border: 1px solid #EAB308 !important;
        }

        .leaflet-popup-content {
          margin: 0 !important;
          min-width: 240px !important;
          max-width: 300px !important;
          background: white !important;
        }

        .leaflet-popup-tip {
          background: white !important;
          border: 1px solid #EAB308 !important;
        }

        .leaflet-popup {
          z-index: 9999 !important;
        }

        .leaflet-popup-close-button {
          display: none !important;
        }

        .leaflet-tile {
          filter: brightness(0.95) contrast(0.9);
        }

        .leaflet-container {
          z-index: 1 !important;
        }

        .fixed.inset-0 {
          z-index: 10000 !important;
        }

        .z-50, .z-\\[60\\], .z-\\[100\\] {
          z-index: 10000 !important;
        }

        .carousel-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.2s;
        }

        .carousel-btn:hover {
          background: #EAB308;
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-btn.prev {
          left: 5px;
        }

        .carousel-btn.next {
          right: 5px;
        }

        .carousel-indicators {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 20;
        }

        .carousel-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: all 0.2s;
          cursor: pointer;
        }

        .carousel-dot:hover {
          background: #EAB308;
        }

        .carousel-dot.active {
          background: #EF4444;
          width: 12px;
          border-radius: 3px;
        }

        .popup-carousel {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .popup-carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .popup-carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 30;
          transition: all 0.2s;
        }

        .popup-carousel-btn:hover {
          background: #EAB308;
          transform: translateY(-50%) scale(1.1);
        }

        .popup-carousel-btn.prev {
          left: 10px;
        }

        .popup-carousel-btn.next {
          right: 10px;
        }

        .popup-carousel-indicators {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 30;
        }

        .popup-carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: all 0.2s;
          cursor: pointer;
        }

        .popup-carousel-dot:hover {
          background: #EAB308;
        }

        .popup-carousel-dot.active {
          background: #EF4444;
          width: 16px;
          border-radius: 4px;
        }

        .leaflet-control-custom {
          background: white;
          border: 2px solid #EAB308;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s;
          margin-right: 10px;
          margin-top: 10px;
          color: #1F2937;
        }
        .leaflet-control-custom:hover {
          background-color: #FEF3C7;
          border-color: #EF4444;
          transform: scale(1.02);
        }

       

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EAB308;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EF4444;
        }

        /* Responsive modal */
        @media (max-width: 640px) {
          .fixed.inset-0 .max-w-3xl {
            width: 90% !important;
            max-width: 90% !important;
          }
        }
      `}</style>

      {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div> */}

      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">🏨 RoomFinder</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-yellow-50 transition-colors"
          >
            <span className="material-icons text-gray-700">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg p-4 z-50">
            <div className="space-y-3">
              {!isLoggedIn() ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">login</span>
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 border-2 border-yellow-500 text-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">person_add</span>
                    Register
                  </button>
                </>
              ) : (
                <div className="px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-gray-900">Welcome, {user.name}!</p>
                  <p className="text-xs text-red-600 mt-1 capitalize flex items-center gap-1">
                    <span className="material-icons text-xs">verified</span>
                    {user.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
              Find Your Perfect Stay
            </h1>
            <p className="text-gray-600 mt-1">Discover and book amazing rooms</p>
          </div>
        </div>

        {locationError && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-icons text-yellow-600">location_off</span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{locationError}</p>
                {locationPermission === 'denied' && (
                  <p className="text-xs text-yellow-600 mt-1">
                    To enable location access:
                    <br />• Chrome: Click the lock icon in address bar → Site settings → Location → Allow
                    <br />• Firefox: Click the shield icon → Blocked → Allow temporarily
                    <br />• Safari: Safari menu → Settings → Websites → Location → Allow
                  </p>
                )}
                <button
                  onClick={getMyLocation}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoggedIn() && (
          <div className="mt-4 lg:mt-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 text-white">
                <div className="bg-white/20 rounded-full p-2">
                  <span className="material-icons text-white">info</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Login to Book Rooms & Leave Reviews</h3>
                  <p className="text-xs text-yellow-100 mt-0.5">
                    You're browsing as a guest. Sign in to book rooms and share your experiences!
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white text-red-600 rounded-lg text-xs sm:text-sm font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">login</span>
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-transparent border-2 border-white text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">person_add</span>
                  Register
                </button>
              </div>
            </div>
          </div>
        )}

        {message.text && (
          <div className={`mt-4 mb-6 p-4 rounded-lg text-sm flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <span className={`material-icons flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="flex-1 break-words">{message.text}</span>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={toggleFilterPanel}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                showFilterPanel 
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="material-icons text-sm">filter_list</span>
              Filters
              {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  !
                </span>
              )}
            </button>
          </div>

          {showFilterPanel && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Price ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Price ($)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Beds</label>
                  <input
                    type="number"
                    placeholder="1"
                    min="1"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
                    value={filters.beds}
                    onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Size (sqft)</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
                    value={filters.minSize}
                    onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="radiusFilter"
                    checked={radiusFilter.enabled}
                    onChange={(e) => setRadiusFilter({ ...radiusFilter, enabled: e.target.checked })}
                    className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                  />
                  <label htmlFor="radiusFilter" className="text-sm font-medium text-gray-700">
                    Search near my location
                  </label>
                </div>
                
                {radiusFilter.enabled && (
                  <div className="ml-7">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Distance: {radiusFilter.distance} {radiusFilter.unit}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={radiusFilter.distance}
                      onChange={(e) => setRadiusFilter({ ...radiusFilter, distance: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 km</span>
                      <span>50 km</span>
                      <span>100 km</span>
                      <span>150 km</span>
                      <span>200 km</span>
                    </div>
                    
                    {!myLocation && (
                      <p className="text-xs text-yellow-600 mt-2">
                        Please click location button on map first
                      </p>
                    )}
                    
                    {myLocation && (
                      <p className="text-xs text-red-600 mt-2">
                        🎯 Showing rooms within {radiusFilter.distance}km of your location
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {(filters.minPrice || filters.maxPrice || filters.beds || filters.minSize || radiusFilter.enabled) && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setFilters({ minPrice: '', maxPrice: '', beds: '', minSize: '' });
                      setRadiusFilter({ enabled: false, distance: 50, unit: 'km' });
                      setFilteredRooms(rooms);
                      if (mapInstanceRef.current && window.L) {
                        setTimeout(updateMapMarkers, 100);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 text-xs text-gray-500">
            Found <span className="font-semibold text-red-600">{filteredRooms.length}</span> rooms
            {!isLoggedIn() && filteredRooms.length > 5 && (
              <span className="ml-1 text-yellow-600">(Showing 5 of {filteredRooms.length} - Login to see all)</span>
            )}
            {radiusFilter.enabled && myLocation && (
              <span className="ml-1">within {radiusFilter.distance}km of your location</span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-red-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons text-red-500">map</span>
                <h3 className="text-sm font-semibold text-gray-700">Room Locations</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white text-red-600 px-2 py-1 rounded-full shadow-sm border border-yellow-200">
                  {roomsWithLocationCount} room{roomsWithLocationCount !== 1 ? 's' : ''} on map
                </span>
              </div>
            </div>
            {mapError ? (
              <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <span className="material-icons text-4xl text-gray-400 mb-2">map</span>
                  <p className="text-gray-500">Failed to load map</p>
                  <button 
                    onClick={() => {
                      setMapError(false);
                      setMapRetryCount(0);
                      loadLeafletScript();
                    }}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <div 
                ref={mapRef}
                className={`w-full h-[300px] sm:h-[400px] transition-all duration-300 ${
                  (showBookingModal || showReviewModal || showLoginPopup || selectedRoom || showImageZoom) 
                    ? 'pointer-events-none opacity-90' 
                    : 'pointer-events-auto opacity-100'
                }`}
                style={{ 
                  minHeight: '300px',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            )}
          </div>
        </div>

        {selectedRoomFromMap && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons text-red-500">location_on</span>
                <p className="text-sm text-gray-800">
                  Room selected from map: <span className="font-semibold">{selectedRoomFromMap.title}</span>
                  {selectedRoomFromMap.distanceFromMe && (
                    <span className="ml-2 text-xs bg-yellow-200 px-2 py-0.5 rounded-full">
                      {selectedRoomFromMap.distanceFromMe} km from you
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={clearSelectedRoomFromMap}
                className="text-red-600 hover:text-red-800"
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
            
            <div 
              id={`room-card-${selectedRoomFromMap._id}`}
              className="bg-white rounded-xl border-2 border-yellow-400 shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedRoom(selectedRoomFromMap)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 bg-gray-100">
                  {selectedRoomFromMap.images && selectedRoomFromMap.images.length > 0 ? (
                    <img
                      src={selectedRoomFromMap.images[0]}
                      alt={selectedRoomFromMap.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="material-icons text-3xl text-gray-400">image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedRoomFromMap.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{selectedRoomFromMap.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedRoomFromMap.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedRoomFromMap.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-lg font-bold text-red-600">{formatCurrency(selectedRoomFromMap.pricePerDay)}</span>
                    <span className="text-xs text-gray-500">/night</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">bed</span>
                      {selectedRoomFromMap.noOfBeds} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">straighten</span>
                      {selectedRoomFromMap.roomSize} sqft
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-sm">people</span>
                      {selectedRoomFromMap.maxOccupancy}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(selectedRoomFromMap);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      View full details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-yellow-200 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${isLoggedIn() ? '3' : '4'} gap-4 sm:gap-6`}>
              {displayRooms.map((room) => {
                const reviews = userReviews[room._id] || [];
                const avgRating = calculateAverageRating(reviews);
                const userReview = getUserReview(room._id);
                const isSelectedFromMap = selectedRoomFromMap?._id === room._id;
                const currentImageIndex = carouselIndexes[room._id] || 0;
                const hasMultipleImages = room.images && room.images.length > 1;
                const isAvailableNow = room.isAvailable;

                return (
                  <div
                    key={room._id}
                    id={`room-card-${room._id}`}
                    className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                      isSelectedFromMap 
                        ? 'border-yellow-400 ring-4 ring-yellow-200' 
                        : 'border-gray-200'
                    } ${isAvailableNow ? '' : 'opacity-75'}`}
                    onClick={() => {
                      setSelectedRoom(room);
                      setPopupCarouselIndex(0);
                    }}
                    onMouseEnter={() => handleMouseEnter(room._id)}
                    onMouseLeave={() => handleMouseLeave(room._id)}
                  >
                    <div className="h-40 sm:h-48 bg-gray-100 relative group">
                      {room.images && room.images.length > 0 ? (
                        <div className="carousel-container">
                          <img
                            src={room.images[currentImageIndex]}
                            alt={`${room.title} - Image ${currentImageIndex + 1}`}
                            className="carousel-image"
                            loading="lazy"
                          />
                          
                          {hasMultipleImages && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevImage(room._id, room.images.length, e);
                                }}
                                className="carousel-btn prev opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <span className="material-icons text-sm">chevron_left</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextImage(room._id, room.images.length, e);
                                }}
                                className="carousel-btn next opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <span className="material-icons text-sm">chevron_right</span>
                              </button>
                            </>
                          )}
                          
                          <div className="carousel-indicators">
                            {room.images.map((_, idx) => (
                              <div
                                key={idx}
                                className={`carousel-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCarouselIndexes(prev => ({ ...prev, [room._id]: idx }));
                                }}
                              />
                            ))}
                          </div>
                          
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            {currentImageIndex + 1} / {room.images.length}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="material-icons text-4xl text-gray-400">image</span>
                        </div>
                      )}

                      <div className="absolute top-2 right-2 z-20">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          isAvailableNow
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isAvailableNow ? 'Available' : 'Booked'}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold z-20 shadow-lg">
                        {formatCurrency(room.pricePerDay)} <span className="text-xs font-normal">/night</span>
                      </div>

                      {room.distanceFromMe && (
                        <div className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-20 shadow-lg">
                          📍 {room.distanceFromMe} km
                        </div>
                      )}
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">{room.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{room.description}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`material-icons text-xs sm:text-sm ${
                                star <= avgRating ? 'text-yellow-400' : 'text-gray-300'
                              }`}>
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({reviews.length})
                          </span>
                        </div>

                        {isLoggedIn() && userReview && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Your review: {userReview.rating}★
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-4">
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

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAvailableNow) {
                              openBookingModal(room);
                            }
                          }}
                          disabled={!isAvailableNow}
                          className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAvailableNow ? 'Book' : 'Unavail'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openReviewModal(room);
                          }}
                          className={`flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            userReview
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {userReview ? 'Update' : 'Review'}
                        </button>
                        {room.location && (room.location.lat || room.location.latitude) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openInGoogleMaps(room.location);
                            }}
                            className="px-2 sm:px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                            title="View on Google Maps"
                          >
                            <span className="material-icons text-sm">map</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMoreRooms && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowLoginPopup(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all shadow-lg"
                >
                  Login to View All {rooms.length} Rooms
                </button>
              </div>
            )}

            {displayRooms.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200 px-4">
                <span className="material-icons text-5xl text-gray-300 mb-4">search_off</span>
                <p className="text-gray-500 text-lg">No rooms found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
              </div>
            )}
          </>
        )}

        {showLoginPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Login Required</h2>
                <button
                  onClick={() => {
                    setShowLoginPopup(false);
                    setPendingAction(null);
                    setSelectedRoomForBooking(null);
                    setSelectedRoomForReview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="material-icons text-gray-600">close</span>
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="text-center mb-6">
                  <span className="material-icons text-5xl text-red-500 mb-3">lock</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {pendingAction === 'book' ? 'Want to book this room?' : pendingAction === 'review' ? 'Want to leave a review?' : 'Want to see all rooms?'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please login or create an account to continue
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleLoginFromPopup}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-sm">login</span>
                    Login to Your Account
                  </button>

                  <button
                    onClick={handleRegisterFromPopup}
                    className="w-full px-4 py-3 border-2 border-yellow-500 text-yellow-600 rounded-lg text-sm font-bold hover:bg-yellow-50 transition-all flex items-center justify-center gap-2"
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
                    className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Responsive Room Details Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-2 sm:p-4" onClick={() => setSelectedRoom(null)}>
            <div className="bg-white rounded-xl max-w-3xl w-[50vw] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">{selectedRoom.title}</h2>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                >
                  <span className="material-icons text-gray-600">close</span>
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {selectedRoom.images && selectedRoom.images.length > 0 && (
                  <div className="mb-6">
                    <div className="popup-carousel">
                      <img
                        src={selectedRoom.images[popupCarouselIndex]}
                        alt={`${selectedRoom.title} - Image ${popupCarouselIndex + 1}`}
                        className="popup-carousel-image"
                      />
                      
                      {selectedRoom.images.length > 1 && (
                        <>
                          <button
                            onClick={prevPopupImage}
                            className="popup-carousel-btn prev"
                          >
                            <span className="material-icons">chevron_left</span>
                          </button>
                          <button
                            onClick={nextPopupImage}
                            className="popup-carousel-btn next"
                          >
                            <span className="material-icons">chevron_right</span>
                          </button>
                        </>
                      )}
                      
                      <div className="popup-carousel-indicators">
                        {selectedRoom.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`popup-carousel-dot ${idx === popupCarouselIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPopupCarouselIndex(idx);
                            }}
                          />
                        ))}
                      </div>
                      
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {popupCarouselIndex + 1} / {selectedRoom.images.length}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{selectedRoom.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{selectedRoom.description}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="material-icons text-yellow-400">star</span>
                      Guest Reviews ({userReviews[selectedRoom._id]?.length || 0})
                    </h4>

                    {userReviews[selectedRoom._id]?.length > 0 ? (
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {userReviews[selectedRoom._id].map((review) => (
                          <div key={review._id} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {review.userId?.name || 'Guest'}
                                {isLoggedIn() && review.userId?._id === user.id && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={`material-icons text-xs ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}>
                                  star
                                </span>
                              ))}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No reviews yet for this room.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Price per night</p>
                      <p className="text-lg sm:text-xl font-bold text-red-600">{formatCurrency(selectedRoom.pricePerDay)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedRoom.isAvailable
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {selectedRoom.isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Beds</p>
                      <p className="font-medium text-gray-900">{selectedRoom.noOfBeds}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Room Size</p>
                      <p className="font-medium text-gray-900">{selectedRoom.roomSize} sqft</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Max Occupancy</p>
                      <p className="font-medium text-gray-900">{selectedRoom.maxOccupancy} guests</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Checkout Time</p>
                      <p className="font-medium text-gray-900">{selectedRoom.timeForCheckout}:00</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <p className="text-xs text-gray-500 font-semibold">Location</p>
                      {selectedRoom.location && (selectedRoom.location.lat || selectedRoom.location.latitude || selectedRoom.location.city) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps(selectedRoom.location);
                          }}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors w-full sm:w-auto"
                        >
                          <span className="material-icons text-sm">map</span>
                          View on Google Maps
                        </button>
                      )}
                    </div>
                    <p className="text-sm break-words">
                      {selectedRoom.location?.city || ''} {selectedRoom.location?.state || ''} {selectedRoom.location?.country || ''}
                    </p>
                    {selectedRoom.distanceFromMe && (
                      <p className="text-xs text-red-600 mt-1">
                        📍 {selectedRoom.distanceFromMe} km from your location
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 break-words">
                      Coordinates: {selectedRoom.location?.lat || selectedRoom.location?.latitude || 'N/A'}, {selectedRoom.location?.lng || selectedRoom.location?.longitude || 'N/A'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {isLoggedIn() ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRoom(null);
                            openBookingModal(selectedRoom);
                          }}
                          disabled={!selectedRoom.isAvailable}
                          className={`w-full sm:flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                            selectedRoom.isAvailable
                              ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:shadow-lg'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {selectedRoom.isAvailable ? 'Book This Room' : 'Not Available'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRoom(null);
                            openReviewModal(selectedRoom);
                          }}
                          className="w-full sm:flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors"
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
                          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-colors"
                        >
                          Login to Book
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-2">
                          New user?{' '}
                          <button
                            onClick={() => {
                              setSelectedRoom(null);
                              setShowLoginPopup(true);
                              setPendingAction('register');
                            }}
                            className="text-red-600 hover:underline"
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

        {showImageZoom && selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] p-4"
            onClick={() => {
              setShowImageZoom(false);
              setSelectedImage(null);
            }}
          >
            <div className="relative w-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowImageZoom(false);
                  setSelectedImage(null);
                }}
                className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <span className="material-icons text-2xl sm:text-3xl">close</span>
              </button>
              
              <img
                src={selectedImage}
                alt="Zoomed view"
                className="w-full h-full object-contain max-h-[80vh] sm:max-h-[90vh] rounded-lg"
              />
            </div>
          </div>
        )}

        {showBookingModal && selectedRoomForBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Book Room</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="material-icons text-gray-600">close</span>
                </button>
              </div>

              <form onSubmit={createBooking} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <input
                    type="text"
                    value={selectedRoomForBooking.title}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
                  <input
                    type="text"
                    value={formatCurrency(selectedRoomForBooking.pricePerDay)}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
                  />
                </div>

                {selectedRoomForBooking.distanceFromMe && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-700 flex items-center gap-1">
                      <span className="material-icons text-sm">my_location</span>
                      Distance from your location: <span className="font-bold">{selectedRoomForBooking.distanceFromMe} km</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
                      value={bookingForm.bookingStartDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingStartDate: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
                      value={bookingForm.bookingEndDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingEndDate: e.target.value })}
                      min={bookingForm.bookingStartDate}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Advance Payment</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Advance Amount ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={selectedRoomForBooking.pricePerDay * 10}
                        step="10"
                        value={bookingForm.advance}
                        onChange={(e) => setBookingForm({ ...bookingForm, advance: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave 0 for no advance
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <select
                        value={bookingForm.advanceMethod}
                        onChange={(e) => setBookingForm({ ...bookingForm, advanceMethod: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  {bookingForm.advance > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-xs text-yellow-700">
                        <span className="font-semibold">Note:</span> You will pay ${bookingForm.advance} as advance payment via {bookingForm.advanceMethod}.
                        {bookingForm.advance < selectedRoomForBooking.pricePerDay && (
                          <span className="block mt-1">Remaining ${selectedRoomForBooking.pricePerDay - bookingForm.advance} will be paid at check-in.</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-colors disabled:opacity-50 shadow-md"
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReviewModal && selectedRoomForReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {reviewForm.isEditing ? 'Update Your Review' : 'Write a Review'}
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="material-icons text-gray-600">close</span>
                </button>
              </div>

              <form onSubmit={submitReview} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <input
                    type="text"
                    value={selectedRoomForReview.title}
                    disabled
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <span className={`material-icons text-2xl sm:text-3xl ${
                          star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}>
                          star
                        </span>
                      </button>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">{reviewForm.rating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none text-gray-900"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors disabled:opacity-50 shadow-md"
                  >
                    {loading ? 'Submitting...' : reviewForm.isEditing ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;








 