import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
//const { MongoClient, ServerApiVersion } = require("mongodb");
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const { DB_URI, DB_NAME } = process.env;

const typeDefs = `#graphql
  type User {
    id: ID!
  }
`;

const resolvers = {};

const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const start = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db(DB_NAME);

    const context = { db };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context,
    });
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
start().catch(console.dir);
