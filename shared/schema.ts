import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Boards table
export const boards = pgTable("boards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  background: jsonb("background"), // { type, value }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Board members with roles
export const boardMembers = pgTable("board_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: varchar("board_id").notNull().references(() => boards.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"), // owner, admin, member, observer
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Lists table
export const lists = pgTable("lists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: varchar("board_id").notNull().references(() => boards.id),
  title: text("title").notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cards table
export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listId: varchar("list_id").notNull().references(() => lists.id),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  cover: jsonb("cover"), // { type, value, size, position }
  archived: boolean("archived").default(false),
  customFields: jsonb("custom_fields"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Card votes
export const cardVotes = pgTable("card_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  voteType: text("vote_type").notNull(), // up, down
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Card attachments
export const attachments = pgTable("attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // file, link
  mimeType: text("mime_type"),
  size: integer("size"),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // mention, assignment, due_date, comment, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  cardId: varchar("card_id").references(() => cards.id),
  boardId: varchar("board_id").references(() => boards.id),
  actionByUserId: varchar("action_by_user_id").references(() => users.id),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Card templates
export const cardTemplates = pgTable("card_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // personal, team, featured
  cardData: jsonb("card_data").notNull(), // template card structure
  useCount: integer("use_count").default(0),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Board templates
export const boardTemplates = pgTable("board_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // personal, team, featured
  boardData: jsonb("board_data").notNull(), // template board structure
  useCount: integer("use_count").default(0),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comments
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  mentions: jsonb("mentions"), // array of user ids
  edited: boolean("edited").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Labels (etiquetas) for boards
export const labels = pgTable("labels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: varchar("board_id").notNull().references(() => boards.id),
  name: text("name").notNull(),
  color: text("color").notNull(), // hex color code
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Card labels (many-to-many relationship)
export const cardLabels = pgTable("card_labels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cardId: varchar("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
  labelId: varchar("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity log
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: varchar("board_id").notNull().references(() => boards.id),
  cardId: varchar("card_id").references(() => cards.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // card_moved, label_added, etc.
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas for inserts
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertBoardSchema = createInsertSchema(boards).pick({
  title: true,
  description: true,
  ownerId: true,
});

export const insertCardSchema = createInsertSchema(cards).pick({
  listId: true,
  title: true,
  description: true,
  position: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  title: true,
  message: true,
});

export const insertLabelSchema = createInsertSchema(labels).pick({
  boardId: true,
  name: true,
  color: true,
});

export const insertCardLabelSchema = createInsertSchema(cardLabels).pick({
  cardId: true,
  labelId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Board = typeof boards.$inferSelect;
export type BoardMember = typeof boardMembers.$inferSelect;
export type List = typeof lists.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type CardVote = typeof cardVotes.$inferSelect;
export type Attachment = typeof attachments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type CardTemplate = typeof cardTemplates.$inferSelect;
export type BoardTemplate = typeof boardTemplates.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Label = typeof labels.$inferSelect;
export type CardLabel = typeof cardLabels.$inferSelect;
