import express, { Application } from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import resolvers from "./graphql/resolvers/rootResolver";
import typeDefs from "./graphql/typeDefs/rootTypeDef";
import TokenDecode from "./middlewares/auth";
import AuthDirective from "./directives/AuthDirectives";

const app: Application = express();
const PORT = 5000;
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
      if (user) {
        return {
          user,
        };
      }
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

mongoose
  .connect("mongodb+srv://max:Starwars123@cluster0.bry1v.mongodb.net/test", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
// try {
//   if (mongoose.connection.db.listCollections() != undefined) {
//     mongoose.connection.db.listCollections().toArray((err: Error, names) => {
//       names.map((item) => {
//         mongoose.connection.db.dropCollection(item, (err, result) => {
//           console.log("Collection droped");
//         });
//       });
//     });
//   }
// } catch (e) {
//   console.log(e.message);
// }
