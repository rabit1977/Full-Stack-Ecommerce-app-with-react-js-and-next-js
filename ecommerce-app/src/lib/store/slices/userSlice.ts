import { User } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: User | null;
  users: User[];
}

// Constants
const CURRENT_USER_KEY = 'currentUser';
const USERS_KEY = 'users';

// Type guard for localStorage availability
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safe localStorage operations with error handling
 */
class StorageManager {
  private isAvailable = isLocalStorageAvailable();

  getItem<T>(key: string, fallback: T): T {
    if (!this.isAvailable) return fallback;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return fallback;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      // Handle quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn(
          'localStorage quota exceeded. Consider clearing old data.'
        );
      }
      return false;
    }
  }

  removeItem(key: string): boolean {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

const storage = new StorageManager();

/**
 * Load current user from localStorage
 */
const loadCurrentUser = (): User | null => {
  return storage.getItem<User | null>(CURRENT_USER_KEY, null);
};

/**
 * Load all users from localStorage
 */
const loadUsers = (): User[] => {
  return storage.getItem<User[]>(USERS_KEY, []);
};

/**
 * Save current user to localStorage
 */
const saveCurrentUser = (user: User | null): void => {
  if (user) {
    storage.setItem(CURRENT_USER_KEY, user);
  } else {
    storage.removeItem(CURRENT_USER_KEY);
  }
};

/**
 * Save all users to localStorage
 */
const saveUsers = (users: User[]): void => {
  storage.setItem(USERS_KEY, users);
};

/**
 * Helper: Update user in users array
 */
const updateUserInArray = (users: User[], updatedUser: User): User[] => {
  const index = users.findIndex((u) => u.id === updatedUser.id);

  if (index === -1) return users;

  const newUsers = [...users];
  newUsers[index] = updatedUser;
  return newUsers;
};

// Initial state
const initialState: UserState = {
  user: loadCurrentUser(),
  users: loadUsers(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Set current logged-in user
     */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      saveCurrentUser(action.payload);

      // Sync with users array
      if (action.payload) {
        state.users = updateUserInArray(state.users, action.payload);
        saveUsers(state.users);
      }
    },

    /**
     * Register a new user
     */
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      const existingIndex = state.users.findIndex(
        (u) => u.email === newUser.email || u.id === newUser.id
      );

      if (existingIndex !== -1) {
        // Update existing user
        state.users[existingIndex] = newUser;
      } else {
        // Add new user
        state.users.push(newUser);
      }

      saveUsers(state.users);
    },

    /**
     * Update current user data
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;

      // Create new user object (immutable update)
      const updatedUser = { ...state.user, ...action.payload };
      state.user = updatedUser;
      saveCurrentUser(updatedUser);

      // Sync with users array
      state.users = updateUserInArray(state.users, updatedUser);
      saveUsers(state.users);
    },

    /**
     * Replace all users (for admin or testing)
     */
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      saveUsers(action.payload);

      // Ensure current user is synced
      if (state.user) {
        const updatedCurrentUser = action.payload.find(
          (u) => u.id === state.user!.id
        );
        if (updatedCurrentUser) {
          state.user = updatedCurrentUser;
          saveCurrentUser(updatedCurrentUser);
        }
      }
    },

    /**
     * Toggle helpful review for current user
     */
    toggleHelpfulReview: (state, action: PayloadAction<string>) => {
      if (!state.user) return;

      const reviewId = action.payload;
      const helpfulReviews = state.user.helpfulReviews || [];
      const isAlreadyHelpful = helpfulReviews.includes(reviewId);

      // Create new user object with updated reviews
      const updatedUser: User = {
        ...state.user,
        helpfulReviews: isAlreadyHelpful
          ? helpfulReviews.filter((id) => id !== reviewId)
          : [...helpfulReviews, reviewId],
      };

      state.user = updatedUser;
      saveCurrentUser(updatedUser);

      // Sync with users array
      state.users = updateUserInArray(state.users, updatedUser);
      saveUsers(state.users);
    },

    /**
     * Logout current user
     */
    logout: (state) => {
      state.user = null;
      saveCurrentUser(null);
    },

    /**
     * Clear all users (for testing/reset)
     */
    clearUsers: (state) => {
      state.users = [];
      state.user = null;
      saveCurrentUser(null);
      saveUsers([]);
    },
  },
});

export const {
  setUser,
  addUser,
  updateUser,
  setUsers,
  toggleHelpfulReview,
  logout,
  clearUsers,
} = userSlice.actions;

export default userSlice.reducer;
