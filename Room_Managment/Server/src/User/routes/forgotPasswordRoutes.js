const express = require('express');
const router = express.Router();
const {
  requestOTP,
  verifyOTP,
  resetPassword
} = require('../Controller/forgotPasswordController');

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request OTP for password reset
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password', requestOTP);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP
 * @access  Public
 * @body    { email, otp }
 */
router.post('/verify-otp', verifyOTP);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with OTP
 * @access  Public
 * @body    { email, otp, newPassword }
 */
router.post('/reset-password', resetPassword);

module.exports = router;