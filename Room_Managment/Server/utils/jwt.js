// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '30d',
//     });
// };

// const verifyToken = (token) => {
//     return jwt.verify(token, process.env.JWT_SECRET);
// };

// module.exports = { generateToken, verifyToken };

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    // Store user data in the token payload
    return jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d', // Token expiration time
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
