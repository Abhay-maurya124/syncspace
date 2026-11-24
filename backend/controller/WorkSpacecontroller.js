import { WorkSpace } from "../models/WorkSpacemodel.js"
import { User } from "../models/User.js";

export const createworkspace = async (req, res) => {
    try {
        const { workspacename } = req.body;
        if (!workspacename) {
            return res.status(400).json({ message: "Workspace name is required" });
        }

        const newWorkspace = new WorkSpace({
            workspacename,
            workspaceownerId: req.user.id,
            members: [
                {
                    userId: req.user.id,
                    role: 'Admin'
                }
            ]
        });

        await newWorkspace.save();
        return res.status(201).json({ message: "Workspace created successfully", workspace: newWorkspace });

    } catch (error) {
        return res.status(500).json({ message: "Error creating workspace", error: error.message });
    }
};
export const addMember = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const targetUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (!targetUser) {
            return res.status(404).json({ message: "User account not found" });
        }

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isAlreadyMember = workspace.members.some(
            (m) => m.userId.toString() === targetUser._id.toString()
        );
        if (isAlreadyMember) {
            return res.status(400).json({ message: "User is already a member of this workspace" });
        }
        workspace.members.push({
            userId: targetUser._id,
            role: role || 'Editor'
        });

        await workspace.save();

        return res.status(200).json({
            message: "Member added successfully",
            members: workspace.members
        });

    } catch (error) {
        return res.status(500).json({ message: "Error adding member", error: error.message });
    }
};
export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkSpace.find({
            "members.userId": req.user.id
        });
        return res.status(200).json({ workspaces });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching workspaces", error: error.message });
    }
};
export const getWorkspaceById = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await WorkSpace.findById(workspaceId)
            .populate('workspaceownerId', 'name email')
            .populate('members.userId', 'name email');

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(
            (m) => m.userId._id.toString() === req.user.id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this workspace" });
        }

        return res.status(200).json({ workspace });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching workspace details", error: error.message });
    }
};