"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
const rootResolver_1 = __importDefault(require("./graphql/resolvers/rootResolver"));
const rootTypeDef_1 = __importDefault(require("./graphql/typeDefs/rootTypeDef"));
const auth_1 = __importDefault(require("./middlewares/auth"));
const AuthDirectives_1 = __importDefault(require("./directives/AuthDirectives"));
const app = express_1.default();
dotenv_1.default.config();
const { PORT = 5000, MONGODB_USER, MONGODB_PASS } = process.env;
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: rootTypeDef_1.default,
    resolvers: rootResolver_1.default,
    schemaDirectives: {
        auth: AuthDirectives_1.default,
    },
    playground: true,
    context: ({ req, connection }) => __awaiter(void 0, void 0, void 0, function* () {
        let user;
        if (connection) {
            // check connection for metadata
            user = yield auth_1.default(connection.context.authToken);
            return {
                user,
            };
        }
        if (req.headers.authorization) {
            user = yield auth_1.default(req.headers.authorization);
            return {
                user,
            };
        }
    }),
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
app.use(express_1.default.json());
app.use(cors_1.default());
const httpServer = http_1.default.createServer(app);
server.installSubscriptionHandlers(httpServer);
mongoose_1.default
    .connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.bry1v.mongodb.net/test`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((res) => {
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
    });
})
    .catch((e) => console.log("can't connect to db"));
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
