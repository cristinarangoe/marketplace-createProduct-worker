import { ProductDB, ProductInfo } from './../types';
import { Hono } from 'hono';
import * as Realm from 'realm-web';
import { BodyData } from 'hono/utils/body';
import { sha256 } from 'hono/utils/crypto';

const product = new Hono();

let RealmApp: Realm.App;
const ObjectId = Realm.BSON.ObjectID;

// interface ProductReq {
// 	idBusiness: string;
// 	businessType: string;
// 	name: string;
// 	description: string;
// 	characteristics: {
// 		type: string;
// 		value: string;
// 	}[];
// 	price: number;
// }

// interface ProductDB extends ProductReq {
// 	image: Blob | undefined;
// }

product.post('/createProduct', async (c) => {
	try {
		RealmApp = RealmApp || new Realm.App(c.env.MONGO_DB_APP_ID);

		const credentials = Realm.Credentials.apiKey(c.env.MONGO_DB_API_KEY);

		let user = await RealmApp.logIn(credentials);
		let mongoClient = user.mongoClient('mongodb-atlas');

		// console.log(c.req.header);
		const body: ProductDB[] = await c.req.json();
		// const body = await c.req.parseBody();
		// const products: ProductDB[] = parseProducts(body);
		// console.log(products[0].image);
		// const file = await c.env.MY_BUCKET.put('test', products[0].image!);
		// console.log(file);

		// console.log(body);

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

function parseProducts(products: BodyData) {
	const map = new Map(Object.entries(products));
	const arr = Array(map.size / 2).fill({});
	map.forEach((val, key) => {
		const index = parseInt(key.split('_').pop() as string);
		if (val instanceof Blob) {
			const tmp = arr[index];
			tmp.image = val;
			arr[index] = tmp;
		}
		if (typeof val === 'string') {
			const tmp = arr[index];
			tmp.product = val;
			arr[index] = tmp;
		}
	});

	const result = arr.map((val) => ({
		...JSON.parse(val.product),
		image: val.image,
	}));
	return result;
}

export default product;
