import FriendRequest from '../models/friendRequest.js'
import mongoose from 'mongoose';
import { compareString, createJWT, hashString } from "../utils/index.js";
import Users from "../models/userModel.js";
import Verification from "../models/emailVerification.js";
import { resetPassswordLink } from "../utils/sendEmail.js";
import PasswordReset from '../models/passwordReset.js'
import { request } from 'express';

export const verifyEmail = async (req, res) => {
    const { userId, token } = req.params;

    try {
        const result = await Verification.findOne({ userId });

        if (result) {
            const { expiresAt, token: hashedToken } = result;

            // token has expired
            if (expiresAt < Date.now()) {
                await Verification.findOneAndDelete({ userId })
                    .then(() => {
                        Users.findOneAndDelete({ _id: userId })
                            .then(() => {
                                const message = "Verification token expired";
                                res.redirect(`/users/verified?status=error&message=${message}`);
                            })
                            .catch((err) => {
                                res.redirect('/users/verified?status=error&message=');
                            });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        res.redirect('/users/verified?message=');
                    });

            } else {
                // token valid
                compareString(token, hashedToken)
                    .then((isMatch) => {
                        if (isMatch) {
                            Users.findOneAndUpdate({ _id: userId }, { verified: true })
                                .then(() => {
                                    Verification.findOneAndDelete({ userId })
                                        .then( () => {
                                            const message = "Email verified successfully";
                                            res.redirect(`/users/verified?status=success&message=${message}`);
                                        });
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                    const message = "Verification failed or invalid token";
                                    res.redirect(`/users/verified?status=error&message=${message}`);
                                });

                        } else {
                            // invalid token 
                            const message = "Verification failed or invalid token";
                            res.redirect(`/users/verified?status=error&message=${message}`);
                        }
                    })
                    .catch((error) => {
                        console.log(error.message);
                        res.redirect('/users/verified?message=');
                    });
            }
        } else {
            const message = "Invalid verification link";
            res.redirect(`/users/verified?status=error&message=${message}`);
        }
    } catch (error) {
        console.log(error);
        res.redirect('/users/verified?message=');
    }
}
export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "Email Address Not Found"
            });
        }
        await PasswordReset.findOneAndDelete({ userId: user._id });
        const existingRequest = await PasswordReset.findOne({ email });
        if (existingRequest) {
            if (existingRequest.expiresAt > Date.now()) {
                return res.status(201).json({
                    status: "PENDING",
                    message: "Already sent link for reset password"
                });
            }
            await PasswordReset.findOneAndDelete({ email });
        }

        await resetPassswordLink(user, res);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}
export const resetPassword = async (req, res) => {
    const { userId, token } = req.params;
    console.log(req.params)
    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.redirect(`/users/resetpassword?type=reset&status=error`);
        }
        console.log(user)
        const resetRequest = await PasswordReset.findOne({ userId });
        if (!resetRequest) {
            return res.redirect(`/users/resetpassword?status=error`);
        }
        console.log(userId)
        const { expiresAt, token: resetToken } = resetRequest;

        if (expiresAt < Date.now()) {
            return res.redirect(`/users/resetpassword?status=error`);
        } else {
            const isMatch = await compareString(token, resetToken);
            if (!isMatch) {
                return res.redirect(`/users/resetpassword?status=error`);
            } else {
                return res.redirect(`/users/resetpassword?type=reset&id=${userId}`);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        console.log(`Received userId: ${userId}`);
        console.log(`Received password: ${password}`);

        const hashedPassword = await hashString(password);

        
        const user = await Users.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        console.log(`User after update: ${user}`);

        if (user) {
            await PasswordReset.findOneAndDelete({ userId });

            return res.redirect('/users/password-changed');
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res, next) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Request Params:', req.params);

        const { userId } = req.body.user;
        const { id } = req.params;

        const user = await Users.findById(id ?? userId).populate({
            path: "friends",
            select: "-password",
        });

        if (!user) {
            return res.status(404).send({ // Changed status to 404 for "User Not Found"
                message: "User Not Found",
                success: false
            });
        }

        user.password = undefined;
        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "auth error",
            success: false,
            error: error.message // Corrected to reference 'error'
        });
    }
};

export const updateUser=async(req,res,next)=>{
    try {
        const {firstName,lastName,location, profileUrl, profession}=req.body;

        if(!(firstName || lastName ||  profession || location || profileUrl) ){
            next("Please provide all required f nields");
            return;
        }
        const {userId}=req.body.user;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const updateUser ={
            firstName,
            lastName,
            location,
            profession,
            profileUrl,
            _id:userId,
        };
        const user=await Users.findByIdAndUpdate(userId,updateUser,{new:true
        })
        await user.populate({path:"friends",select:"-password"});
        const token=createJWT(user?._id);

        user.password=undefined;

        res.status(200).json({
            success:true,
            message:"User Updated Successfully",
            user,
            token,
        })
    } catch (error) {
        console.log(error.message);
        res.status(404).json({message:error.message});
    }
}


export const friendRequest=async(req,res,next)=>{
    try {
        const {userId}=req.body.user;
        const {requestTo}=req.body;

        const requestExist=await FriendRequest.findOne({
            requestFrom:userId,
            requestTo,
        })
        if (requestExist) {
            next("Friend Request Already sent");
            return;
        }
        const accountExist=await FriendRequest.findOne({
            requestFrom:requestTo,
            requestTo:userId,
        })

        if (accountExist) {
            next("Friend Request already sent");
            return;
        }

        const newRes=await FriendRequest.create({
            requestTo,
            requestFrom:userId,
        })

        res.status(201).json({
            success:true,
            message:"Friend Request sent Succesfully",
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"auth error",
            success:false,
            error:error.message,
        })
    }
} 

export const getFriendRequest=async(req,res,next)=>{
    try {
        const {userId}=req.body.user;
        const request=await FriendRequest.find({
            requestTo:userId,
            requestStatus:"Pending"
        })
        .populate({
            path:"requestFrom",
            select:"firstName lastName profileUrl,profession -password",
        })
        .limit(10)
        .sort({
            _id:-1
        })
        res.status(200).json({
            success:true,
            data:request,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"auth error",
            success:false,
            error:error.message
        })
    }
}

export const acceptRequest= async(req,res,next)=>{
    try {
        const id=req.body.user.userId;
        console.log(req.body);
        const {rid,status}=req.body;

        const requestExist=await FriendRequest.findById(rid);

        if (!requestExist) {
            next("No Friend Request Found");
            return;
        }
        const newRes=await FriendRequest.findByIdAndUpdate({_id:rid},
          {requestStatus:status}  
        )
        if (status ==="Accepted") {
            const user=await Users.findById(id);

            user.friends.push(newRes?.requestFrom);
            await user.save();

            const friend=await Users.findById(newRes?.requestFrom);
            friend.friends.push(newRes?.requestTo);

            await friend.save();
        }
        res.status(201).json({
            success:true,
            message:"Friends Request "+status,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"auth error",
            success:false,
            error:error.message
        })
    }
}


export const profileViews=async(req,res,next)=>{
    
    try {
        console.log(req.body);
        const {userId}=req.body.user;
        const {id}=req.body;
        
    const user=await Users.findById(id);
    
    user.views.push(userId);
    await user.save();

    res.status(201).json({
        success:true,
        message:"Successfully",
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"auth error",
            success:false,
            error:error.message
        })
    }
}
export const suggestedFriends=async(req,res)=>{
    try {
        const {userId}=req.body.user;
    
        let queryObject={};
        
    
        queryObject._id={$ne:userId};
    
        queryObject.friends={$nin:userId};

        let queryResult=Users.find(queryObject).limit(15)
        .select("firstName,lastName,profileUrl profession -password");

        const suggestedFriends=await queryResult;
        res.status(200).json({
            success:true,
            data:suggestedFriends,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"auth error",
            success:false,
            error:error.message
        })
    }
}