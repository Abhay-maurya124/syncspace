
import express from "express";
import { createUser, login } from "../controller/AuthController.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
export const router = express.Router();

router.post('/createuser', createUser);
router.post('/login', login);
