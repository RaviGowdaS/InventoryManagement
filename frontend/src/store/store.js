import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import itemSlice from './itemSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    items: itemSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// If you're using plain JavaScript, you don't need these type declarations
// These are TypeScript specific and will cause errors in a .js file