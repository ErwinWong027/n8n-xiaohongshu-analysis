import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  unique,
  index,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core'
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const authorsTable = pgTable(
  'authors',
  {
    id: serial('id').primaryKey(),
    userName: text('user_name').notNull(),
    userXhsId: text('user_xhs_id').notNull().unique(),
    subscribers: integer('subscribers').notNull().default(0),
    followers: integer('followers').notNull().default(0),
    likes: integer('likes').notNull().default(0),
    profileUrl: text('profile_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    otherNotes: jsonb('other_notes').notNull().default([]),
    report: text('report'),
  },
  (authors) => ({
    userXhsIdIdx: index('idx_authors_user_xhs_id').on(authors.userXhsId),
    createdAtIdx: index('idx_authors_created_at').on(authors.createdAt),
  })
)

export const notesTable = pgTable(
  'notes',
  {
    id: serial('id').primaryKey(),
    authorId: integer('author_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    likes: integer('likes').default(0),
    collects: integer('collects').default(0),
    isTop10: boolean('is_top10').notNull().default(false),
    rawJson: jsonb('raw_json').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (notes) => ({
    authorIdIdx: index('idx_notes_author_id').on(notes.authorId),
    isTop10Idx: index('idx_notes_is_top10').on(notes.isTop10),
    createdAtIdx: index('idx_notes_created_at').on(notes.createdAt),
    authorIdFk: foreignKey({
      columns: [notes.authorId],
      foreignColumns: [authorsTable.id],
    }),
  })
)

// Define relations
export const authorsRelations = relations(authorsTable, ({ many }) => ({
  notes: many(notesTable),
}))

export const notesRelations = relations(notesTable, ({ one }) => ({
  author: one(authorsTable, {
    fields: [notesTable.authorId],
    references: [authorsTable.id],
  }),
}))

export type Author = InferSelectModel<typeof authorsTable>
export type NewAuthor = InferInsertModel<typeof authorsTable>
export type Note = InferSelectModel<typeof notesTable>
export type NewNote = InferInsertModel<typeof notesTable>

// Connect to Postgres
export const db = drizzle(sql, {
  schema: {
    authors: authorsTable,
    notes: notesTable,
    authorsRelations,
    notesRelations,
  },
})