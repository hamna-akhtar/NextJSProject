import { configureStore } from "@reduxjs/toolkit";
import journalReducer from "./slices/journal-slice";
import friendsReducer from "./slices/friends-slice";

export const store = configureStore({
  reducer: {
    journal: journalReducer,
    friends: friendsReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
