import express, { Application } from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";

import resolvers from "./graphql/resolvers/rootResolver";
import typeDefs from "./graphql/typeDefs/rootTypeDef";
import TokenDecode from "./middlewares/auth";
import AuthDirective from "./directives/AuthDirectives";

const app: Application = express();

dotenv.config();
const { PORT = 5000, MONGODB_USER, MONGODB_PASS } = process.env;
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
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      console.log("connectedParams:", connectionParams);
      if ((connectionParams as any).authToken) {
        const user = await TokenDecode((connectionParams as any).authToken);
        return {
          user,
        };
      }
    },
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

mongoose
  .connect(
    `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.bry1v.mongodb.net/test`,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
      );
    });
  })
  .catch(() => console.log("can't connect to db"));

// drop collection
// try {
//   const db = mongoose.connection;
//   db.once("open", function () {
//     db.dropCollection("rooms", (err) => {
//       if (err) {
//         console.log("error delete collection");
//       } else {
//         console.log("delete collection success");
//       }
//     });
//   });
// } catch (e) {
//   console.log(e.message);
// }
