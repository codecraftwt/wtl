import './App.css'
import Login from './Pages/Auth/Login'
import Registration from './Pages/Auth/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import OwnerDashBoard from './Pages/Owner/OwnerDashBoard'
// import UserDashBoard from './Pages/User/UserDashBoard'
// import AdminDashBoard from './Pages/Admin/AdminDashBoard'
import Layout from './Components/Layout'  // ✅ Import Layout
import Profile from './Components/Profile' // ✅ Import Profile

// 👇 CREATE THESE PAGES (you don't have them yet)
import Bookings from './Pages/Bookings'
import ActiveBookings from './Pages/ActiveBookings'
import History from './Pages/History'
import OwnerRooms from './Pages/Owner/Rooms'
import AllUsers from './Pages/Admin/AllUsers'
import AllOwners from './Pages/Admin/AllOwners'
import Dashboard from './Pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - NO SIDEBAR */}
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />

        {/* ✅ ALL PROTECTED ROUTES - AUTOMATIC SIDEBAR */}
        <Route element={<Layout />}>
          
          {/* Dashboard Routes */}
          {/* <Route path='/owner/dashboard' element={<OwnerDashBoard />} />
          <Route path='/user/dashboard' element={<UserDashBoard />} />
          <Route path='/admin/dashboard' element={<AdminDashBoard />} /> */}
          <Route path='/dashboard' element={<Dashboard />} />

          
          {/* Common Routes - These will have sidebar automatically */}
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
      </Routes>
    </Router>
  )
}

export default App