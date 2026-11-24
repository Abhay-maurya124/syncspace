import express from "express";
import dotenv from "dotenv";
dotenv.config();

import {router} from "./router/AuthRouter.js";
import {connectDB} from "./config/db.js";

import { workspaceRouter } from "./router/WorkSpace.js";
import cookieParser from "cookie-parser";
import { documentRouter } from "./router/documentRouter.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', router);
app.use('/api/v1/workspace', workspaceRouter);
app.use('/api/v2/document', documentRouter);
connectDB();
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})