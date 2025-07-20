const nodemailer = require("nodemailer");

// Create transporter once and reuse
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail or Mailtrap user
    pass: process.env.EMAIL_PASS, // App password or Mailtrap password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Sends an OTP email and logs OTP in terminal.
 * @param {string} to - Recipient's email
 * @param {number|string} otp - One-time password
 */
exports.sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"NoBias" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP sent to ${to}: ${otp}`); // ✅ Output to terminal
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw new Error("Email sending failed");
  }
};
