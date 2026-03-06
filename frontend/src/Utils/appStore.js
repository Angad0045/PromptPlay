import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { moviesApi } from "./Slices/moviesApi";
import UserReducer from "./Slices/UserSlice";

const appStore = configureStore({
  reducer: {
    user: UserReducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(moviesApi.middleware),
});

setupListeners(appStore.dispatch);
export default appStore;
