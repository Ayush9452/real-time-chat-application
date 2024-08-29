import mongoose from "mongoose";
import Channel from "../models/channelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req,res,next)=>{
    try {
        const {name,members} = req.body;
        const userId = new mongoose.Types.ObjectId(req.userId)
        
        const admin = await User.findById(userId);
        
        if(!admin){
            return res.status(404).send('Admin user not found');
        }
        
        const validMember = await User.find({_id: {$in: members}});

        if(validMember.length !== members.length){
            return res.status(400).send("Some members are not valid Users.");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId
        })

        await newChannel.save();
        return res.status(201).send({channel: newChannel});

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

export const getChannelMessages = async (req,res,next)=>{
    try {
        console.log("called");
        const {channelId} = req.params;
        console.log(channelId)
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate:{
                path:"sender",
                select: "firstName lastName _id image email color"
            }
        })

        if(!channel){
            return res.status(404).send("Channel not found");
        }

        return res.status(200).json({messages:channel.messages})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal server error");
    }
}

export const getAllChannels = async (req,res,next)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)
        const channels = await Channel.find({
            $or:[{admin:userId},{members:userId}],
        }).sort({updatedAt: -1})

        return res.status(200).send({channels})
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal server error");
    }
}