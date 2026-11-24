import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import {loginUser, registerUser} from "../services/auth.service.js"
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) return res.status(404).json({message:"name is required"})
        if (!email) return res.status(404).json({message:"email is required"})
        if (!password) return res.status(404).json({message:"password is required"})

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const payload = {
            name,
            email,
            password
        }
        const success =await registerUser(payload)
        res.status(201).json({ message: 'User registered successfully', user: success });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while registering user', error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
      const user =  await loginUser(email)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = user.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,               
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 24 * 60 * 60 * 1000    
        });

        return res.status(200).json({ 
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({message: err.message,});
    }
};