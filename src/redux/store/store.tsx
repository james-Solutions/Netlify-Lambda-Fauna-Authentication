import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "../slices/serverSlice";

export const store = configureStore({
  reducer: {
    server: serverReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
