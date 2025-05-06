import { configureStore } from "@reduxjs/toolkit";
import authAPI from '../features/auth/authAPI';

const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
