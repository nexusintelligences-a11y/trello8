import { WebSocketServer, WebSocket } from "ws";
import { type Server } from "http";

export interface WebSocketMessage {
  type: "join" | "leave" | "update" | "presence" | "sync" | "notification";
  boardId?: string;
  userId?: string;
  userName?: string;
  data?: any;
  timestamp: number;
}

export interface ConnectedUser {
  id: string;
  name: string;
  avatar?: string;
  boardId: string;
  ws: WebSocket;
  lastSeen: number;
}

const connectedUsers = new Map<string, ConnectedUser>();
const boardUsers = new Map<string, Set<string>>();

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws"
  });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");
    
    let currentUser: ConnectedUser | null = null;

    ws.on("message", (message: string) => {
      try {
        const data: WebSocketMessage = JSON.parse(message.toString());
        
        switch (data.type) {
          case "join":
            handleUserJoin(ws, data);
            currentUser = connectedUsers.get(data.userId!) || null;
            break;
            
          case "leave":
            handleUserLeave(data);
            break;
            
          case "update":
            handleBoardUpdate(data);
            break;
            
          case "presence":
            handlePresenceUpdate(data);
            break;
            
          case "sync":
            handleSyncRequest(ws, data);
            break;
            
          case "notification":
            handleNotification(data);
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      if (currentUser) {
        handleUserLeave({
          type: "leave",
          userId: currentUser.id,
          boardId: currentUser.boardId,
          timestamp: Date.now()
        });
      }
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Send initial connection success
    ws.send(JSON.stringify({
      type: "connected",
      timestamp: Date.now()
    }));
  });

  // Heartbeat to detect disconnected clients
  setInterval(() => {
    const now = Date.now();
    connectedUsers.forEach((user, userId) => {
      if (now - user.lastSeen > 60000) { // 1 minute timeout
        handleUserLeave({
          type: "leave",
          userId: user.id,
          boardId: user.boardId,
          timestamp: now
        });
      }
    });
  }, 30000); // Check every 30 seconds

  console.log("WebSocket server initialized");
  return wss;
}

function handleUserJoin(ws: WebSocket, data: WebSocketMessage) {
  if (!data.userId || !data.boardId) return;

  const user: ConnectedUser = {
    id: data.userId,
    name: data.userName || "Unknown User",
    avatar: data.data?.avatar,
    boardId: data.boardId,
    ws,
    lastSeen: Date.now()
  };

  connectedUsers.set(data.userId, user);

  if (!boardUsers.has(data.boardId)) {
    boardUsers.set(data.boardId, new Set());
  }
  boardUsers.get(data.boardId)!.add(data.userId);

  // Notify other users in the board
  broadcastToBoardExcept(data.boardId, {
    type: "presence",
    userId: data.userId,
    userName: data.userName,
    data: { status: "joined", avatar: data.data?.avatar },
    timestamp: Date.now()
  }, data.userId);

  // Send current online users to the new user
  const onlineUsers = getBoardOnlineUsers(data.boardId);
  ws.send(JSON.stringify({
    type: "presence",
    data: { users: onlineUsers },
    timestamp: Date.now()
  }));

  console.log(`User ${data.userName} joined board ${data.boardId}`);
}

function handleUserLeave(data: WebSocketMessage) {
  if (!data.userId || !data.boardId) return;

  const user = connectedUsers.get(data.userId);
  if (user) {
    connectedUsers.delete(data.userId);
    
    const boardUserSet = boardUsers.get(data.boardId);
    if (boardUserSet) {
      boardUserSet.delete(data.userId);
      if (boardUserSet.size === 0) {
        boardUsers.delete(data.boardId);
      }
    }

    // Notify other users
    broadcastToBoardExcept(data.boardId, {
      type: "presence",
      userId: data.userId,
      userName: user.name,
      data: { status: "left" },
      timestamp: Date.now()
    }, data.userId);

    console.log(`User ${user.name} left board ${data.boardId}`);
  }
}

function handleBoardUpdate(data: WebSocketMessage) {
  if (!data.boardId) return;

  // Broadcast update to all users in the board except sender
  broadcastToBoardExcept(data.boardId, {
    type: "update",
    data: data.data,
    userId: data.userId,
    timestamp: Date.now()
  }, data.userId);

  console.log(`Board update in ${data.boardId}`);
}

function handlePresenceUpdate(data: WebSocketMessage) {
  if (!data.userId) return;

  const user = connectedUsers.get(data.userId);
  if (user) {
    user.lastSeen = Date.now();
    
    if (data.boardId) {
      broadcastToBoardExcept(data.boardId, {
        type: "presence",
        userId: data.userId,
        data: data.data,
        timestamp: Date.now()
      }, data.userId);
    }
  }
}

function handleSyncRequest(ws: WebSocket, data: WebSocketMessage) {
  // In a real app, fetch latest board data from database
  // For now, just acknowledge
  ws.send(JSON.stringify({
    type: "sync",
    data: { message: "Board is up to date" },
    timestamp: Date.now()
  }));
}

function handleNotification(data: WebSocketMessage) {
  if (!data.userId) return;

  const user = connectedUsers.get(data.userId);
  if (user && user.ws.readyState === WebSocket.OPEN) {
    user.ws.send(JSON.stringify({
      type: "notification",
      data: data.data,
      timestamp: Date.now()
    }));
  }
}

function broadcastToBoardExcept(boardId: string, message: WebSocketMessage, exceptUserId?: string) {
  const userIds = boardUsers.get(boardId);
  if (!userIds) return;

  const messageStr = JSON.stringify(message);
  
  userIds.forEach(userId => {
    if (userId === exceptUserId) return;
    
    const user = connectedUsers.get(userId);
    if (user && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(messageStr);
    }
  });
}

function getBoardOnlineUsers(boardId: string) {
  const userIds = boardUsers.get(boardId);
  if (!userIds) return [];

  const users: Array<{ id: string; name: string; avatar?: string }> = [];
  userIds.forEach(userId => {
    const user = connectedUsers.get(userId);
    if (user) {
      users.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar
      });
    }
  });

  return users;
}

// Helper to send notification to specific user
export function sendNotificationToUser(userId: string, notification: any) {
  const user = connectedUsers.get(userId);
  if (user && user.ws.readyState === WebSocket.OPEN) {
    user.ws.send(JSON.stringify({
      type: "notification",
      data: notification,
      timestamp: Date.now()
    }));
  }
}

// Helper to broadcast update to board
export function broadcastBoardUpdate(boardId: string, update: any, senderId?: string) {
  broadcastToBoardExcept(boardId, {
    type: "update",
    data: update,
    userId: senderId,
    timestamp: Date.now()
  }, senderId);
}
