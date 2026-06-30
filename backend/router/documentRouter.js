import express from "express";
import { createDocument, getWorkspaceDocuments, updateDocument, deleteDocument } from "../controller/DocumentController.js";
import { authenticateToken } from "../middleware/Authmiddleware.js";

export const documentRouter = express.Router();

documentRouter.post('/:workspaceId/documents', authenticateToken, createDocument);
documentRouter.get('/:workspaceId/documents', authenticateToken, getWorkspaceDocuments);
documentRouter.put('/:documentId', authenticateToken, updateDocument);
documentRouter.delete('/:documentId', authenticateToken, deleteDocument);