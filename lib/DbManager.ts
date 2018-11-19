import { MongoClient, Db } from "mongodb";

let client: MongoClient = null;
let db: Db = null;

export function boot() {
    client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true });
    client.connect().then(() => {
        console.log("Connected successfully to mongodb server");

        db = client.db(process.env.MONGO_DB)
    });
}

export let getDb = () => db;
export let getClient = () => client;