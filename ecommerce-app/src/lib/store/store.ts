import { configureStore } from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
    type Storage,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer, { type RootState } from './rootReducer';

/**
 * Create no-op storage for SSR environments (Next.js, etc.)
 */
const createNoopStorage = (): Storage => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: (_: string) => Promise.resolve(null),
  setItem: (_: string, value: string) => Promise.resolve(value),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: (_: string) => Promise.resolve(),
});

/**
 * Get appropriate storage based on environment
 */
const getStorage = (): Storage => {
  return typeof window !== 'undefined' ? storage : createNoopStorage();
};

/**
 * Persist configuration
 * Only persist cart, wishlist, and user data
 */
const persistConfig = {
  key: 'root',
  storage: getStorage(),
  whitelist: ['cart', 'wishlist', 'user', 'orders'], // Remove 'as const' to fix type issue
  version: 1,
  timeout: 10000,
 
};

/**
 * Create persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Redux store with middleware and DevTools
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Optionally ignore Date objects in your state
        // ignoredActionPaths: ['payload.date'],
        // ignoredPaths: ['orders.items.date'],
      },
      // Enable immutability check only in development
      immutableCheck: process.env.NODE_ENV === 'development',
    }),
  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'E-Commerce Store',
    trace: true, // Enable action stack traces
    traceLimit: 25,
  },
});

/**
 * Create persistor for redux-persist
 */
export const persistor = persistStore(store);

/**
 * Export types for use throughout the app
 */
export type AppDispatch = typeof store.dispatch;
export type { RootState };

/**
 * Optional: Export store state type from store directly
 * This ensures type consistency
 */
export type AppStore = typeof store;
