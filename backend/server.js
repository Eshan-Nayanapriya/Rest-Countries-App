require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const favoritesRoutes = require("./routes/favorites");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    // Allow both development and production frontends
    origin: [
      "http://localhost:5173",
      "https://rest-countries-app-new.vercel.app",
      "https://worldview.vercel.app",
      "https://worldview-app.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);

// Check required environment variables
const requiredEnvVars = ["MONGODB_URI", "DB_NAME", "JWT_SECRET", "JWT_EXPIRE"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

// Add a root route handler
app.get("/", (req, res) => {
  res.json({ message: "REST Countries API Backend is running!" });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  // MongoDB connection for local development
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("MongoDB connected");
      app.listen(5000, () => console.log("🚀 Server is running on port 5000"));
    })
    .catch((err) => {
      console.error("❌ Cannot start the server: ", err);
    });
} else {
  // For Vercel, just connect to MongoDB without listening on a port
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("MongoDB connected in production");
    })
    .catch((err) => {
      console.error("❌ Cannot connect to MongoDB: ", err);
    });
}

// Export for Vercel serverless function
module.exports = app;
