import * as Realm from 'realm-web';

export interface Env {
	MY_BUCKET: R2Bucket;
	MONGO_DB_APP_ID: string;
	MONGO_DB_API_KEY: string;
}

type Document = globalThis.Realm.Services.MongoDB.Document;

export interface Todo extends Document {
	owner: string;
	done: boolean;
	todo: string;
}

export interface characteristics {
	type: string;
	value: string;
}

export interface ProductInfo {
	name: string;
	price: number;
	image: File;
	description: string;
	characteristics: characteristics[];
	idBusiness: string;
	category: string;
}

export interface ProductDB extends Document {
	name: string;
	price: number;
	image: string;
	description: string;
	characteristics: characteristics[];
	idBusiness: string;
	category: string;
}
