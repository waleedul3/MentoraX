import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import progressReducer from './slices/progressSlice';
import chatReducer from './slices/chatSlice';
import mentorReducer from './slices/mentorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    progress: progressReducer,
    chat: chatReducer,
    mentor: mentorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;