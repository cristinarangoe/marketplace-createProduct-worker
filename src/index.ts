import { Hono } from 'hono';
import { cors } from 'hono/cors';
import product from './routes/product'
import { Env } from './types';


const app = new Hono<{ Bindings: Env }>();
app.use(
	'/*',
	cors({
		origin: '*',
		allowMethods: ['POST'],
	})
);
app.route('/business', product);

export default app;
