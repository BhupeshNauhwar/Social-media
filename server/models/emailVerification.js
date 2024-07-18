import mongoose from "mongoose";

const emailVerifiactionSchema=Schema({
    userId:String,
    token:String,
    createdAt: Date,
    expiresAt:Date
});
const Verification=mongoose.model("Verification",emailVerifiactionSchema);

export default Verification;