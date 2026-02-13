// import React, { useState } from 'react';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     mobileNumber: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (!formData.name || !formData.mobileNumber || !formData.password || !formData.confirmPassword) {
//       alert('Please fill in all fields');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     if (formData.mobileNumber.length !== 10) {
//       alert('Mobile number must be 10 digits');
//       return;
//     }

//     // Registration logic
//     const userData = {
//       name: formData.name,
//       mobileNumber: formData.mobileNumber,
//       password: formData.password
//     };

//     console.log('Registration Data:', userData);
//     alert(`Registration successful!\nName: ${formData.name}\nMobile: ${formData.mobileNumber}`);
    
//     // Reset form
//     setFormData({
//       name: '',
//       mobileNumber: '',
//       password: '',
//       confirmPassword: ''
//     });
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Create Account</h2>
        
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               style={styles.input}
//             />
//           </div>
          
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Mobile Number</label>
//             <input
//               type="text"
//               name="mobileNumber"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               placeholder="Enter 10-digit mobile number"
//               style={styles.input}
//             />
//           </div>
          
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Create password"
//               style={styles.input}
//             />
//           </div>
          
//           <div style={styles.inputGroup}>
//             <label style={styles.label}>Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm password"
//               style={styles.input}
//             />
//           </div>
          
//           <button type="submit" style={styles.button}>
//             Register
//           </button>
//         </form>
        
//         <div style={styles.loginLink}>
//           <p>Already have an account? <span style={styles.link}>Login here</span></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '100vh',
//     backgroundColor: '#f0f2f5',
//     fontFamily: 'Arial, sans-serif',
//     padding: '20px'
//   },
//   card: {
//     backgroundColor: 'white',
//     padding: '40px',
//     borderRadius: '10px',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//     width: '100%',
//     maxWidth: '450px',
//   },
//   title: {
//     textAlign: 'center',
//     marginBottom: '30px',
//     color: '#333',
//     fontSize: '28px'
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   inputGroup: {
//     marginBottom: '20px',
//   },
//   label: {
//     display: 'block',
//     marginBottom: '8px',
//     fontWeight: '600',
//     color: '#555',
//     fontSize: '14px'
//   },
//   input: {
//     width: '100%',
//     padding: '12px 15px',
//     border: '1px solid #ddd',
//     borderRadius: '6px',
//     fontSize: '16px',
//     boxSizing: 'border-box',
//     transition: 'border-color 0.3s',
//   },
//   inputFocus: {
//     borderColor: '#007bff',
//     outline: 'none',
//   },
//   button: {
//     backgroundColor: '#28a745',
//     color: 'white',
//     padding: '14px',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s',
//     marginTop: '10px'
//   },
//   buttonHover: {
//     backgroundColor: '#218838',
//   },
//   loginLink: {
//     marginTop: '25px',
//     textAlign: 'center',
//     color: '#666',
//     fontSize: '14px'
//   },
//   link: {
//     color: '#007bff',
//     cursor: 'pointer',
//     fontWeight: '600',
//     textDecoration: 'underline'
//   }
// };

// export default RegisterPage;



import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice'; // Import register action
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobileNumber || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    dispatch(registerUser(formData))
      .then((response) => {
        if (response.type === 'auth/registerUser/fulfilled') {
          navigate('/login'); // Redirect to login page after successful registration
        }
      })
      .catch((error) => {
        alert('Registration failed: ' + error.error.message);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Register
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
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '28px'
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
    fontWeight: '600',
    color: '#555',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#007bff',
    outline: 'none',
  },
  button: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px'
  },
  buttonHover: {
    backgroundColor: '#218838',
  },
  loginLink: {
    marginTop: '25px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'underline'
  }
};

export default RegisterPage;

