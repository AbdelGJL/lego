import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const connectionString = `mongodb+srv://abdelgjl:${process.env.SECRET_KEY}@clusterlego.xkkxu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLego`;

if (!connectionString.startsWith("mongodb://") && !connectionString.startsWith("mongodb+srv://")) {
  throw new Error("Invalid MongoDB connection string");
}

const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useNewUrlParser: true,
  }
});

let conn;
try {
  conn = await client.connect();
  console.log("Connected to database");
} catch (e) {
  console.error("Error connecting to database:", e);
  process.exit(1); // Exit the process if the connection fails
}

let db = client.db("lego");

export default db;