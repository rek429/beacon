import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    console.log("🌱  Seeding Beacon database...");

    // ── Clean slate ──────────────────────────────────────────────────────────
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.tracks);
    await db.delete(schema.familyGoals);

    // ── Tracks ───────────────────────────────────────────────────────────────
    await db.insert(schema.tracks).values([
      {
        id: 1,
        title: "Budgeting Basics",
        description: "Learn to plan, track, and control your money.",
        imageSrc: "/tracks/budgeting.svg",
        ageGroup: "ALL",
        order: 1,
      },
      {
        id: 2,
        title: "Credit & Debt",
        description: "Understand credit scores, loans, and debt payoff strategies.",
        imageSrc: "/tracks/credit.svg",
        ageGroup: "ADULTS",
        order: 2,
      },
      {
        id: 3,
        title: "Investing 101",
        description: "Grow your money with stocks, bonds, and index funds.",
        imageSrc: "/tracks/investing.svg",
        ageGroup: "TEENS",
        order: 3,
      },
      {
        id: 4,
        title: "Money for Kids",
        description: "Fun lessons about earning, saving, and spending wisely.",
        imageSrc: "/tracks/kids.svg",
        ageGroup: "KIDS",
        order: 4,
      },
    ]);

    // ── Units for Track 1 — Budgeting Basics ─────────────────────────────────
    await db.insert(schema.units).values([
      {
        id: 1,
        trackId: 1,
        title: "Unit 1 — Money Fundamentals",
        description: "Income, expenses, and net worth",
        order: 1,
      },
      {
        id: 2,
        trackId: 1,
        title: "Unit 2 — Building a Budget",
        description: "The 50/30/20 rule and zero-based budgeting",
        order: 2,
      },
      {
        id: 3,
        trackId: 1,
        title: "Unit 3 — Saving Strategies",
        description: "Emergency funds, sinking funds, and automation",
        order: 3,
      },
    ]);

    // ── Lessons for Unit 1 ───────────────────────────────────────────────────
    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, title: "What is income?",            order: 1 },
      { id: 2, unitId: 1, title: "Fixed vs variable expenses", order: 2 },
      { id: 3, unitId: 1, title: "Net worth explained",        order: 3 },
      { id: 4, unitId: 1, title: "Cash flow basics",           order: 4 },
    ]);

    // ── Lessons for Unit 2 ───────────────────────────────────────────────────
    await db.insert(schema.lessons).values([
      { id: 5, unitId: 2, title: "The 50/30/20 rule",    order: 1 },
      { id: 6, unitId: 2, title: "Zero-based budgeting", order: 2 },
      { id: 7, unitId: 2, title: "Tracking your spending", order: 3 },
    ]);

    // ── Challenges for Lesson 1 — What is income? ────────────────────────────
    await db.insert(schema.challenges).values([
      { id: 1, lessonId: 1, type: "SELECT", question: "Which of these is an example of ACTIVE income?", order: 1 },
      { id: 2, lessonId: 1, type: "SELECT", question: "Rental income from a property you own is an example of:", order: 2 },
      { id: 3, lessonId: 1, type: "ASSIST", question: "What does 'gross income' mean?", order: 3 },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Challenge 1
      { challengeId: 1, text: "Dividends from stocks",        correct: false },
      { challengeId: 1, text: "Your weekly paycheck",         correct: true  },
      { challengeId: 1, text: "Rent from a tenant",           correct: false },
      { challengeId: 1, text: "Interest from a savings account", correct: false },
      // Challenge 2
      { challengeId: 2, text: "Active income",   correct: false },
      { challengeId: 2, text: "Passive income",  correct: true  },
      { challengeId: 2, text: "Gross income",    correct: false },
      { challengeId: 2, text: "Net income",      correct: false },
      // Challenge 3
      { challengeId: 3, text: "Income after taxes",                     correct: false },
      { challengeId: 3, text: "Total income before any deductions",     correct: true  },
      { challengeId: 3, text: "Money left after all bills are paid",    correct: false },
      { challengeId: 3, text: "Only your salary, excluding bonuses",    correct: false },
    ]);

    // ── Challenges for Lesson 2 — Fixed vs variable ──────────────────────────
    await db.insert(schema.challenges).values([
      { id: 4, lessonId: 2, type: "SELECT", question: "Which expense is FIXED?",    order: 1 },
      { id: 5, lessonId: 2, type: "SELECT", question: "Which expense is VARIABLE?", order: 2 },
      { id: 6, lessonId: 2, type: "ASSIST", question: "Why is it important to know the difference between fixed and variable expenses?", order: 3 },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Challenge 4
      { challengeId: 4, text: "Grocery shopping",    correct: false },
      { challengeId: 4, text: "Monthly rent",         correct: true  },
      { challengeId: 4, text: "Restaurant meals",     correct: false },
      { challengeId: 4, text: "Gas for your car",     correct: false },
      // Challenge 5
      { challengeId: 5, text: "Car insurance premium", correct: false },
      { challengeId: 5, text: "Netflix subscription",  correct: false },
      { challengeId: 5, text: "Electricity bill",      correct: true  },
      { challengeId: 5, text: "Mortgage payment",      correct: false },
      // Challenge 6
      { challengeId: 6, text: "Fixed expenses can never be reduced",                    correct: false },
      { challengeId: 6, text: "It helps you identify where you can cut back",           correct: true  },
      { challengeId: 6, text: "Variable expenses always cost more than fixed expenses", correct: false },
      { challengeId: 6, text: "There is no difference — they're both just bills",       correct: false },
    ]);

    // ── Challenges for Lesson 3 — Net worth ──────────────────────────────────
    await db.insert(schema.challenges).values([
      { id: 7,  lessonId: 3, type: "SELECT", question: "Assets = $45,000 · Debts = $18,000. What is net worth?",   order: 1 },
      { id: 8,  lessonId: 3, type: "SELECT", question: "Which of these is an ASSET?",                              order: 2 },
      { id: 9,  lessonId: 3, type: "ASSIST", question: "A positive net worth means you own more than you owe. True or false?", order: 3 },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Challenge 7
      { challengeId: 7, text: "$63,000", correct: false },
      { challengeId: 7, text: "$27,000", correct: true  },
      { challengeId: 7, text: "$18,000", correct: false },
      { challengeId: 7, text: "$45,000", correct: false },
      // Challenge 8
      { challengeId: 8, text: "A credit card balance",    correct: false },
      { challengeId: 8, text: "A student loan",           correct: false },
      { challengeId: 8, text: "A savings account",        correct: true  },
      { challengeId: 8, text: "A medical bill",           correct: false },
      // Challenge 9
      { challengeId: 9, text: "False — net worth only counts savings",  correct: false },
      { challengeId: 9, text: "True",                                    correct: true  },
      { challengeId: 9, text: "False — it depends on your income",      correct: false },
      { challengeId: 9, text: "False — liabilities are not counted",    correct: false },
    ]);

    // ── Challenges for Lesson 5 — 50/30/20 rule ──────────────────────────────
    await db.insert(schema.challenges).values([
      { id: 10, lessonId: 5, type: "SELECT", question: "In the 50/30/20 rule, what does the 20% represent?",  order: 1 },
      { id: 11, lessonId: 5, type: "SELECT", question: "Monthly take-home is $3,000. How much goes to 'wants'?", order: 2 },
      { id: 12, lessonId: 5, type: "ASSIST", question: "What does the 50% category in the 50/30/20 rule cover?", order: 3 },
    ]);

    await db.insert(schema.challengeOptions).values([
      // Challenge 10
      { challengeId: 10, text: "Needs like rent and food",           correct: false },
      { challengeId: 10, text: "Savings and debt repayment",         correct: true  },
      { challengeId: 10, text: "Entertainment and dining out",       correct: false },
      { challengeId: 10, text: "Investments only",                   correct: false },
      // Challenge 11
      { challengeId: 11, text: "$600",  correct: false },
      { challengeId: 11, text: "$1500", correct: false },
      { challengeId: 11, text: "$900",  correct: true  },
      { challengeId: 11, text: "$300",  correct: false },
      // Challenge 12
      { challengeId: 12, text: "Savings and investments",                    correct: false },
      { challengeId: 12, text: "Needs — housing, food, utilities, transport", correct: true  },
      { challengeId: 12, text: "Fun money like travel and hobbies",          correct: false },
      { challengeId: 12, text: "Debt repayment",                             correct: false },
    ]);

    // ── Sample family goals ───────────────────────────────────────────────────
    await db.insert(schema.familyGoals).values([
      {
        familyId: "demo-family-001",
        title: "Summer Vacation Fund",
        description: "Family trip to Costa Rica in July",
        targetAmount: 500000, // $5,000 in cents
        currentAmount: 210000, // $2,100 in cents
        targetDate: new Date("2026-07-01"),
      },
    ]);

    console.log("✅  Seed complete!");
  } catch (error) {
    console.error("Seed failed:", error);
    throw error;
  }
}

main();
