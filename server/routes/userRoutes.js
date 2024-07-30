import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { verifyEmail,requestPasswordReset ,resetPassword,changePassword,getUser,updateUser, friendRequest,acceptRequest,getFriendRequest,profileViews,suggestedFriends } from '../controller/userController.js';
import userAuth from '../middleware/authMiddleware.js';
const router=express.Router();
const __dirname=path.resolve(path.dirname(""));
//verify
router.get('/verify/:userId/:token',verifyEmail);
router.get("/verified",(req,res)=>{
    res.sendFile(path.join(__dirname, "./views/verify.html"));
})
//resetpassword
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/request-passwordreset",requestPasswordReset)
router.post("/reset-password",changePassword);
// user update
router.post('/get-user/:id?',userAuth,getUser);

router.put("/update-user",userAuth,updateUser)

//friend request 
router.post("/friend-request",userAuth,friendRequest);
router.post("/get-friend-request",userAuth,getFriendRequest);

// accept reject

router.post("/accept-request",userAuth,acceptRequest);

// views profile

router.post("/profile-view",userAuth,profileViews);

router.post("/suggested-friends",userAuth,suggestedFriends);



router.get("/resetpassword", (req,res)=>{
    res.sendFile(path.join(__dirname, "./views", "index.html"))
})
router.get('/password-changed', (req, res) => {
    res.sendFile(path.join(__dirname, './views/passwordChanged.html'));
});





export default router;
