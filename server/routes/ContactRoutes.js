import express from "express";
import { isAuthenticated } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactForDMList, searchContacts } from "../controllers/ContactController.js";

const router = express.Router();

router.post('/search',isAuthenticated,searchContacts);
router.get('/get-contact-for-dm',isAuthenticated,getContactForDMList);
router.get('/get-all-contacts',isAuthenticated,getAllContacts);

export default router;