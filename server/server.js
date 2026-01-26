import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connect_to_database } from "./src/db/db.connect.js";
import authRoute from "./src/router/auth.route.js";
import resultRoute from "./src/router/result.route.js";
import departmentRoute from "./src/router/department.route.js";
import levelRoute from "./src/router/level.route.js";
import sessionRoute from "./src/router/session.route.js";
import semesterRoute from "./src/router/semester.route.js";
import venueRoute from "./src/router/venue.route.js";

dotenv.config();

if (!process.env.PORT) throw new Error("PORT not set in .env");
if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL not set in .env");

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Server is active");
});
app.get("/health", (req, res) => {
  res.json({ status: "OK", time: new Date() });
});
app.use("/api/auth", authRoute)
app.use("/api/results", resultRoute)
app.use("/api/departments", departmentRoute)
app.use("/api/levels", levelRoute)
app.use("/api/sessions", sessionRoute)
app.use("/api/semester", semesterRoute)
app.use("/api/venue", venueRoute)
const startServer = async () => {
  console.log("🔄 Starting server...");
  try {
    await connect_to_database();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} 🌐`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};
startServer();
