import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const caseDocuments = pgTable("case_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // pdf, image, audio, transcript, letter, other
  date: timestamp("date"),
  path: text("path"),
  summary: text("summary"),
  tags: jsonb("tags").$type<string[]>(),
  sourceNote: text("source_note"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
});

export const timelineEvents = pgTable("timeline_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  docRefs: jsonb("doc_refs").$type<string[]>(),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const foiaRequests = pgTable("foia_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agency: text("agency").notNull(),
  requestNumber: text("request_number"),
  status: text("status").notNull(), // submitted, pending, completed, denied
  submittedDate: timestamp("submitted_date").notNull(),
  responseDate: timestamp("response_date"),
  description: text("description"),
  responseSummary: text("response_summary"),
  documentsReceived: jsonb("documents_received").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const caseNotes = pgTable("case_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  documentId: varchar("document_id").references(() => caseDocuments.id),
  tags: jsonb("tags").$type<string[]>(),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const motions = pgTable("motions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // motion_to_dismiss, motion_for_summary_judgment, etc.
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, filed, pending, granted, denied
  priority: varchar("priority", { length: 10 }).notNull().default("medium"), // low, medium, high, urgent
  description: text("description"),
  dueDate: date("due_date"),
  filedDate: date("filed_date"),
  court: text("court"),
  caseNumber: text("case_number"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  attachments: jsonb("attachments").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const deadlines = pgTable("deadlines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  priority: varchar("priority", { length: 10 }).notNull().default("medium"),
  category: varchar("category", { length: 30 }).notNull(), // filing, discovery, hearing, appeal, etc.
  status: varchar("status", { length: 20 }).notNull().default("upcoming"), // upcoming, overdue, completed, cancelled
  relatedMotionId: varchar("related_motion_id").references(() => motions.id),
  reminderDays: jsonb("reminder_days").$type<number[]>().default([7, 3, 1]), // Days before deadline to remind
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCaseDocumentSchema = createInsertSchema(caseDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({
  id: true,
  createdAt: true,
});

export const insertFoiaRequestSchema = createInsertSchema(foiaRequests).omit({
  id: true,
  createdAt: true,
});

export const insertCaseNoteSchema = createInsertSchema(caseNotes).omit({
  id: true,
  createdAt: true,
});

export const insertMotionSchema = createInsertSchema(motions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeadlineSchema = createInsertSchema(deadlines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCaseDocument = z.infer<typeof insertCaseDocumentSchema>;
export type CaseDocument = typeof caseDocuments.$inferSelect;

export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;

export type InsertFoiaRequest = z.infer<typeof insertFoiaRequestSchema>;
export type FoiaRequest = typeof foiaRequests.$inferSelect;

export type InsertCaseNote = z.infer<typeof insertCaseNoteSchema>;
export type CaseNote = typeof caseNotes.$inferSelect;

export type InsertMotion = z.infer<typeof insertMotionSchema>;
export type Motion = typeof motions.$inferSelect;

export type InsertDeadline = z.infer<typeof insertDeadlineSchema>;
export type Deadline = typeof deadlines.$inferSelect;
