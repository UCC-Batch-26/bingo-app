import { afterAll, afterEach, beforeAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

// Connect to the in-memory database before running tests
export async function connect() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

// Clear all test data after every test
export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

// Remove and close the db and server
export async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

// Setup test environment
beforeAll(async () => {
  await connect();
});

// Clear test data after each test
afterEach(async () => {
  await clearDatabase();
});

// Remove and close the db and server
afterAll(async () => {
  await closeDatabase();
});
