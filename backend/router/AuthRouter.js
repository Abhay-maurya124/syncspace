
import express from "express";
import { register, login } from "../controller/AuthController.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
export const router = express.Router();

router.post('/register', register);
router.post('/login', login);
