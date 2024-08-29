import express from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logOut } from "../controllers/AuthController.js";
import { isAuthenticated } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/profiles/" });

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", isAuthenticated, logOut);
router.get("/user-info", isAuthenticated, getUserInfo);
router.post("/update-profile", isAuthenticated, updateProfile);
router.post("/add-profile-image", isAuthenticated, upload.single("profile-image"), addProfileImage);
router.delete("/remove-profile-image", isAuthenticated, removeProfileImage);

export default router;