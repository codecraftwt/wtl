// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsers, fetchUserById, updateUser } from '../redux/usersSlice';
// import Cookies from 'js-cookie';

// const EmployeeDashboard = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth); // Logged-in user's data
//   const { user: fetchedUser, loading, error } = useSelector((state) => state.users); // State for fetched user details
  
//   const [formData, setFormData] = useState({ name: '', mobileNumber: '' });

//   // Fetch user by ID using token and cookies
//   useEffect(() => {
//     const token = Cookies.get('token');
//     const userId = Cookies.get('userId');  // User's ID from cookies

//     // If there is a token and userId, fetch the user details
//     if (token && userId) {
//       dispatch(fetchUserById(userId));  // Pass userId to fetch data
//     } else {
//       console.log('Token or User ID is missing.');
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (fetchedUser) {
//       setFormData({ name: fetchedUser.name, mobileNumber: fetchedUser.mobileNumber });
//     }
//   }, [fetchedUser]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     if (fetchedUser) {
//       dispatch(updateUser({ userId: fetchedUser._id, userData: formData }));
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Employee Dashboard</h2>
//       {fetchedUser ? (
//         <div>
//           <p>Name: {fetchedUser.name}</p>
//           <p>Mobile Number: {fetchedUser.mobileNumber}</p>
//           <form onSubmit={handleUpdate}>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Name"
//             />
//             <input
//               type="text"
//               name="mobileNumber"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               placeholder="Mobile Number"
//             />
//             <button type="submit">Update Info</button>
//           </form>
//         </div>
//       ) : (
//         <p>No user data available.</p>
//       )}
//     </div>
//   );
// };

// export default EmployeeDashboard;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, updateUser, submitSalaryIncrementRequest } from '../redux/usersSlice';
import Cookies from 'js-cookie';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { user: fetchedUser, loading, error } = useSelector((state) => state.users);
  
  const [formData, setFormData] = useState({ name: '', mobileNumber: '' });
  const [incrementAmount, setIncrementAmount] = useState('');
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [submittingSalary, setSubmittingSalary] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');

    if (token && userId) {
      dispatch(fetchUserById(userId));
    } else {
      console.log('Token or User ID is missing.');
    }
  }, [dispatch]);

  useEffect(() => {
    if (fetchedUser) {
      setFormData({ name: fetchedUser.name, mobileNumber: fetchedUser.mobileNumber });
    }
  }, [fetchedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (fetchedUser) {
      dispatch(updateUser({ userId: fetchedUser._id, userData: formData }));
    }
  };

  const handleSalaryIncrementSubmit = (e) => {
    e.preventDefault();
    if (fetchedUser && incrementAmount) {
      setSubmittingSalary(true);
      dispatch(submitSalaryIncrementRequest({ 
        userId: fetchedUser._id, 
        incrementAmount: parseInt(incrementAmount)
      }))
      .then(() => {
        setShowSalaryForm(false);
        setIncrementAmount('');
        // Refresh user data after submission
        dispatch(fetchUserById(fetchedUser._id));
      })
      .finally(() => {
        setSubmittingSalary(false);
      });
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading your profile...</p>
    </div>
  );
  
  if (error) return (
    <div style={styles.errorContainer}>
      <p style={styles.errorText}>❌ {error}</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👨‍💼 Employee Dashboard</h2>
        <p style={styles.welcome}>Welcome back, {fetchedUser?.name || 'Employee'}!</p>
      </div>

      <div style={styles.content}>
        {fetchedUser ? (
          <div style={styles.profileSection}>
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Your Profile Information</h3>
              
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Name:</span>
                  <span style={styles.infoValue}>{fetchedUser.name}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Mobile Number:</span>
                  <span style={styles.infoValue}>{fetchedUser.mobileNumber}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Role:</span>
                  <span style={styles.roleBadge}>{fetchedUser.role}</span>
                </div>
                
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Salary Approval Status:</span>
                  <span style={fetchedUser.canIncrementSalary ? styles.approvedStatus : styles.disapprovedStatus}>
                    {fetchedUser.canIncrementSalary ? '✅ Approved for Salary Increment' : '❌ Not Approved'}
                  </span>
                </div>
              </div>
            </div>

            {/* Salary Increment Form - Only show if approved */}
            {fetchedUser.canIncrementSalary && (
              <div style={styles.salaryFormCard}>
                <h3 style={styles.formTitle}>
                  💰 Salary Increment Request
                  <button 
                    onClick={() => setShowSalaryForm(!showSalaryForm)}
                    style={styles.toggleSalaryBtn}
                  >
                    {showSalaryForm ? 'Hide Form' : 'Request Salary Increment'}
                  </button>
                </h3>
                
                {showSalaryForm && (
                  <form onSubmit={handleSalaryIncrementSubmit} style={styles.salaryForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="incrementAmount">
                        Increment Amount (₹)
                      </label>
                      <input
                        id="incrementAmount"
                        type="number"
                        value={incrementAmount}
                        onChange={(e) => setIncrementAmount(e.target.value)}
                        required
                        style={styles.input}
                        placeholder="Enter amount (e.g., 5000)"
                        min="100"
                        step="100"
                      />
                      <p style={styles.helperText}>
                        Enter the amount you want your salary to be increased by
                      </p>
                    </div>
                    
                    <div style={styles.formActions}>
                      <button 
                        type="submit" 
                        style={styles.submitSalaryBtn}
                        disabled={submittingSalary || !incrementAmount}
                      >
                        {submittingSalary ? 'Submitting...' : 'Submit Salary Increment Request'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowSalaryForm(false);
                          setIncrementAmount('');
                        }}
                        style={styles.cancelSalaryBtn}
                      >
                        Cancel
                      </button>
                    </div>
                    
                    <div style={styles.note}>
                      <p style={styles.noteText}>
                        ⓘ Your request will be reviewed by the admin. Once submitted, you cannot request again until approved.
                      </p>
                    </div>
                  </form>
                )}
                
                {!showSalaryForm && fetchedUser.canIncrementSalary && (
                  <div style={styles.salaryInfo}>
                    <p style={styles.salaryInfoText}>
                      You are approved to submit a salary increment request. Click the button above to submit your request.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Update Your Information</h3>
              
              <form onSubmit={handleUpdate} style={styles.form}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="mobileNumber">Mobile Number</label>
                    <input
                      id="mobileNumber"
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      style={styles.input}
                    />
                  </div>
                </div>
                
                <button type="submit" style={styles.updateButton}>
                  Update Information
                </button>
              </form>
              
              <div style={styles.note}>
                <p style={styles.noteText}>
                  ⓘ You can only update your own information. Contact admin for other changes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.noData}>
            <p style={styles.noDataText}>No user data available.</p>
            <p style={styles.noDataSubtext}>Please contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '28px',
  },
  welcome: {
    margin: '0',
    color: '#666',
    fontSize: '16px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '20px',
    borderBottom: '2px solid #4f46e5',
    paddingBottom: '10px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  infoLabel: {
    color: '#666',
    fontSize: '14px',
    fontWeight: '600',
  },
  infoValue: {
    color: '#333',
    fontSize: '16px',
    fontWeight: '500',
  },
  roleBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
    width: 'fit-content',
  },
  approvedStatus: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
    width: 'fit-content',
  },
  disapprovedStatus: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-block',
    width: 'fit-content',
  },
  salaryFormCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  toggleSalaryBtn: {
    marginLeft: '15px',
    padding: '8px 15px',
    backgroundColor: '#fbbf24',
    color: '#78350f',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  salaryForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '15px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  helperText: {
    color: '#666',
    fontSize: '12px',
    marginTop: '5px',
  },
  label: {
    color: '#555',
    fontSize: '14px',
    fontWeight: '600',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  formActions: {
    display: 'flex',
    gap: '15px',
  },
  submitSalaryBtn: {
    padding: '12px 25px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    flex: 1,
  },
  cancelSalaryBtn: {
    padding: '12px 25px',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1,
  },
  salaryInfo: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    borderLeft: '4px solid #0ea5e9',
  },
  salaryInfoText: {
    margin: '0',
    color: '#0369a1',
    fontSize: '14px',
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  formTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '20px',
    borderBottom: '2px solid #4f46e5',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  updateButton: {
    padding: '12px 25px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    alignSelf: 'flex-start',
  },
  note: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    borderLeft: '4px solid #0ea5e9',
  },
  noteText: {
    margin: '0',
    color: '#0369a1',
    fontSize: '14px',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  noDataText: {
    color: '#666',
    fontSize: '18px',
    marginBottom: '10px',
  },
  noDataSubtext: {
    color: '#888',
    fontSize: '14px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    color: '#666',
    fontSize: '18px',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '18px',
    backgroundColor: '#fee2e2',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #fca5a5',
  },
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
  
  button:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);

export default EmployeeDashboard;