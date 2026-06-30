import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
    workspacename: {
        type: String,
        required: true,
        trim: true
    },
    workspaceownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            role: {
                type: String,
                enum: ['Admin', 'Editor', 'Viewer'],
                default: 'Editor'
            }
        }
    ]
}, { timestamps: true }); 

workspaceSchema.index({ "members.userId": 1 });

export const WorkSpace = mongoose.model('WorkSpace', workspaceSchema);