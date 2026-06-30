import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while registering user', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
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
    } catch (error) {
        res.status(500).json({message:error.message });
    }
};