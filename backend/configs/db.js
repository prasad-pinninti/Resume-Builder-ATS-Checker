import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database Connection Manager
 * 
 * Sets up a persistent connection to MongoDB using Mongoose.
 * Prevents connection string corruption by utilizing the `dbName` option.
 */
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully 🔗");
    });

    let mogodbURI = process.env.MONGODB_URI;
    const projectName = "resume-builder";

    // Fallback to in-memory MongoDB if MONGODB_URI is empty or missing
    if (!mogodbURI) {
      console.log("MONGODB_URI not found in environment. Starting persistent local MongoDB server... 💾");
      try {
        const dbPath = path.resolve(__dirname, "../db_data");
        if (!fs.existsSync(dbPath)) {
          fs.mkdirSync(dbPath, { recursive: true });
        }
        const mongoServer = await MongoMemoryServer.create({
          instance: {
            dbPath: dbPath,
            storageEngine: "wiredTiger"
          }
        });
        mogodbURI = mongoServer.getUri();
        console.log(`Persistent local MongoDB server started successfully at ${mogodbURI}`);
      } catch (err) {
        console.error("Failed to start persistent local MongoDB server:", err);
        throw err;
      }
    }

    // Connect cleanly using dbName option to avoid breaking query options (like ?retryWrites=true)
    await mongoose.connect(mogodbURI, {
      dbName: projectName
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
