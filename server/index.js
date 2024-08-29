import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes.js"
import ContactRoutes from "./routes/ContactRoutes.js"
import MessageRoutes from "./routes/MessageRoutes.js"
import ChannelRoutes from "./routes/ChannelRoutes.js"
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const dataBaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))

app.use("/api/auth",AuthRoutes)
app.use("/api/contacts",ContactRoutes)
app.use("/api/messages",MessageRoutes)
app.use("/api/channel",ChannelRoutes)

mongoose.connect(dataBaseURL,{
    dbName: "ChatApp"
})
.then(()=>{console.log("DB Connection successful")})
.catch(err=>{console.log(err.message)});


const server = app.listen(PORT,()=>{
    console.log(`server is listing on ${PORT}`);
})

setupSocket(server);