import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
    "users", {
        id: serial("id").primaryKey(),
        handle: varchar("handle", {length: 50}).notNull().unique(),
        displayName: varchar("display_name", {length: 50}).notNull(),
    },
    (table) => ({
        handleIndex: index("handle_index").on(table.handle),
    }),
);

export const eventTable = pgTable(
    "events", {
        id: serial("id").primaryKey(),
        title: varchar("title", {length: 50}).notNull().unique(),
        startedAt: varchar("start_time", {length: 50}).notNull(),
        endAt: varchar("end_time", {length: 50}).notNull(),
    },
    
)

export const attendeeTable = pgTable(
    "attendees", {
        id: serial("id").primaryKey(),
        userHandle: varchar("user_handle", { length: 50 }).notNull().references(()=>userTable.handle, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }).notNull(),
        targetEvent: integer("target_event_id").notNull().references(()=>eventTable.id, {onDelete: "cascade"}),
        spareTime: varchar("spareTime").notNull()
    }
)

export const commentTable = pgTable(
    "comments", {
        id: serial("id").primaryKey(),
        userHandle: varchar("user_handle", { length: 50 }).notNull().references(()=>userTable.handle, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }).notNull(),
        content: varchar("comment", {length: 50}).notNull(),
        targetEvent: integer("target_event_id").notNull().references(()=>eventTable.id, {onDelete: "cascade"}),
        createdAt: timestamp("created_at").default(sql`now()`),
    }
)