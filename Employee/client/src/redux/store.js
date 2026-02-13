// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// export default store;


import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
});

export default store;
