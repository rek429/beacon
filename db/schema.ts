import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ── Tracks (replaces "courses") ──────────────────────────────────────────────
// e.g. "Budgeting Basics", "Credit & Debt", "Investing 101", "Money for Kids"

export const ageGroupEnum = pgEnum("age_group", [
  "KIDS",      // 6–12
  "TEENS",     // 13–17
  "ADULTS",    // 18+
  "ALL",
]);

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageSrc: text("image_src").notNull(),
  ageGroup: ageGroupEnum("age_group").notNull().default("ALL"),
  order: integer("order").notNull(),
});

export const tracksRelations = relations(tracks, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

// ── Units ────────────────────────────────────────────────────────────────────

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  trackId: integer("track_id")
    .references(() => tracks.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ one, many }) => ({
  track: one(tracks, {
    fields: [units.trackId],
    references: [tracks.id],
  }),
  lessons: many(lessons),
}));

// ── Lessons ──────────────────────────────────────────────────────────────────

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

// ── Challenges ───────────────────────────────────────────────────────────────

export const challengeTypeEnum = pgEnum("challenge_type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  type: challengeTypeEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

// ── User Progress ────────────────────────────────────────────────────────────

export const familyRoleEnum = pgEnum("family_role", [
  "PARENT",
  "TEEN",
  "CHILD",
]);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  familyId: text("family_id"),                         // groups family members
  familyRole: familyRoleEnum("family_role").notNull().default("PARENT"),
  activeTrackId: integer("active_track_id").references(() => tracks.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  lastActivityAt: timestamp("last_activity_at"),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeTrack: one(tracks, {
    fields: [userProgress.activeTrackId],
    references: [tracks.id],
  }),
}));

// ── Family Goals ─────────────────────────────────────────────────────────────

export const familyGoals = pgTable("family_goals", {
  id: serial("id").primaryKey(),
  familyId: text("family_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetAmount: integer("target_amount").notNull(),    // in cents
  currentAmount: integer("current_amount").notNull().default(0),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Subscription ─────────────────────────────────────────────────────────────

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});
