import {
    mysqlTable,
    int,
    varchar,
    decimal,
    datetime,
    text,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

const string = (name: string) => varchar(name, { length: 192 });

export const Videos = mysqlTable('videos', {
    id: int('id').primaryKey().autoincrement(),
    modelId: int('model_id').notNull(),
    title: string('title').notNull(),
    durationS: int('duration_s'),
    price: decimal('price').notNull(),
    thumbnailUrl: string('thumbnail_url').notNull(),
    videoUrl: string('video_url'),
    purchasedAt: datetime('purchased_at'),
    publishedAt: datetime('published_at').notNull(),
    updatedAt: datetime('updated_at')
        .notNull()
        .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
    createdAt: datetime('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
});
export type tVideos = typeof Videos.$inferSelect;

export const Purchases = mysqlTable('purchases', {
    id: int('id').primaryKey().autoincrement(),
    userId: int('user_id').notNull(),
    videoId: int('video_id').notNull(),
    price: decimal('price').notNull(),
    createdAt: datetime('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
        .notNull()
        .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
export type Pturchases = typeof Purchases.$inferSelect;

export const Users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    email: string('email').notNull(),
    slug: string('slug').notNull(),
    createdAt: datetime('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
        .notNull()
        .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
export type tUsers = typeof Users.$inferSelect;

export const Artists = mysqlTable('artists', {
    id: int('id').primaryKey().autoincrement(),
    name: string('name').notNull(),
    slug: string('slug').notNull().unique(),
    bio: text('bio'),
    profilePictureUrl: string('profile_picture_url'),
    createdAt: datetime('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at')
        .notNull()
        .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
export type tArtists = typeof Artists.$inferSelect;
