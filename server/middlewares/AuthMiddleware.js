import jwt from "jsonwebtoken";

export const isAuthenticated = async (req,res,next) =>{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).send("User Not Authenticated!");
    }
    jwt.verify(token,process.env.JWT_KEY,async (err,payload)=>{
        if(err) return res.status(403).send("User token not Valid!")
        req.userId = payload.userId;
        next()
    });
}