import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Artists } from './db/schema.js';
import { db } from './db/index.js';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';

const api = new Hono()
    .get('/artists', async (c) => {
        const allArtists = await db
            .select({
                name: Artists.name,
                slug: Artists.slug,
                bio: Artists.bio,
                profilePictureUrl: Artists.profilePictureUrl,
            })
            .from(Artists)
            .orderBy(desc(Artists.createdAt));

        const response = {
            success: true,
            data: allArtists.map((artist) => ({
                name: artist.name,
                slug: artist.slug,
                bio: artist.bio,
                profilePictureUrl: artist.profilePictureUrl,
            })),
            count: allArtists.length,
        };

        return c.json(response);
    })
    .get('/artist/:slug', async (c) => {
        // TODO: add clips that are related to the artist IF requested in the query params
        const slug = c.req.param('slug');
        const artists = await db
            .select({
                name: Artists.name,
                slug: Artists.slug,
                bio: Artists.bio,
                profilePictureUrl: Artists.profilePictureUrl,
            })
            .from(Artists)
            .where(eq(Artists.slug, slug));

        if (!artists || artists.length === 0)
            return c.json({ success: false, message: 'Artist not found' }, 404);

        return c.json(artists[0]);
    })
    .post(
        '/artist',
        zValidator(
            'json',
            z.object({
                name: z.string(),
                slug: z.string().optional(),
                bio: z.string().optional(),
                profilePictureUrl: z.string().optional(),
            })
        ),
        async (c) => {
            const { name, slug, bio, profilePictureUrl } = c.req.valid('json');

            const result = await db.insert(Artists).values({
                name,
                bio,
                profilePictureUrl,
                slug: slug ?? name.toLowerCase().replace(/\s/g, '-'),
            });

            if (!result[0].insertId) {
                const responseData = {
                    success: false,
                    message: 'Failed to create artist',
                    data: null,
                };
                return c.json(responseData, 500);
            }

            const responseData = {
                success: true,
                data: {
                    id: result[0].insertId,
                },
                message: 'Artist created successfully',
            };
            return c.json(responseData, 201);
        }
    );

const app = new Hono()
    .use('/*', serveStatic({ root: './public' }))
    .route('/api', api);

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);
