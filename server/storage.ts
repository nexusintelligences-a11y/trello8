import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  User, 
  InsertUser, 
  Board, 
  List, 
  Card, 
  Attachment,
  Notification,
  CardVote,
  CardTemplate,
  BoardTemplate,
  Comment,
  Activity,
  BoardMember,
  Label,
  CardLabel
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Disable SSL verification for development (Replit environment)
// This fixes the "self-signed certificate in certificate chain" error
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql, schema });

export class DatabaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  // Board operations
  async getBoard(id: string): Promise<Board | undefined> {
    const [board] = await db.select().from(schema.boards).where(eq(schema.boards.id, id)).limit(1);
    return board;
  }

  async getBoardsByUserId(userId: string): Promise<Board[]> {
    try {
      const results = await db.select({ board: schema.boards })
        .from(schema.boards)
        .leftJoin(schema.boardMembers, eq(schema.boards.id, schema.boardMembers.boardId))
        .where(eq(schema.boardMembers.userId, userId));
      return results ? results.map(r => r.board) : [];
    } catch (error) {
      // Handle Neon empty result bug
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
        return [];
      }
      throw error;
    }
  }

  async createBoard(board: typeof schema.insertBoardSchema._type): Promise<Board> {
    const [newBoard] = await db.insert(schema.boards).values(board).returning();
    return newBoard;
  }

  async updateBoard(id: string, data: Partial<Board>): Promise<Board | undefined> {
    const [updated] = await db.update(schema.boards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.boards.id, id))
      .returning();
    return updated;
  }

  // Card operations
  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(schema.cards).where(eq(schema.cards.id, id)).limit(1);
    return card;
  }

  async getCardsByListId(listId: string): Promise<Card[]> {
    const result = await db.select().from(schema.cards).where(eq(schema.cards.listId, listId));
    return result || [];
  }

  async createCard(card: typeof schema.insertCardSchema._type): Promise<Card> {
    const [newCard] = await db.insert(schema.cards).values(card).returning();
    return newCard;
  }

  async updateCard(id: string, data: Partial<Card>): Promise<Card | undefined> {
    const [updated] = await db.update(schema.cards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.cards.id, id))
      .returning();
    return updated;
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(schema.cards).where(eq(schema.cards.id, id));
  }

  // List operations
  async getListsByBoardId(boardId: string): Promise<List[]> {
    const result = await db.select().from(schema.lists).where(eq(schema.lists.boardId, boardId));
    return result || [];
  }

  async createList(list: Omit<List, "id" | "createdAt">): Promise<List> {
    const [newList] = await db.insert(schema.lists).values(list).returning();
    return newList;
  }

  async updateList(id: string, data: Partial<List>): Promise<List | undefined> {
    const [updated] = await db.update(schema.lists)
      .set(data)
      .where(eq(schema.lists.id, id))
      .returning();
    return updated;
  }

  async deleteList(id: string): Promise<void> {
    await db.delete(schema.lists).where(eq(schema.lists.id, id));
  }

  // Attachment operations
  async getAttachmentsByCardId(cardId: string): Promise<Attachment[]> {
    const result = await db.select().from(schema.attachments).where(eq(schema.attachments.cardId, cardId));
    return result || [];
  }

  async createAttachment(attachment: Omit<Attachment, "id" | "uploadedAt">): Promise<Attachment> {
    const [newAttachment] = await db.insert(schema.attachments).values(attachment).returning();
    return newAttachment;
  }

  async deleteAttachment(id: string): Promise<void> {
    await db.delete(schema.attachments).where(eq(schema.attachments.id, id));
  }

  // Vote operations  
  async getVotesByCardId(cardId: string): Promise<CardVote[]> {
    const result = await db.select().from(schema.cardVotes).where(eq(schema.cardVotes.cardId, cardId));
    return result || [];
  }

  async createVote(vote: Omit<CardVote, "id" | "createdAt">): Promise<CardVote> {
    const [newVote] = await db.insert(schema.cardVotes).values(vote).returning();
    return newVote;
  }

  async deleteVote(cardId: string, userId: string): Promise<void> {
    await db.delete(schema.cardVotes)
      .where(
        and(
          eq(schema.cardVotes.cardId, cardId),
          eq(schema.cardVotes.userId, userId)
        )
      );
  }

  // Notification operations
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const result = await db.select().from(schema.notifications).where(eq(schema.notifications.userId, userId));
    return result || [];
  }

  async createNotification(notification: typeof schema.insertNotificationSchema._type): Promise<Notification> {
    const [newNotification] = await db.insert(schema.notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(schema.notifications)
      .set({ read: true })
      .where(eq(schema.notifications.id, id));
  }

  // Template operations
  async getCardTemplates(): Promise<CardTemplate[]> {
    const result = await db.select().from(schema.cardTemplates);
    return result || [];
  }

  async getBoardTemplates(): Promise<BoardTemplate[]> {
    const result = await db.select().from(schema.boardTemplates);
    return result || [];
  }

  async createCardTemplate(template: Omit<CardTemplate, "id" | "createdAt">): Promise<CardTemplate> {
    const [newTemplate] = await db.insert(schema.cardTemplates).values(template).returning();
    return newTemplate;
  }

  async createBoardTemplate(template: Omit<BoardTemplate, "id" | "createdAt">): Promise<BoardTemplate> {
    const [newTemplate] = await db.insert(schema.boardTemplates).values(template).returning();
    return newTemplate;
  }

  // Board member operations
  async getBoardMembers(boardId: string): Promise<BoardMember[]> {
    const result = await db.select().from(schema.boardMembers).where(eq(schema.boardMembers.boardId, boardId));
    return result || [];
  }

  async addBoardMember(member: Omit<BoardMember, "id" | "joinedAt">): Promise<BoardMember> {
    const [newMember] = await db.insert(schema.boardMembers).values(member).returning();
    return newMember;
  }

  async updateBoardMemberRole(id: string, role: string): Promise<BoardMember | undefined> {
    const [updated] = await db.update(schema.boardMembers)
      .set({ role })
      .where(eq(schema.boardMembers.id, id))
      .returning();
    return updated;
  }

  async removeBoardMember(id: string): Promise<void> {
    await db.delete(schema.boardMembers).where(eq(schema.boardMembers.id, id));
  }

  // Label operations
  async getLabelsByBoardId(boardId: string): Promise<Label[]> {
    try {
      const result = await db.select().from(schema.labels).where(eq(schema.labels.boardId, boardId));
      return result || [];
    } catch (error) {
      // Handle Neon empty result bug (Cannot read properties of null reading 'map')
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
        return [];
      }
      throw error;
    }
  }

  async createLabel(label: typeof schema.insertLabelSchema._type): Promise<Label> {
    const [newLabel] = await db.insert(schema.labels).values(label).returning();
    return newLabel;
  }

  async updateLabel(id: string, data: Partial<Label>): Promise<Label | undefined> {
    const [updated] = await db.update(schema.labels)
      .set(data)
      .where(eq(schema.labels.id, id))
      .returning();
    return updated;
  }

  async deleteLabel(id: string): Promise<void> {
    await db.delete(schema.labels).where(eq(schema.labels.id, id));
  }

  // Card-Label operations
  async getCardLabels(cardId: string): Promise<Label[]> {
    try {
      const results = await db.select({ label: schema.labels })
        .from(schema.cardLabels)
        .innerJoin(schema.labels, eq(schema.cardLabels.labelId, schema.labels.id))
        .where(eq(schema.cardLabels.cardId, cardId));
      return results ? results.map(r => r.label) : [];
    } catch (error) {
      // Handle Neon empty result bug
      if (error instanceof TypeError && error.message.includes("Cannot read properties of null")) {
        return [];
      }
      throw error;
    }
  }

  async addCardLabel(cardLabel: typeof schema.insertCardLabelSchema._type): Promise<CardLabel> {
    const [newCardLabel] = await db.insert(schema.cardLabels).values(cardLabel).returning();
    return newCardLabel;
  }

  async removeCardLabel(cardId: string, labelId: string): Promise<void> {
    await db.delete(schema.cardLabels)
      .where(
        and(
          eq(schema.cardLabels.cardId, cardId),
          eq(schema.cardLabels.labelId, labelId)
        )
      );
  }
}

export const storage = new DatabaseStorage();
