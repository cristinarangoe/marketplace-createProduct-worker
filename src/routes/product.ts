import { ProductDB, ProductInfo } from './../types';
import { Hono } from 'hono';
import * as Realm from 'realm-web';

const product = new Hono();

let RealmApp: Realm.App;
const ObjectId = Realm.BSON.ObjectID;

product.post('/createProduct/:id/:category', async (c) => {
	try {
		const idBusiness = c.req.param('id');
		const category = c.req.param('category');

		RealmApp = RealmApp || new Realm.App(c.env.MONGO_DB_APP_ID);

		const credentials = Realm.Credentials.apiKey(c.env.MONGO_DB_API_KEY);

		//duda 
		let user = await RealmApp.logIn(credentials);
		let mongoClient = user.mongoClient('mongodb-atlas');

		//duda
		const body: ProductInfo[] = await c.req.json();

		body.map((p) => {
			p.idBusiness = idBusiness;
			p.category = category;
		})

		console.log(body)

		const collection = mongoClient
			.db('users')
			.collection<ProductDB>('Products');
		await collection.insertMany(body);

		return new Response('Product saved', {
			status: 201,
			statusText: 'Created',
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify((error as Error).message), {
			status: 500,
		});
	}
});

export default product;