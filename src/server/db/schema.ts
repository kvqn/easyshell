import { relations, sql } from "drizzle-orm"
import {
  bigint,
  boolean,
  foreignKey,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"
import { type AdapterAccount } from "next-auth/adapters"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `practish_${name}`)

export const posts = createTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
)

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  terminalSessions: many(terminalSessions),
}))

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

export const terminalSessions = createTable(
  "terminal_session",
  {
    id: varchar("id", { length: 36 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    problemId: int("problem_id", { unsigned: true }).notNull(),
    testcaseId: int("testcase_id", { unsigned: true }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (ts) => ({
    userIdIdx: index("terminal_session_user_id_idx").on(ts.userId),
  }),
)

export const terminalSessionsRelations = relations(
  terminalSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [terminalSessions.userId],
      references: [users.id],
    }),
    logs: many(terminalSessionLogs),
  }),
)

export const terminalSessionLogs = createTable(
  "terminal_session_log",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    sessionId: varchar("session_id", { length: 36 }).notNull(),
    stdin: text("stdin").notNull(),
    stdout: text("stdout").notNull(),
    stderr: text("stderr").notNull(),
    startedAt: timestamp("started_at").notNull(),
    finishedAt: timestamp("finished_at").notNull(),
  },
  (tsl) => ({
    sessionIdIdx: index("terminal_session_log_session_id_idx").on(
      tsl.sessionId,
    ),
    sessionIdFk: foreignKey({
      name: "terminal_session_log_session_id_fk",
      columns: [tsl.sessionId],
      foreignColumns: [terminalSessions.id],
    }),
  }),
)

export const terminalSessionLogsRelations = relations(
  terminalSessionLogs,
  ({ one }) => ({
    session: one(terminalSessions, {
      fields: [terminalSessionLogs.sessionId],
      references: [terminalSessions.id],
    }),
  }),
)

export const submissions = createTable("submissions", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  problemId: int("problem_id", { unsigned: true }).notNull(),
})

export const submission_testcases = createTable(
  "submission_testcase",
  {
    submissionId: bigint("submission_id", { mode: "number" })
      .notNull()
      .references(() => submissions.id),
    testcaseId: int("testcase_id", { unsigned: true }).notNull(),
    input: text("stdin").notNull(),
    stdout: text("stdout").notNull(),
    stderr: text("stderr").notNull(),
    exitCode: int("exit_code").notNull(),
    createdAt: timestamp("created_at").notNull(),
    finishedAt: timestamp("finished_at").notNull(),
    fsZipBase64: text("fs_zip_base64"),
    passed: boolean("success").notNull(),
  },
  (submission) => ({
    compoundKey: primaryKey({
      columns: [submission.submissionId, submission.testcaseId],
    }),
  }),
)
