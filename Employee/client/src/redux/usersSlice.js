// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// // Fetch all users (employees)
// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (_, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }
//     try {
//       const response = await axios.get('http://localhost:5000/api/user/', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
// // Fetch user by ID
// export const fetchUserById = createAsyncThunk(
//   'users/fetchUserById',
//   async (userId, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }

//     try {
//       const response = await axios.get(`http://localhost:5000/api/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Create a new employee
// export const createUser = createAsyncThunk(
//   'users/createUser',
//   async (userData, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/user/', userData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Update user by ID
// export const updateUser = createAsyncThunk(
//   'users/updateUser',
//   async ({ userId, userData }, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }

//     try {
//       const response = await axios.put(`http://localhost:5000/api/user/${userId}`, userData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Delete user by ID
// export const deleteUser = createAsyncThunk(
//   'users/deleteUser',
//   async (userId, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }

//     try {
//       await axios.delete(`http://localhost:5000/api/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return { userId };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
// // Approve/Disapprove salary increment (Admin)
// export const approveSalaryIncrement = createAsyncThunk(
//   'users/approveSalaryIncrement',
//   async ({ userId, approved }, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/user/${userId}/approve-increment`,
//         { approved },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       return { userId, approved, updatedUser: response.data };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Submit salary increment request (Employee)
// export const submitSalaryIncrementRequest = createAsyncThunk(
//   'users/submitSalaryIncrementRequest',
//   async ({ userId, incrementData }, thunkAPI) => {
//     const token = Cookies.get('token');
//     if (!token) {
//       return thunkAPI.rejectWithValue("Token is missing");
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/api/user/${userId}/increment-salary`,
//         incrementData,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );
//       return { userId, response: response.data };
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

// // Users slice
// const usersSlice = createSlice({
//   name: 'users',
//   initialState: {
//     users: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch users
//       .addCase(fetchUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch user by ID
//     .addCase(fetchUserById.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     })
//     .addCase(fetchUserById.fulfilled, (state, action) => {
//       state.loading = false;
//       // Store the fetched user data in the state (you could also store it separately)
//       state.user = action.payload;
//     })
//     .addCase(fetchUserById.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     })
//       // Create user
//       .addCase(createUser.fulfilled, (state, action) => {
//         state.users.push(action.payload);
//       })
//       // Update user
//       .addCase(updateUser.fulfilled, (state, action) => {
//         const index = state.users.findIndex((user) => user._id === action.payload._id);
//         if (index >= 0) {
//           state.users[index] = action.payload;
//         }
//       })
//       // Delete user
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.users = state.users.filter((user) => user._id !== action.payload.userId);
//       })
//        // Approve salary increment
//       .addCase(approveSalaryIncrement.fulfilled, (state, action) => {
//         const { userId, approved, updatedUser } = action.payload;
//         const index = state.users.findIndex((user) => user._id === userId);
//         if (index >= 0) {
//           state.users[index] = { ...state.users[index], canIncrementSalary: approved };
//         }
//         if (state.user && state.user._id === userId) {
//           state.user = { ...state.user, canIncrementSalary: approved };
//         }
//       })
//       // Submit salary increment request
//       .addCase(submitSalaryIncrementRequest.fulfilled, (state, action) => {
//         // Handle successful submission if needed
//         const { userId } = action.payload;
//         const index = state.users.findIndex((user) => user._id === userId);
//         if (index >= 0) {
//           state.users[index] = { ...state.users[index], canIncrementSalary: false };
//         }
//         if (state.user && state.user._id === userId) {
//           state.user = { ...state.user, canIncrementSalary: false };
//         }
//       });
//   },
// });

// export default usersSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Fetch all users (employees)
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }
    try {
      const response = await axios.get('http://localhost:5000/api/user/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new employee
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user/', userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update user by ID
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ userId, userData }, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/user/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete user by ID
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }

    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { userId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Approve/Disapprove salary increment (Admin)
export const approveSalaryIncrement = createAsyncThunk(
  'users/approveSalaryIncrement',
  async ({ userId, canIncrementSalary }, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/${userId}/approve-increment`,
        { canIncrementSalary },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { userId, canIncrementSalary, updatedUser: response.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Submit salary increment request (Employee)
export const submitSalaryIncrementRequest = createAsyncThunk(
  'users/submitSalaryIncrementRequest',
  async ({ userId, incrementAmount }, thunkAPI) => {
    const token = Cookies.get('token');
    if (!token) {
      return thunkAPI.rejectWithValue("Token is missing");
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/${userId}/increment-salary`,
        { incrementAmount },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return { userId, response: response.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index >= 0) {
          state.users[index] = action.payload;
        }
        if (state.user && state.user._id === action.payload._id) {
          state.user = action.payload;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload.userId);
      })
      // Approve salary increment
      .addCase(approveSalaryIncrement.fulfilled, (state, action) => {
        const { userId, canIncrementSalary } = action.payload;
        const index = state.users.findIndex((user) => user._id === userId);
        if (index >= 0) {
          state.users[index] = { ...state.users[index], canIncrementSalary };
        }
        if (state.user && state.user._id === userId) {
          state.user = { ...state.user, canIncrementSalary };
        }
      })
      // Submit salary increment request
      .addCase(submitSalaryIncrementRequest.fulfilled, (state, action) => {
        const { userId } = action.payload;
        const index = state.users.findIndex((user) => user._id === userId);
        if (index >= 0) {
          state.users[index] = { ...state.users[index], canIncrementSalary: false };
        }
        if (state.user && state.user._id === userId) {
          state.user = { ...state.user, canIncrementSalary: false };
        }
      });
  },
});

export default usersSlice.reducer;