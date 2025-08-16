import { configureStore } from '@reduxjs/toolkit';
import interfaceStatus_slice from '@slices/interfaceStatus_slice';

export const store = configureStore({
  reducer: {
    InterfaceStatus: interfaceStatus_slice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
