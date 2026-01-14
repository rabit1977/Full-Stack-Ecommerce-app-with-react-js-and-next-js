import { User } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * UserState - EPHEMERAL (no localStorage)
 * User data comes from next-auth session (source of truth)
 * This slice only manages UI state related to users
 */
interface UserState {
  /**
   * Cached user data from session (for UI convenience)
   * ⚠️ Always verify with useSession() for auth-critical operations
   */
  currentUser: User | null;

  /**
   * UI state for admin user management
   * (not persisted to database/localStorage)
   */
  selectedUser: User | null;
  isLoadingUsers: boolean;
  error: string | null;
}

/**
 * Initial state - starts empty, populated from next-auth session
 */
const initialState: UserState = {
  currentUser: null,
  selectedUser: null,
  isLoadingUsers: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Set current user from next-auth session
     * This is cached data for UI convenience only
     */
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.error = null;
    },

    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Set loading state for user operations
     */
    setIsLoadingUsers: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUsers = action.payload;
    },

    /**
     * Select a user for admin operations (UI state only)
     */
    selectUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    /**
     * Clear user session on logout
     */
    logout: (state) => {
      state.currentUser = null;
      state.selectedUser = null;
      state.error = null;
    },

    /**
     * Clear all user state
     */
    clearUserState: (state) => {
      state.currentUser = null;
      state.selectedUser = null;
      state.isLoadingUsers = false;
      state.error = null;
    },
  },
});

export const {
  setCurrentUser,
  setError,
  setIsLoadingUsers,
  selectUser,
  logout,
  clearUserState,
} = userSlice.actions;

export default userSlice.reducer;
