const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASS // Your app password: ecnd dgjw mhre wwwe
  },
  tls: {
    rejectUnauthorized: false // Helps with some connection issues
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email server connection error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

/**
 * Send email function
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Plain text alternative (optional)
 */
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Simple text version from HTML
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Email templates for your Room Management System
const emailTemplates = {
  // Welcome email for new users
  welcome: (user) => ({
    subject: '🎉 Welcome to Room Management System!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏨 Room Management System</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${user.name}! 👋</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with Room Management System. We're excited to have you on board!
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Your account has been created successfully. You can now log in and start booking rooms.
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${process.env.FRONTEND_URL}/login" style="background: #667eea; color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(102,126,234,0.4);">
                🔑 Login to Your Account
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="color: #555; margin: 0; font-size: 14px;">
                <strong>📋 Account Details:</strong><br>
                • Name: ${user.name}<br>
                • Email: ${user.email}<br>
                • Role: ${user.role || 'User'}<br>
                • Registered: ${new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
            <p style="color: #888; margin: 5px 0; font-size: 13px;">
              © ${new Date().getFullYear()} Room Management System. All rights reserved.
            </p>
            <p style="color: #888; margin: 5px 0; font-size: 12px;">
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Password changed notification
  passwordChanged: (user) => ({
    subject: '🔐 Your Password Was Changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Password Changed Successfully</h2>
        <p style="color: #666;">Hello ${user.name},</p>
        <p style="color: #666;">Your password was successfully changed on ${new Date().toLocaleString()}.</p>
        <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
          <p style="color: #856404; margin: 0;">
            ⚠️ If you didn't make this change, please contact support immediately.
          </p>
        </div>
        <a href="${process.env.FRONTEND_URL}/login" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">
          Go to Login
        </a>
      </div>
    `
  }),

  // Booking confirmation
  bookingConfirmed: (user, booking) => ({
    subject: '✅ Booking Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #28a745; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Booking Confirmed! 🎉</h1>
        </div>
        <div style="padding: 30px;">
          <p style="color: #666;">Hello ${user.name},</p>
          <p style="color: #666;">Your booking has been confirmed. Here are the details:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📋 Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.bookingStartDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.bookingEndDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${booking.bookingCompleted ? 'Completed' : 'Active'}</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL}/bookings" style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View My Bookings
          </a>
        </div>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };