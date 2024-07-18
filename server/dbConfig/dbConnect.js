import mongoose from "mongoose";

const dbConnection=async()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log("Mongodb Connected")
    } catch (error) {
        console.log("Failed to connect" +error.message);   
    }
}

export default dbConnection;