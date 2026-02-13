// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import LoginPage from './pages/LoginPage'
// import RegisterPage from './pages/RegisterPage'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//      {/* <LoginPage/> */}
//      <RegisterPage/>
//     </>
//   )
// }

// export default App
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { useSelector } from 'react-redux';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/admin" 
          element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <LoginPage />} 
        />
        <Route 
          path="/employee" 
          element={isAuthenticated && user?.role === 'emp' ? <EmployeeDashboard /> : <LoginPage />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
