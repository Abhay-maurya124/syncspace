import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

},
    { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET || 'makingthebestoutfit',
        { expiresIn: '24h' }
    );
    return token;
};

export const User = mongoose.model('User', userSchema, 'users');
