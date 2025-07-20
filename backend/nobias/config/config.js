module.exports = {
  auth: {
    jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
    jwtExpiresIn: process.env.JWT_EXPIRE || "7d",
    otpExpiry: 5 * 60 * 1000,
  },
  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-email-password",
    from: process.env.EMAIL_FROM || "noreply@nobias.com",
    templates: {
      otp: {
        subject: "Your NoBias Verification OTP",
        text: `Your OTP for NoBias verification is: {otp}\nThis OTP will expire in 10 minutes.`,
        html: `...`,
      },
    },
  },
};
