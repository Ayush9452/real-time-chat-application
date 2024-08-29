import express from "express";
import { isAuthenticated } from "../middlewares/AuthMiddleware.js";
import { getAllMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";

const router = express.Router();

const upload = multer({dest: "uploads/files"});
router.post('/get-messages',isAuthenticated,getAllMessages);
router.post('/upload-file',isAuthenticated,upload.single("file"),uploadFile);

export default router;