import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Register user action
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/auth/reg', userData);
      return response.data; // Return response data to store in Redux
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Login user action
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (loginData, thunkAPI) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/user/auth/log', loginData);
//       // Store token and user data in cookies
//       Cookies.set('token', response.data.token, { expires: 7 }); 
//       Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
//       return response.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/auth/log', loginData);
      // Store token and user data in cookies
      Cookies.set('token', response.data.token, { expires: 7 }); 
      Cookies.set('user', JSON.stringify(response.data), { expires: 7 });
      Cookies.set('userId', response.data.userId, { expires: 7 });  // Store userId explicitly
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null, // Safely parse user data
  token: Cookies.get('token') || null,
  isAuthenticated: !!Cookies.get('token'),
  loading: false,
  error: null,
};


// Slice for authentication (login, register)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
      Cookies.remove('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
