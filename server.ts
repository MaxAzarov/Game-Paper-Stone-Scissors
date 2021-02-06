import express, { Application } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";

import resolvers from "./graphql/resolvers/rootResolver";
import typeDefs from "./graphql/typeDefs/rootTypeDef";
import TokenDecode from "./middlewares/auth";
import AuthDirective from "./directives/AuthDirectives";
import pool from "./db";

const app: Application = express();
dotenv.config();
const { PORT = 5000 } = process.env;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective,
  },
  playground: true,
  context: async ({ req, connection }) => {
    let user;
    if (connection) {
      // check connection for metadata
      user = await TokenDecode(connection.context.authToken);
      return {
        user,
      };
    }

    if (req.headers.authorization) {
      user = await TokenDecode(req.headers.authorization);
      return {
        user,
      };
    }
  },
  formatError(e) {
    return e;
  },
});

app.disable("x-powered-by");

const path = "/graphql";

server.applyMiddleware({
  app,
  path,
});
app.use(express.json());
app.use(cors());

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

pool
  .connect()
  .then((res) => {
    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
      );
    });
  })
  .catch((e) => console.log("can't connect to db"));
