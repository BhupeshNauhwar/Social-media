import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { hashString } from './index.js';
import Verification from '../models/emailVerification.js';
import PasswordReset from '../models/passwordReset.js';

dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587, 
    secure: false, 
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_PASSWORD.trim(),
    },
});

export const sendVerificationEmail = async (user, res) => {
    const { _id, email, lastName } = user;
    const token = _id + uuidv4();
    const link = APP_URL + "users/verify/" + _id + "/"+ token; 

    const mailOptions = {
        from:AUTH_EMAIL,
        to:email,
        subject:"Email Verification",
        html: `
            <div style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f9f9f9;'>
                <h1 style='color: rgb(8, 56, 188);'>Please verify your email address</h1>
                <hr>
                <h4>Hi ${lastName},</h4>
                <p>Please verify your email address so we can know that it's really you.</p>
                <p>This link <b>expires in 1 hour</b></p>
                <a href="${link}"
                   style='color: #fff; padding: 14px; text-decoration: none; background-color: #000;'>
                   Verify Email Address
                </a>
                <div style='margin-top: 20px;'>
                    <h5>Best Regards</h5>
                    <h5>SocialMedia</h5>
                </div>
            </div>
        `,
    };

    try {
        const hashedToken = await hashString(token);
        
            const newVerifiedEmail = await Verification.create({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000, // 1 hour
        });

        if (newVerifiedEmail) {
            transporter.sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "PENDING",
                        message: "Verification email has been sent to your account. Check your email."
                    });
                })
                .catch((err) => {
                    console.error('Email send error:', err.message);
                    res.status(500).json({ message: "Failed to send email. Please try again later." });
                });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}



export const resetPassswordLink = async (user, res) => {
    const { _id, email} = user;
    const token = _id + uuidv4();
    const link = APP_URL +  "users/reset-password/" + _id + "/" +token;

    const mailOptions = {
        from:AUTH_EMAIL,
        to:email,
        subject:"Password Reset",
        html: `
            <div style='font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f9f9f9; padding: 20px;'>
    <h1 style='color: rgb(8, 56, 188);'>Reset Your Password</h1>
    
    <p>We received a request to reset your password. Click the link below to set a new password:</p>
    <a href="${link}" 
       style='display: inline-block; color: #fff; padding: 10px 20px; text-decoration: none; background-color: #000;'>
       Reset Password
    </a> 
    <p style='margin-top: 20px;'>This link expores in 10 minutes.</p>
</div>`,
    };

    try {
        const hashedToken = await hashString(token);
        
            const resetEmail = await PasswordReset.create({
            userId: _id,
            token: hashedToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000, 
        });

        if (resetEmail) {
            transporter.sendMail(mailOptions)
                .then(() => {
                    res.status(201).send({
                        success: "PENDING",
                        message: "Reset Link sent to your email."
                    });
                })
                .catch((err) => {
                    console.error('Email send error:', err.message);
                    res.status(500).json({ message: "Failed to send email. Please try again later." });
                });  
        }
    } catch (error) {
        console.error('Error:', error.message);
          res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
}
