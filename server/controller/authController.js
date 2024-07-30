import Users from '../models/userModel.js';
import { createJWT, hashString, compareString } from '../utils/index.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';


export const register=async(req,res,next)=>{
    const {firstName,lastName,email,password}=req.body;
    console.log('Register Request Body:', req.body);
    if(!firstName || !lastName || !email || !password){
        next("Provide Required fields");
        return;
    }
    try {
        const userExist=await Users.findOne({email});
        if(userExist){
            next("Email already exists")
            return;
        }
        
        const hashPassword=await hashString(password);
        console.log('Hashed Password:', hashPassword);
        const user=await Users.create({
            firstName,
            lastName,
            email,
            password:hashPassword
        });
        sendVerificationEmail(user,res);
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
};

export const login=async(req,res,next)=>{
     const {email,password}=req.body;
     try {
        if(!email || !password){
            next("Please provide credentials");
            return;

        }
        const user=await Users.findOne({email}).select("+password").populate({
            path:"friends",
            select:"firsName lastName, location, profileUrl, -password",
        });
        if(!user){
            next("Invalid email or passowrd");
            return;
        }
        if(!user?.verified){
            next("User email is not verified. Check your email account and verify your email");
            return;
        }
        const isMatch= await compareString(password,user?.password);
        
        if(!isMatch){
            next("Invalid email or passowrd");
            return;
        }
            user.password=undefined;
            const token =createJWT(user?._id);

        res.status(201).json({
                success:true,
                message:"Login succuessfully",
                user,
                token,
            })
     } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
     }
} 