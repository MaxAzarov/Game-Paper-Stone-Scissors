import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  InMemoryCache,
  split,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

import * as serviceWorker from "./serviceWorker";
import App from "./App";

const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("token"),
    },
  },
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

let link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
    }
    if (networkError)
      console.error(`[Network error]: ${networkError}`, networkError.stack);
  }),
  authLink,
  split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  ),
]);

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link,
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.unregister();
