import {connectDB} from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
connectDB();

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})