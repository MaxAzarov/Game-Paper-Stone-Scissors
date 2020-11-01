import user from "./user";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  user,
});

export type AppState = ReturnType<typeof reducers>;

export const store = createStore(reducers, composeEnhancers(applyMiddleware()));
