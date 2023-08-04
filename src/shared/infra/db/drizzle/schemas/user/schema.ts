import { InferModel } from 'drizzle-orm';
import { pgTable, varchar, uuid, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  birth_date: timestamp('birth_date').notNull(),
  password: varchar('password').notNull(),
  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
  deleted_at: timestamp('deleted_at'),
});

export type User = InferModel<typeof users, 'select'>;
export type NewUser = InferModel<typeof users, 'insert'>;
