import { createUserAction, deleteUserAction, signupAction, updateUserAction } from '@/actions/auth-actions';
import { clearWishlistAction } from '@/actions/wishlist-actions';
import { User } from '@/lib/types';
import { UserRole } from '@prisma/client';
import { signIn, signOut } from 'next-auth/react';
import { clearCart } from '../slices/cartSlice';
import { clearOrders } from '../slices/orderSlice';
import {
  addUser,
  logout as logoutAction,
  setUser,
  setUsers,
} from '../slices/userSlice';
import { clearWishlist } from '../slices/wishlistSlice';
import { AppDispatch, RootState } from '../store';
import { showToast } from './uiThunks';

// Type for thunk results
interface ThunkResult {
  success: boolean;
  message?: string;
}

// Helper function for ID generation
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Login user with email and password
 * WARNING: Demo only - never handle authentication client-side in production
 */
export const login =
  (email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<ThunkResult> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        dispatch(showToast('Invalid email or password', 'error'));
        return { success: false, message: 'Invalid credentials' };
      }

      dispatch(showToast('Login successful!', 'success'));
      // User state will be updated by AuthSyncProvider
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Login failed' };
    }
  };

/**
 * Sign up new user
 */
export const signup =
  (name: string, email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<ThunkResult> => {
    try {
      const result = await signupAction(name, email, password);

      if (!result.success) {
        dispatch(showToast(result.message || 'Signup failed', 'error'));
        return result;
      }

      dispatch(showToast(`Account created! Logging in...`, 'success'));

      // Auto login
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Signup failed' };
    }
  };

/**
 * Update user from admin panel
 */
export const updateUserFromAdmin =
  (
    userId: string,
    values: {
      name: string;
      email: string;
      role: UserRole;
      password?: string;
    }
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<ThunkResult> => {
    const { users, user: currentUser } = getState().user;
    
    try {
      const result = await updateUserAction(userId, values);

      if (!result.success || !result.user) {
        dispatch(showToast(result.message || 'Failed to update user.', 'error'));
        return { success: false, message: result.message };
      }
      
      const updatedUser = result.user;

      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, ...updatedUser } : u
      );

      dispatch(setUsers(updatedUsers));

      if (currentUser?.id === userId) {
        dispatch(setUser({ ...currentUser, ...updatedUser }));
      }

      dispatch(showToast(`User ${values.name} updated successfully!`, 'success'));
      return { success: true };

    } catch (error) {
      dispatch(showToast('An unexpected error occurred.', 'error'));
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

/**
 * Delete user from admin panel
 */
export const deleteUserFromAdmin =
  (userId: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<ThunkResult> => {
    const { users, user: currentUser } = getState().user;

    // Prevent deleting yourself
    if (currentUser?.id === userId) {
      dispatch(showToast('You cannot delete your own account.', 'error'));
      return { success: false, message: 'Cannot delete own account.' };
    }

    try {
      const result = await deleteUserAction(userId);

      if (!result.success) {
        dispatch(showToast(result.message || 'Failed to delete user.', 'error'));
        return { success: false, message: result.message };
      }

      const updatedUsers = users.filter((u) => u.id !== userId);
      dispatch(setUsers(updatedUsers));
      dispatch(showToast('User deleted successfully!', 'success'));
      return { success: true };

    } catch (error) {
      dispatch(showToast('An unexpected error occurred.', 'error'));
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

/**
 * Create user from admin panel
 */
export const createUserFromAdmin =
  (
    name: string,
    email: string,
    password: string,
    role: UserRole // ✅ Changed to UserRole
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<ThunkResult> => {
    
    try {
      const result = await createUserAction(name, email, password, role);

      if (!result.success || !result.user) {
        dispatch(showToast(result.message || 'Failed to create user.', 'error'));
        return { success: false, message: result.message };
      }
      
      const newUser = result.user;

      dispatch(addUser(newUser as User));
      dispatch(showToast(`User ${name} created successfully!`, 'success'));

      return { success: true };

    } catch (error) {
      dispatch(showToast('An unexpected error occurred.', 'error'));
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

/**
 * Logout current user
 */
export const logout =
  () =>
  async (dispatch: AppDispatch): Promise<ThunkResult> => {
    await signOut({ redirect: false });
    dispatch(logoutAction());
    dispatch(clearCart());
    await clearWishlistAction();
    dispatch(clearWishlist());
    dispatch(clearOrders());
    dispatch(showToast("You've been logged out.", 'info'));

    return { success: true };
  };
