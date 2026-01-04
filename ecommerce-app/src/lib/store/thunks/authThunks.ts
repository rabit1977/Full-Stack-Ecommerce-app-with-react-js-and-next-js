import { signupAction } from '@/actions/auth-actions';
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
      role: UserRole; // ✅ Changed from 'admin' | 'customer' to UserRole
      password?: string;
    }
  ) =>
  (dispatch: AppDispatch, getState: () => RootState): ThunkResult => {
    const { users, user: currentUser } = getState().user;
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      dispatch(showToast('User not found.', 'error'));
      return { success: false, message: 'User not found.' };
    }

    // Check if email is already taken by another user
    if (users.some((u) => u.email === values.email && u.id !== userId)) {
      dispatch(
        showToast('An account with this email already exists.', 'error')
      );
      return { success: false, message: 'Email already exists.' };
    }

    const updatedUser: User = {
      ...users[userIndex],
      name: values.name,
      email: values.email,
      role: values.role, // ✅ Directly use the role - it's already the correct type
      ...(values.password && { password: values.password }),
    };

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;

    dispatch(setUsers(updatedUsers));

    // If updating current logged-in user, update them too
    if (currentUser?.id === userId) {
      dispatch(setUser(updatedUser));
    }

    dispatch(showToast(`User ${values.name} updated successfully!`, 'success'));

    return { success: true };
  };

/**
 * Delete user from admin panel
 */
export const deleteUserFromAdmin =
  (userId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): ThunkResult => {
    const { users, user: currentUser } = getState().user;

    // Prevent deleting yourself
    if (currentUser?.id === userId) {
      dispatch(showToast('You cannot delete your own account.', 'error'));
      return { success: false, message: 'Cannot delete own account.' };
    }

    const updatedUsers = users.filter((u) => u.id !== userId);
    dispatch(setUsers(updatedUsers));
    dispatch(showToast('User deleted successfully!', 'success'));

    return { success: true };
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
  (dispatch: AppDispatch, getState: () => RootState): ThunkResult => {
    const { users } = getState().user;

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      dispatch(
        showToast('An account with this email already exists.', 'error')
      );
      return { success: false, message: 'Email already exists.' };
    }

    const newUser: User = {
      id: generateUserId(),
      name,
      email,
      password,
      role: role, // ✅ Directly use the role
      cart: [],
      savedForLater: [],
      wishlist: [],
      helpfulReviews: [],
      createdAt: new Date().toISOString(),
    };

    dispatch(addUser(newUser));
    dispatch(showToast(`User ${name} created successfully!`, 'success'));

    return { success: true };
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
