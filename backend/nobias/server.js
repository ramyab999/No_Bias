const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
const connectDB = require("./config/db");
connectDB();

// ✅ Initialize Express app
const app = express();

// ✅ Allowed CORS origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.1.44:3000",
  "http://192.168.1.36:3000",
  "http://192.168.1.37:3000",
  "http://192.168.1.110:3000",
  "http://192.168.1.49:3000",
  "http://192.168.1.5:3000",
  undefined,
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes imports
const authRoutes = require("./routes/authRoutes");
const locationRoutes = require("./routes/locationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const publicRoutes = require("./routes/publicRoutes");
const discriminationTypeRoutes = require("./routes/discriminationTypeRoutes");

// ✅ API route usage
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // includes /discrimination-types for admin
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/admin/locations", locationRoutes); // if admin-specific location logic exists

// ✅ Public discrimination types route (if needed outside admin)
app.use("/api/discrimination-types", discriminationTypeRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
const HOST = "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
});
