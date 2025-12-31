import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let connection: Mongoose | null = null;

/**
 * Gets the connection to the MongoDB database.
 * @returns The Mongoose connection object.
 * @throws An error if the connection fails.
 */
async function connectMongoDB(): Promise<Mongoose> {
    if (connection != null) {
        return connection;
    }

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable missing.");
    }

    connection = await mongoose.connect(MONGODB_URI);
    return connection;
}

export default connectMongoDB;
