
import express from "express";
import { createworkspace, addMember,getAllWorkspaces ,getWorkspaceById} from "../controller/WorkSpacecontroller.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
export const workspaceRouter = express.Router();

workspaceRouter.post('/createworkspace',authenticateToken, createworkspace);
workspaceRouter.post('/addmember/:workspaceId',authenticateToken, addMember);
workspaceRouter.get('/getAllWorkspaces', authenticateToken, getAllWorkspaces);
workspaceRouter.get('/:workspaceId', authenticateToken, getWorkspaceById);