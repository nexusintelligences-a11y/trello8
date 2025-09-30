import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { Client as ObjectStorageClient } from "@replit/object-storage";
import { nanoid } from "nanoid";

const upload = multer({ storage: multer.memoryStorage() });

// Lazy initialization of object storage
let objectStorage: ObjectStorageClient | null = null;
function getObjectStorage() {
  if (!objectStorage) {
    try {
      objectStorage = new ObjectStorageClient();
    } catch (error) {
      console.warn("Object Storage not configured, file uploads will be disabled");
      return null;
    }
  }
  return objectStorage;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Boards
  app.get("/api/boards", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "userId required" });
      }
      const boards = await storage.getBoardsByUserId(userId);
      res.json(boards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boards" });
    }
  });

  app.get("/api/boards/:id", async (req, res) => {
    try {
      const board = await storage.getBoard(req.params.id);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
      res.json(board);
    } catch (error) {
      res.status(500).json({ message: "Error fetching board" });
    }
  });

  app.post("/api/boards", async (req, res) => {
    try {
      const board = await storage.createBoard(req.body);
      res.json(board);
    } catch (error) {
      res.status(500).json({ message: "Error creating board" });
    }
  });

  app.patch("/api/boards/:id", async (req, res) => {
    try {
      const board = await storage.updateBoard(req.params.id, req.body);
      res.json(board);
    } catch (error) {
      res.status(500).json({ message: "Error updating board" });
    }
  });

  // Lists
  app.get("/api/boards/:boardId/lists", async (req, res) => {
    try {
      const lists = await storage.getListsByBoardId(req.params.boardId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lists" });
    }
  });

  app.post("/api/lists", async (req, res) => {
    try {
      const list = await storage.createList(req.body);
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Error creating list" });
    }
  });

  app.patch("/api/lists/:id", async (req, res) => {
    try {
      const list = await storage.updateList(req.params.id, req.body);
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Error updating list" });
    }
  });

  app.delete("/api/lists/:id", async (req, res) => {
    try {
      await storage.deleteList(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting list" });
    }
  });

  // Cards
  app.get("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Error fetching card" });
    }
  });

  app.get("/api/lists/:listId/cards", async (req, res) => {
    try {
      const cards = await storage.getCardsByListId(req.params.listId);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cards" });
    }
  });

  app.post("/api/cards", async (req, res) => {
    try {
      const card = await storage.createCard(req.body);
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Error creating card" });
    }
  });

  app.patch("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.updateCard(req.params.id, req.body);
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Error updating card" });
    }
  });

  app.delete("/api/cards/:id", async (req, res) => {
    try {
      await storage.deleteCard(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting card" });
    }
  });

  // Attachments with Replit Object Storage
  app.get("/api/cards/:cardId/attachments", async (req, res) => {
    try {
      const attachments = await storage.getAttachmentsByCardId(req.params.cardId);
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching attachments" });
    }
  });

  app.post("/api/cards/:cardId/attachments/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const objStorage = getObjectStorage();
      if (!objStorage) {
        return res.status(503).json({ message: "File storage not configured" });
      }

      const fileId = nanoid();
      const fileName = `${fileId}-${req.file.originalname}`;
      
      // Upload to Replit Object Storage
      await objStorage.uploadFromBytes(fileName, req.file.buffer);

      // Get the URL (in Replit, files are accessible via the object storage)
      const fileUrl = `/api/files/${fileName}`;

      const attachment = await storage.createAttachment({
        cardId: req.params.cardId,
        name: req.file.originalname,
        url: fileUrl,
        type: 'file',
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.body.userId || 'anonymous',
      });

      res.json(attachment);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  app.post("/api/cards/:cardId/attachments/link", async (req, res) => {
    try {
      const attachment = await storage.createAttachment({
        cardId: req.params.cardId,
        name: req.body.name,
        url: req.body.url,
        type: 'link',
        mimeType: null,
        size: null,
        uploadedBy: req.body.userId || 'anonymous',
      });
      res.json(attachment);
    } catch (error) {
      res.status(500).json({ message: "Error adding link" });
    }
  });

  app.delete("/api/attachments/:id", async (req, res) => {
    try {
      await storage.deleteAttachment(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting attachment" });
    }
  });

  // Serve files from Object Storage
  app.get("/api/files/:fileName", async (req, res) => {
    try {
      const objStorage = getObjectStorage();
      if (!objStorage) {
        return res.status(503).json({ message: "File storage not configured" });
      }

      const result = await objStorage.downloadAsBytes(req.params.fileName);
      if (result.ok) {
        res.send(result.value);
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (error) {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Votes
  app.get("/api/cards/:cardId/votes", async (req, res) => {
    try {
      const votes = await storage.getVotesByCardId(req.params.cardId);
      res.json(votes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching votes" });
    }
  });

  app.post("/api/cards/:cardId/votes", async (req, res) => {
    try {
      const vote = await storage.createVote({
        cardId: req.params.cardId,
        userId: req.body.userId,
        voteType: req.body.voteType,
      });
      res.json(vote);
    } catch (error) {
      res.status(500).json({ message: "Error creating vote" });
    }
  });

  app.delete("/api/cards/:cardId/votes/:userId", async (req, res) => {
    try {
      await storage.deleteVote(req.params.cardId, req.params.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting vote" });
    }
  });

  // Notifications
  app.get("/api/users/:userId/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUserId(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Error creating notification" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error marking notification as read" });
    }
  });

  // Templates
  app.get("/api/templates/cards", async (req, res) => {
    try {
      const templates = await storage.getCardTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching card templates" });
    }
  });

  app.get("/api/templates/boards", async (req, res) => {
    try {
      const templates = await storage.getBoardTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching board templates" });
    }
  });

  app.post("/api/templates/cards", async (req, res) => {
    try {
      const template = await storage.createCardTemplate(req.body);
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Error creating card template" });
    }
  });

  app.post("/api/templates/boards", async (req, res) => {
    try {
      const template = await storage.createBoardTemplate(req.body);
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Error creating board template" });
    }
  });

  // Labels
  app.get("/api/boards/:boardId/labels", async (req, res) => {
    try {
      const labels = await storage.getLabelsByBoardId(req.params.boardId);
      res.json(labels);
    } catch (error) {
      console.error("Error fetching labels:", error);
      res.status(500).json({ message: "Error fetching labels" });
    }
  });

  app.post("/api/boards/:boardId/labels", async (req, res) => {
    try {
      const label = await storage.createLabel({
        boardId: req.params.boardId,
        name: req.body.name,
        color: req.body.color,
      });
      res.json(label);
    } catch (error) {
      res.status(500).json({ message: "Error creating label" });
    }
  });

  app.patch("/api/labels/:id", async (req, res) => {
    try {
      const label = await storage.updateLabel(req.params.id, req.body);
      res.json(label);
    } catch (error) {
      res.status(500).json({ message: "Error updating label" });
    }
  });

  app.delete("/api/labels/:id", async (req, res) => {
    try {
      await storage.deleteLabel(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting label" });
    }
  });

  // Card Labels
  app.get("/api/cards/:cardId/labels", async (req, res) => {
    try {
      const labels = await storage.getCardLabels(req.params.cardId);
      res.json(labels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching card labels" });
    }
  });

  app.post("/api/cards/:cardId/labels/:labelId", async (req, res) => {
    try {
      const cardLabel = await storage.addCardLabel({
        cardId: req.params.cardId,
        labelId: req.params.labelId,
      });
      res.json(cardLabel);
    } catch (error) {
      res.status(500).json({ message: "Error adding label to card" });
    }
  });

  app.delete("/api/cards/:cardId/labels/:labelId", async (req, res) => {
    try {
      await storage.removeCardLabel(req.params.cardId, req.params.labelId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error removing label from card" });
    }
  });

  // Board Members (Permissions)
  app.get("/api/boards/:boardId/members", async (req, res) => {
    try {
      const members = await storage.getBoardMembers(req.params.boardId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching board members" });
    }
  });

  app.post("/api/boards/:boardId/members", async (req, res) => {
    try {
      const member = await storage.addBoardMember({
        boardId: req.params.boardId,
        userId: req.body.userId,
        role: req.body.role || "member",
      });
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Error adding board member" });
    }
  });

  app.patch("/api/boards/:boardId/members/:memberId", async (req, res) => {
    try {
      const member = await storage.updateBoardMemberRole(req.params.memberId, req.body.role);
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Error updating member role" });
    }
  });

  app.delete("/api/boards/:boardId/members/:memberId", async (req, res) => {
    try {
      await storage.removeBoardMember(req.params.memberId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error removing board member" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
