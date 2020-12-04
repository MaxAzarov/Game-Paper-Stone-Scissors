"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.cache = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_router_dom_1 = require("react-router-dom");
const context_1 = require("@apollo/client/link/context");
const client_1 = require("@apollo/client");
const error_1 = require("@apollo/client/link/error");
const utilities_1 = require("@apollo/client/utilities");
const ws_1 = require("@apollo/client/link/ws");
const serviceWorker = __importStar(require("./serviceWorker"));
const App_1 = __importDefault(require("./App"));
const httpLink = client_1.createHttpLink({
    uri: "http://localhost:5000/graphql",
});
const wsLink = new ws_1.WebSocketLink({
    uri: `ws://localhost:5000/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem("token"),
        },
    },
});
const authLink = context_1.setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: Object.assign(Object.assign({}, headers), { authorization: token ? `Bearer ${token}` : "" }),
    };
});
let link = client_1.ApolloLink.from([
    error_1.onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            // graphQLErrors.map(({ message, locations, path }) =>
            // console.log(
            //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            // )
            // );
        }
        if (networkError)
            console.error(`[Network error]: ${networkError}`, networkError.stack);
    }),
    authLink,
    client_1.split(({ query }) => {
        const definition = utilities_1.getMainDefinition(query);
        return (definition.kind === "OperationDefinition" &&
            definition.operation === "subscription");
    }, wsLink, httpLink),
]);
exports.cache = new client_1.InMemoryCache();
exports.client = new client_1.ApolloClient({
    link,
    cache: exports.cache,
});
react_dom_1.default.render(<client_1.ApolloProvider client={exports.client}>
    <react_router_dom_1.BrowserRouter>
      <react_1.default.StrictMode>
        <App_1.default />
      </react_1.default.StrictMode>
    </react_router_dom_1.BrowserRouter>
  </client_1.ApolloProvider>, document.getElementById("root"));
serviceWorker.unregister();
