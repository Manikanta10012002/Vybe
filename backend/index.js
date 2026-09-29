import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import loopRouter from "./routes/loop.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";

import { app, server } from "./socket.js";

dotenv.config();

console.log(
  "MONGO_URL check:",
  process.env.MONGO_URL
    ? process.env.MONGO_URL.substring(0, 15)
    : "MISSING"
);

const PORT = process.env.PORT || 8000;

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://vybe-1-znuj.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS Origin:", origin);

    // Allow requests with no origin
    // Example: Postman, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);
    return callback(new Error(`CORS blocked: ${origin}`));
  },

  credentials: true,

  methods: [
    "GET",
    "HEAD",
    "PUT",
    "PATCH",
    "POST",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
};

// Apply CORS before routes
app.use(cors(corsOptions));

// Handle browser preflight requests
app.options("*", cors(corsOptions));

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({
  extended: true
}));

// ===============================
// TEST API
// ===============================

app.get("/api/test-cors", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working correctly",
    origin: req.headers.origin || "No origin"
  });
});

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

app.use("/api/post", postRouter);

app.use("/api/loop", loopRouter);

app.use("/api/story", storyRouter);

app.use("/api/message", messageRouter);

// ===============================
// START SERVER
// ===============================

server.listen(PORT, async () => {
  try {
    await connectDB();

    console.log(`✅ Server is running on port ${PORT}`);
    console.log("✅ Allowed CORS origins:");
    console.log(allowedOrigins);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});