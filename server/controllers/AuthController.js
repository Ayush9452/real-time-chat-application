import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync} from "fs";

const maxAge = 3*24*60*60*1000;

const createToken = (email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{
        expiresIn: maxAge,
    })
}

export const signup = async (req,res,next) =>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).send("Email and Password are required!");
        }
        const user = await User.create({email,password});
        res.cookie("jwt", createToken(email,user.id),{
            maxAge,
            secure: true,
            sameSite: "None",
        })

        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const login = async (req,res,next)=>{
    try {
        const {email,password} = req.body;
        if(!email.length || !password.length){
            return res.status(400).send("Email and Password are required!");
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send("Invalid Email or Password!");
        }
        const isPasswordMatch = await compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).send("Invalid Email or Password!");
        }

        res.cookie("jwt", createToken(email,user.id),{
            maxAge,
            secure: true,
            sameSite: "None",
        })

        return res.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName: user.firstName,
                lastName:user.lastName,
                image:user.image,
                color: user.color,
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
}

export const getUserInfo = async (req,res,next)=>{
    try {
        const user = await User.findById(req.userId);
        if(!user){
            return req.status(404).send("User with given id not found.")
        }
    
        return res.status(200).json({
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName: user.firstName,
                lastName:user.lastName,
                image:user.image,
                color: user.color,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
}

export const updateProfile = async (req,res,next)=>{
    try {
        const {firstName,lastName,color} = req.body;
        if(!firstName || !lastName || color === undefined){
            return res.status(400).send("All fields are required!");
        }

        const newDate = {
            firstName,
            lastName,
            color,
            profileSetup: true
        }

        const user = await User.findByIdAndUpdate(req.userId,newDate,{
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        return res.status(200).json({
            id:user.id,
            email:user.email,
            profileSetup:user.profileSetup,
            firstName: user.firstName,
            lastName:user.lastName,
            image:user.image,
            color: user.color,
    });
    } catch (error) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
}


export const addProfileImage = async (req,res,next)=>{
    try {
        if(!req.file){
            return res.status(400).seind("FIle is required!");
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser = await User.findByIdAndUpdate(req.userId,{image: fileName},
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        )

        return res.status(200).json({
            image:updatedUser.image,
    });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

export const removeProfileImage = async (req,res,next)=>{
    try {

        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).send("user not found!");
        }

        if(user.image){
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();

        return res.status(200).send("Profile image removed successfully.");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}


export const logOut = async (req,res,next)=>{
    try {

        res.cookie("jwt","",{maxAge:1,secure:true,sameSite:"none"})

        return res.status(200).send("Logged out successfully.");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}