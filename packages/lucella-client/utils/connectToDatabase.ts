import { MongoClient } from "mongodb";

const dbUrl = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:6000/${process.env.MONGODB_DATABASE_NAME}?authSource=admin`;

export default async function connectToDatabase() {
  const client = await MongoClient.connect(dbUrl);
  return client;
}
