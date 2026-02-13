// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsers, createUser, deleteUser, updateUser } from '../redux/usersSlice';

// const AdminDashboard = () => {
//   const [formData, setFormData] = useState({ name: '', mobileNumber: '', password: '' });
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.users);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCreate = (e) => {
//     e.preventDefault();
//     dispatch(createUser(formData));
//     setFormData({ name: '', mobileNumber: '', password: '' });
//   };

//   const handleDelete = (userId) => {
//     dispatch(deleteUser(userId));
//   };

//   const handleEdit = (userId) => {
//     const userToEdit = users.find((user) => user._id === userId);
//     setFormData({
//       name: userToEdit?.name || '',
//       mobileNumber: userToEdit?.mobileNumber || '',
//       password: '', // you can choose not to edit the password here
//     });
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     const userId = users.find((user) => user.name === formData.name)._id; // You can change this logic to use userId more reliably
//     dispatch(updateUser({ userId, userData: formData }));
//     setFormData({ name: '', mobileNumber: '', password: '' });
//   };
// console.log(formData);

//   return (
//     <div>
//       <h2>Admin Dashboard</h2>

//       <form onSubmit={handleCreate}>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Name"
//         />
//         <input
//           type="text"
//           name="mobileNumber"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           placeholder="Mobile Number"
//         />
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Password"
//         />
//         <button type="submit">Create User</button>
//       </form>

//       <h3>Employee List</h3>
//       <ul>
//         {users.map((user) => (
//           <li key={user._id}>
//             {user.name} ({user.role})
//             <button onClick={() => handleDelete(user._id)}>Delete</button>
//             <button onClick={() => handleEdit(user._id)}>Edit</button>
//           </li>
//         ))}
//       </ul>

//       {formData.name && (
//         <div>
//           <h4>Edit Employee</h4>
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
//             <button type="submit">Update User</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, deleteUser, updateUser, approveSalaryIncrement } from '../redux/usersSlice';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    mobileNumber: '', 
    password: '',
    role: 'emp'
  });
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingIncrement, setUpdatingIncrement] = useState(null); // Track which user is being updated
  
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createUser(formData));
    resetForm();
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      mobileNumber: user.mobileNumber,
      password: '', // Leave empty for security
      role: user.role
    });
    setEditingUserId(user._id);
    setEditMode(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (editingUserId) {
      dispatch(updateUser({ 
        userId: editingUserId, 
        userData: formData 
      }));
      resetForm();
    }
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
    setShowDeleteConfirm(null);
  };

  // Handle salary increment approval toggle
  const handleSalaryIncrementToggle = (userId, currentStatus) => {
  setUpdatingIncrement(userId);
  const newStatus = !currentStatus;
  
  dispatch(approveSalaryIncrement({ 
    userId, 
    canIncrementSalary: newStatus 
  }))
  .finally(() => {
    setUpdatingIncrement(null);
  });
};

  const resetForm = () => {
    setFormData({ name: '', mobileNumber: '', password: '', role: 'emp' });
    setEditMode(false);
    setEditingUserId(null);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNumber.includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.adminDashboard}>
      {/* Header */}
      <header style={styles.dashboardHeader}>
        <div style={styles.headerContent}>
          <h1 style={styles.dashboardTitle}>
            <span style={styles.headerIcon}>👨‍💼</span> Admin Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.dashboardContainer}>
        {/* Stats Section */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <span>👥</span>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{users.length}</h3>
              <p style={styles.statLabel}>Total Employees</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <span>✅</span>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{users.filter(u => u.role === 'emp').length}</h3>
              <p style={styles.statLabel}>Employees</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <span>💰</span>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statNumber}>{users.filter(u => u.canIncrementSalary).length}</h3>
              <p style={styles.statLabel}>Approved for Salary Increment</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search employees by name, mobile, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button 
            onClick={() => dispatch(fetchUsers())}
            style={styles.refreshBtn}
          >
            <span style={styles.refreshIcon}>🔄</span> Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Create/Edit Form */}
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>
            {editMode ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <form onSubmit={editMode ? handleUpdate : handleCreate} style={styles.employeeForm}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.formInput}
                  placeholder="Enter full name"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  style={styles.formInput}
                  placeholder="Enter 10-digit number"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  {editMode ? 'New Password (leave blank to keep)' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editMode}
                  style={styles.formInput}
                  placeholder={editMode ? "New password" : "Enter password"}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={styles.formSelect}
                >
                  <option value="emp">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editMode ? 'Update Employee' : 'Create Employee'}
              </button>
              {editMode && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  style={styles.cancelBtn}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Employee List */}
        <div style={styles.employeeListContainer}>
          <div style={styles.listHeader}>
            <h2 style={styles.listTitle}>Employee List</h2>
            <div style={styles.listSummary}>
              Showing {filteredUsers.length} of {users.length} employees
            </div>
          </div>
          
          {loading && users.length === 0 ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading employees...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>👥</span>
              <p>No employees found</p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.employeeTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Mobile Number</th>
                    <th style={styles.tableHeader}>Role</th>
                    <th style={styles.tableHeader}>Salary Approval</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} style={styles.employeeRow}>
                      <td>
                        <div style={styles.employeeInfo}>
                          <div style={styles.avatar}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={styles.employeeName}>{user.name}</div>
                            <div style={styles.employeeId}>ID: {user._id?.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={styles.mobileNumber}>
                          <span style={styles.phoneIcon}>📱</span> {user.mobileNumber}
                        </div>
                      </td>
                      <td>
                        <span style={user.role === 'admin' ? styles.adminBadge : styles.empBadge}>
                          {user.role === 'admin' ? 'Admin' : 'Employee'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleSalaryIncrementToggle(user._id, user.canIncrementSalary)}
                          disabled={updatingIncrement === user._id}
                          style={user.canIncrementSalary ? styles.approvedToggle : styles.disapprovedToggle}
                        >
                          {updatingIncrement === user._id ? (
                            'Updating...'
                          ) : user.canIncrementSalary ? (
                            '✅ Approved'
                          ) : (
                            '❌ Disapproved'
                          )}
                        </button>
                      </td>
                      <td>
                        <div style={styles.actionButtons}>
                          <button 
                            onClick={() => handleEdit(user)}
                            style={styles.editBtn}
                          >
                            <span>✏️</span> Edit
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(user._id)}
                            style={styles.deleteBtn}
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <span style={styles.warningIcon}>⚠️</span> Confirm Delete
              </h3>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalText}>Are you sure you want to delete this employee? This action cannot be undone.</p>
              <div style={styles.employeeToDelete}>
                {users.find(u => u._id === showDeleteConfirm)?.name}
              </div>
            </div>
            <div style={styles.modalActions}>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                style={styles.confirmDeleteBtn}
              >
                <span>🗑️</span> Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                style={styles.cancelDeleteBtn}
              >
                <span>✖️</span> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// All CSS Styles
const styles = {
  adminDashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  // Header Styles
  dashboardHeader: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0 2rem',
  },

  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1.5rem 0',
  },

  dashboardTitle: {
    color: '#2d3748',
    fontSize: '1.75rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: 0,
  },

  headerIcon: {
    fontSize: '1.5rem',
  },

  // Dashboard Container
  dashboardContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },

  // Stats Section
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },

  statCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },

  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },

  statContent: {
    flex: 1,
  },

  statNumber: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: '#2d3748',
    margin: 0,
    lineHeight: 1,
  },

  statLabel: {
    color: '#718096',
    fontSize: '0.95rem',
    marginTop: '0.25rem',
    fontWeight: 500,
  },

  // Search Container
  searchContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center',
  },

  searchBox: {
    flex: 1,
    position: 'relative',
  },

  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1rem',
  },

  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'white',
    transition: 'all 0.3s ease',
  },

  refreshBtn: {
    padding: '1rem 1.5rem',
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    color: '#4a5568',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },

  refreshIcon: {
    fontSize: '0.9rem',
  },

  // Error Message
  errorMessage: {
    background: '#fed7d7',
    border: '1px solid #fc8181',
    color: '#c53030',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  errorIcon: {
    fontSize: '1.25rem',
  },

  // Form Container
  formContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  },

  formTitle: {
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    marginTop: 0,
  },

  employeeForm: {
    width: '100%',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  formLabel: {
    color: '#4a5568',
    fontWeight: 600,
    fontSize: '0.95rem',
  },

  formInput: {
    padding: '0.875rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    background: 'white',
  },

  formSelect: {
    padding: '0.875rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
  },

  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },

  submitBtn: {
    padding: '0.875rem 1.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1,
  },

  cancelBtn: {
    padding: '0.875rem 1.75rem',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1,
  },

  // Employee List
  employeeListContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  },

  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },

  listTitle: {
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },

  listSummary: {
    color: '#718096',
    fontSize: '0.95rem',
  },

  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
  },

  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },

  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#718096',
  },

  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },

  tableContainer: {
    overflowX: 'auto',
  },

  employeeTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  tableHeader: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '2px solid #e2e8f0',
    color: '#4a5568',
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
  },

  employeeRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s ease',
  },

  employeeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 0',
  },

  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
  },

  employeeName: {
    color: '#2d3748',
    fontWeight: 600,
    fontSize: '1rem',
  },

  employeeId: {
    color: '#718096',
    fontSize: '0.85rem',
    marginTop: '0.25rem',
  },

  mobileNumber: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4a5568',
  },

  phoneIcon: {
    fontSize: '0.9rem',
  },

  adminBadge: {
    background: '#e9d8fd',
    color: '#553c9a',
    padding: '0.375rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'inline-block',
  },

  empBadge: {
    background: '#c6f6d5',
    color: '#22543d',
    padding: '0.375rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'inline-block',
  },

  approvedToggle: {
    padding: '0.5rem 1rem',
    background: '#c6f6d5',
    color: '#065f46',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  disapprovedToggle: {
    padding: '0.5rem 1rem',
    background: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
  },

  editBtn: {
    padding: '0.5rem 1rem',
    background: '#bee3f8',
    color: '#2c5282',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    transition: 'all 0.2s ease',
  },

  deleteBtn: {
    padding: '0.5rem 1rem',
    background: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    transition: 'all 0.2s ease',
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },

  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },

  modalHeader: {
    marginBottom: '1.5rem',
  },

  modalTitle: {
    color: '#2d3748',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },

  warningIcon: {
    fontSize: '1.5rem',
  },

  modalBody: {
    marginBottom: '2rem',
  },

  modalText: {
    color: '#4a5568',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },

  employeeToDelete: {
    background: '#f7fafc',
    padding: '1rem',
    borderRadius: '8px',
    color: '#2d3748',
    fontWeight: 600,
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },

  modalActions: {
    display: 'flex',
    gap: '1rem',
  },

  confirmDeleteBtn: {
    flex: 1,
    padding: '0.875rem 1.75rem',
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },

  cancelDeleteBtn: {
    flex: 1,
    padding: '0.875rem 1.75rem',
    background: '#e2e8f0',
    color: '#4a5568',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },
};

// Add CSS animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;