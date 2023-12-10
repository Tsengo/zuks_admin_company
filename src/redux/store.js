import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userRedux";
import productReducer from "./productRedux";
import productDb2Reducer from "./productDb2Redux";
import {createLogger} from 'redux-logger'
import {
  persistStore,
  persistReducer,
  PERSIST,
  FLUSH,
  REHYDRATE,
  PAUSE,
  REGISTER,
  PURGE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const logger =  createLogger({
  collapsed:true,
})
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  product_db2: productDb2Reducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    process.env.NODE_ENV === "development"
    ? getDefaultMiddleware().concat(logger) // Temporarily remove all middleware
    : getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  
});

export let persistor = persistStore(store);
