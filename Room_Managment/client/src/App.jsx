// import './App.css'
// import Login from './Pages/Auth/Login'
// import Registration from './Pages/Auth/Registration'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Layout from './Components/Layout'
// import Profile from './Components/Profile'
// import Bookings from './Pages/Bookings'
// import ActiveBookings from './Pages/ActiveBookings'
// import History from './Pages/History'
// import OwnerRooms from './Pages/Owner/Rooms'
// import AllUsers from './Pages/Admin/AllUsers'
// import AllOwners from './Pages/Admin/AllOwners'
// import Dashboard from './Pages/Dashboard'
// import ForgotPassword from './Pages/Auth/ForgotPassword'

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* <Route path='/' element={<Login />} /> */}
//         <Route path='/login' element={<Login />} />
//         <Route path='/register' element={<Registration />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />


//         <Route element={<Layout />}>

//         <Route path='/' element={<Dashboard />} />


//           {/* Common Routes - These will have sidebar automatically */}
//           <Route path='/profile' element={<Profile />} />
//           <Route path='/bookings' element={<Bookings />} />
//           <Route path='/active-bookings' element={<ActiveBookings />} />
//           <Route path='/history' element={<History />} />

//           {/* Owner Routes */}
//           <Route path='/owner/rooms' element={<OwnerRooms />} />

//           {/* Admin Routes */}
//           <Route path='/admin/users' element={<AllUsers />} />
//           <Route path='/admin/owners' element={<AllOwners />} />
//         </Route>
//       </Routes>
//     </Router>
//   )
// }

// export default App


import './App.css'
import Login from './Pages/Auth/Login'
import Registration from './Pages/Auth/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout'
import ProtectedRoute from './Components/ProtectedRoute'
import Profile from './Components/Profile'
import Bookings from './Pages/Bookings'
import ActiveBookings from './Pages/ActiveBookings'
import History from './Pages/History'
import OwnerRooms from './Pages/Owner/Rooms'
import AllUsers from './Pages/Admin/AllUsers'
import AllOwners from './Pages/Admin/AllOwners'
import Dashboard from './Pages/Dashboard'
import ForgotPassword from './Pages/Auth/ForgotPassword'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public Dashboard - Accessible to everyone */}
        <Route element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        {/* Protected Routes - Require Authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/bookings' element={<Bookings />} />
            <Route path='/active-bookings' element={<ActiveBookings />} />
            <Route path='/history' element={<History />} />

            {/* Owner Routes */}
            <Route path='/owner/rooms' element={<OwnerRooms />} />

            {/* Admin Routes */}
            <Route path='/admin/users' element={<AllUsers />} />
            <Route path='/admin/owners' element={<AllOwners />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App