import express from "express";
import { isAuthenticated } from "../middlewares/AuthMiddleware.js";
import { createChannel, getAllChannels, getChannelMessages } from "../controllers/ChannelController.js";

const router = express.Router();

router.post("/create-channel",isAuthenticated,createChannel);
router.get("/get-all-channels",isAuthenticated,getAllChannels);
router.get("/get-channel-messages/:channelId",isAuthenticated,getChannelMessages);

export default router;