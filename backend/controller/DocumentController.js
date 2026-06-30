import { Document } from "../models/DocumentModel.js";
import { WorkSpace } from "../models/WorkSpacemodel.js";

export const createDocument = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Document title is required" });
        }

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(
            (m) => m.userId.toString() === req.user.id.toString()
        );
        if (!isMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this workspace" });
        }

        const newDocument = new Document({
            title,
            content: content || "",
            workspaceId,
            createdBy: req.user.id
        });

        await newDocument.save();
        return res.status(201).json({ message: "Document created successfully", document: newDocument });

    } catch (error) {
        return res.status(500).json({ message: "Error creating document", error: error.message });
    }
};
export const getWorkspaceDocuments = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(
            (m) => m.userId.toString() === req.user.id.toString()
        );
        if (!isMember) {
            return res.status(403).json({ message: "Forbidden: You are not a member of this workspace" });
        }

        const documents = await Document.find({ workspaceId }).populate('createdBy', 'name email');
        return res.status(200).json({ documents });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching documents", error: error.message });
    }
};
export const updateDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { title, content } = req.body;

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const workspace = await WorkSpace.findById(document.workspaceId);
        const isMember = workspace.members.some((m) => m.userId.toString() === req.user.id.toString());
        if (!isMember) {
            return res.status(403).json({ message: "Forbidden: You don't have access to this workspace" });
        }

        if (title) document.title = title;
        if (content !== undefined) document.content = content;

        await document.save();
        return res.status(200).json({ message: "Document updated successfully", document });
    } catch (error) {
        return res.status(500).json({ message: "Error updating document", error: error.message });
    }
};
export const deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        const workspace = await WorkSpace.findById(document.workspaceId);
        const isMember = workspace.members.some((m) => m.userId.toString() === req.user.id.toString());
        if (!isMember) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await Document.findByIdAndDelete(documentId);
        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting document", error: error.message });
    }
};