const User = require('../model/userModel');
const { sendEmail, emailTemplates } = require('../../../utils/emailService');
const crypto = require('crypto');

// Helper function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to hash OTP (for secure storage)
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

// Helper function to verify OTP
const verifyOTP = (plainOTP, hashedOTP) => {
  const hashed = crypto.createHash('sha256').update(plainOTP).digest('hex');
  return hashed === hashedOTP;
};

/**
 * API 1: Request OTP - POST /api/auth/forgot-password
 * Body: { email }
 */
exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    
    // Set expiry to 10 minutes from now
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Save to user document
    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordExpires = expires;
    user.resetPasswordAttempts = 0;
    await user.save();

    // Send email with OTP using your existing email service
    const emailResult = await sendEmail(
      user.email,
      '🔐 Password Reset OTP - Room Management System',
      `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello, ${user.name}!</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                We received a request to reset your password. Use the OTP below to proceed:
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
                <div style="font-size: 48px; letter-spacing: 10px; font-weight: bold; color: white; font-family: monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #856404; margin: 0;">
                  ⏰ This OTP will expire in <strong>10 minutes</strong>.
                </p>
                <p style="color: #856404; margin: 10px 0 0 0;">
                  🔒 Never share this OTP with anyone.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you didn't request a password reset, please ignore this email or contact support.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #888; font-size: 14px; text-align: center;">
                For security reasons, this OTP can only be used once.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
              <p style="color: #888; margin: 5px 0; font-size: 13px;">
                © ${new Date().getFullYear()} Room Management System. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    );

    if (emailResult.success) {
      res.status(200).json({ 
        message: 'OTP sent successfully to your email',
        expiresIn: '10 minutes'
      });
    } else {
      // If email fails, clear OTP
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      res.status(500).json({ 
        message: 'Failed to send OTP. Please try again.' 
      });
    }

  } catch (error) {
    console.error('Error in requestOTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * API 2: Verify OTP - POST /api/auth/verify-otp
 * Body: { email, otp }
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists
    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'No OTP request found. Please request again.' });
    }

    // Check if expired
    if (user.resetPasswordExpires < Date.now()) {
      // Clear expired OTP
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Track attempts (limit to 5)
    user.resetPasswordAttempts += 1;
    await user.save();

    if (user.resetPasswordAttempts > 5) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(400).json({ message: 'Too many failed attempts. Request new OTP.' });
    }

    // Verify OTP
    const isValid = verifyOTP(otp, user.resetPasswordOTP);

    if (!isValid) {
      return res.status(400).json({ 
        message: 'Invalid OTP',
        attemptsLeft: 5 - user.resetPasswordAttempts
      });
    }

    // OTP is valid
    res.status(200).json({ 
      message: 'OTP verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * API 3: Reset Password - POST /api/auth/reset-password
 * Body: { email, otp, newPassword }
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP exists and not expired
    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      return res.status(400).json({ message: 'No OTP request found. Please start over.' });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request again.' });
    }

    // Verify OTP one more time
    const isValid = verifyOTP(otp, user.resetPasswordOTP);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    
    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordAttempts = 0;
    
    await user.save();

    // Send password changed confirmation email
    await sendEmail(
      user.email,
      '🔐 Your Password Was Changed',
      emailTemplates.passwordChanged(user).html
    ).catch(err => console.error('Failed to send confirmation email:', err));

    res.status(200).json({ 
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};