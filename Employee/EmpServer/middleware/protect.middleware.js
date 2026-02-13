// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET; 
// const protect = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next(); 
//   } catch (error) {
//     return res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = protect;


const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check if JWT token is valid
const protect = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token from headers

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token using JWT_SECRET
    req.user = decoded; // Attach the decoded user data to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
