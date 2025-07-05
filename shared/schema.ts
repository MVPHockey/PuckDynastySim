import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("gm"), // "commissioner", "gm"
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leagues = pgTable("leagues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  commissionerId: integer("commissioner_id").notNull(),
  currentSeason: integer("current_season").notNull().default(1),
  currentDay: integer("current_day").notNull().default(1),
  salaryCap: real("salary_cap").notNull().default(80000000),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  gmId: integer("gm_id"),
  tier: text("tier").notNull().default("pro"), // "pro", "farm"
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  overtimeLosses: integer("overtime_losses").notNull().default(0),
  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  budget: real("budget").notNull().default(80000000),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  teamId: integer("team_id"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  position: text("position").notNull(), // "C", "LW", "RW", "D", "G"
  age: integer("age").notNull(),
  jerseyNumber: integer("jersey_number"),
  nationality: text("nationality").notNull(),
  overall: integer("overall").notNull(),
  skating: integer("skating").notNull(),
  shooting: integer("shooting").notNull(),
  hands: integer("hands").notNull(),
  checking: integer("checking").notNull(),
  defense: integer("defense").notNull(),
  salary: real("salary").notNull().default(0),
  contractLength: integer("contract_length").notNull().default(0),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  points: integer("points").notNull().default(0),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  homeTeamId: integer("home_team_id").notNull(),
  awayTeamId: integer("away_team_id").notNull(),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  period: integer("period").notNull().default(1),
  timeRemaining: text("time_remaining").notNull().default("20:00"),
  isFinished: boolean("is_finished").notNull().default(false),
  scheduledDate: timestamp("scheduled_date").notNull(),
  playByPlay: text("play_by_play").array().notNull().default([]),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const tradeOffers = pgTable("trade_offers", {
  id: serial("id").primaryKey(),
  leagueId: integer("league_id").notNull(),
  fromTeamId: integer("from_team_id").notNull(),
  toTeamId: integer("to_team_id").notNull(),
  offerDetails: text("offer_details").notNull(), // JSON string
  status: text("status").notNull().default("pending"), // "pending", "accepted", "rejected"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertLeagueSchema = createInsertSchema(leagues).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, timestamp: true });
export const insertTradeOfferSchema = createInsertSchema(tradeOffers).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type League = typeof leagues.$inferSelect;
export type InsertLeague = z.infer<typeof insertLeagueSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type TradeOffer = typeof tradeOffers.$inferSelect;
export type InsertTradeOffer = z.infer<typeof insertTradeOfferSchema>;
