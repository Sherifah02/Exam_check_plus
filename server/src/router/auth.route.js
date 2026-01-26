import express from "express";
import {
  adminLogin,
  checkStudentStatus,
  generateTempPassword,
  getAuthenticated,
  login,
  logout,
  verifyAndCreateUser,
} from "../controller/auth.controller.js";
import { verifySession } from "../utils/session.js";

const authRoute = express.Router();
authRoute.post("/verify-student", checkStudentStatus);
authRoute.post("/verify-and-create-account", verifyAndCreateUser);
authRoute.post("/generate-temp-password", generateTempPassword)
authRoute.post("/user-login", login)
authRoute.post("/admin-login", adminLogin)
authRoute.post("/logout", verifySession, logout)
authRoute.get("/get-authenticated-user", verifySession, getAuthenticated)
export default authRoute;
