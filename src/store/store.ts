import { configureStore } from "@reduxjs/toolkit";
import journalReducer from "./slices/journal-slice";
import friendsReducer from "./slices/friends-slice";
import tasksReducer from "./slices/tasks-slice"

export const store = configureStore({
  reducer: {
    journal: journalReducer,
    friends: friendsReducer,
    tasks: tasksReducer
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
