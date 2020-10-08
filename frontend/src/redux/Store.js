import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducers/RootReducer";

const persistConfig = {
  key: "token",
  storage: storage,
  whitelist: ["token", "user", "config"] // which reducer want to store
};

const pReducer = persistReducer(persistConfig, rootReducer);
// const middleware = applyMiddleware(thunk, logger); //logger

const store = createStore(pReducer);
const persistor = persistStore(store);

export { store, persistor };
