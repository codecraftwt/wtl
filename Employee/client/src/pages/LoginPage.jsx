import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/authSlice'; // Import login action
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!mobileNumber || !password) {
      alert('Please fill in all fields');
      return;
    }

    // Dispatch the login action
    dispatch(loginUser({ mobileNumber, password }))
      .then((response) => {
        if (response.type === 'auth/loginUser/fulfilled') {
          if (response.payload.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/employee');
          }
        }
      })
      .catch((error) => {
        alert('Login failed: ' + error.error.message);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
            />
          </div>
          <p onClick={()=>navigate('/register')}>Regester</p>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  testCredentials: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    textAlign: 'center',
  },
  testText: {
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    color: '#666',
  },
  credentials: {
    margin: '5px 0',
    color: '#333',
    fontSize: '14px',
  },
};

export default LoginPage;
