// const express = require('express');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// const connectDB = require('./config/db');
// const authRoutes = require('./src/Auth/routes/authRoutes');
// const errorHandler = require('./middleware/errorMiddleware');
// const userroutes = require('./src/User/routes/userRoutes');
// const roomroutes = require('./src/Rooms/routes/roomRoutes');
// const bookingroutes = require('./src/Booking/routes/bookingRoute');
// const activebookingroutes = require('./src/ActivBooking/routes/activeBookingRoutes');
// const reviewroutes = require('./src/Review/routes/reviewsRoute');
// const cors = require('cors');
// dotenv.config();

// const app = express();

// connectDB();
// app.use(morgan('dev'));

// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend URL
//   credentials: true, // Allow cookies to be sent/received
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


// app.use('/api/auth', authRoutes);
// app.use('/api/user', userroutes);
// app.use('/api/room', roomroutes);
// app.use('/api/booking', bookingroutes);
// app.use('/api/activebooking', activebookingroutes);
// app.use('/api/review', reviewroutes);




// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./src/Auth/routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const userroutes = require('./src/User/routes/userRoutes');
const roomroutes = require('./src/Rooms/routes/roomRoutes');
const bookingroutes = require('./src/Booking/routes/bookingRoute');
const activebookingroutes = require('./src/ActivBooking/routes/activeBookingRoutes');
const reviewroutes = require('./src/Review/routes/reviewsRoute');
const forgotPasswordRoutes = require('./src/User/routes/forgotPasswordRoutes');
const cors = require('cors');
dotenv.config();

const app = express();

connectDB();
app.use(morgan('dev'));

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));


app.use('/api/auth', authRoutes);
app.use('/api/user', userroutes);
app.use('/api/room', roomroutes);
app.use('/api/booking', bookingroutes);
app.use('/api/activebooking', activebookingroutes);
app.use('/api/review', reviewroutes);
app.use('/api/otp', forgotPasswordRoutes);




app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});