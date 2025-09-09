import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

const api = new Hono();

api.get('/test.txt', (c) => {
    const response = {
        success: true,
        message: '200 OK',
    };

    return c.json(response, 200);
});

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
