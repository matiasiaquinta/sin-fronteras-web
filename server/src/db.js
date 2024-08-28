import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "sinfronteras-api",
        });
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};
