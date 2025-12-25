import { userFormSchema } from '@/lib/schemas/user-schema';
import { User } from '@/lib/types';

/**
 * Action result type
 */
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Constants
 */
const USERS_KEY = 'users';

/**
 * Get users from localStorage
 */
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];

  try {
    const item = localStorage.getItem(USERS_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error(`Error reading ${USERS_KEY} from localStorage:`, error);
    return [];
  }
};

/**
 * Save users to localStorage
 */
const saveUsers = (users: User[]): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error(`Error writing ${USERS_KEY} to localStorage:`, error);
    return false;
  }
};

/**
 * Update an existing user
 */
export async function updateUser(
  userId: string,
  data: { name: string; email: string; role: 'admin' | 'customer'; password?: string }
): Promise<ActionResult<User>> {
  try {
    // Validate input
    const validatedFields = userFormSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0]?.message || 'Invalid fields!',
      };
    }

    const { name, email, role, password } = validatedFields.data;

    // Get users from localStorage
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found!',
      };
    }

    // Check if email is already taken by another user
    const emailExists = users.some(
      (u) => u.email === email && u.id !== userId
    );

    if (emailExists) {
      return {
        success: false,
        error: 'Email is already in use by another user!',
      };
    }

    // Update user while preserving other fields
    const updatedUser: User = {
      ...users[userIndex],
      name,
      email,
      role,
      updatedAt: new Date().toISOString(),
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updatedUser.password = password;
    }

    users[userIndex] = updatedUser;

    // Save users to localStorage
    const saved = saveUsers(users);

    if (!saved) {
      return {
        success: false,
        error: 'Failed to save user data.',
      };
    }

    // Also update current user if it's the same user
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === userId) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: 'Failed to update user. Please try again.',
    };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    const users = getUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return {
        success: false,
        error: 'User not found!',
      };
    }

    users.splice(index, 1);
    const saved = saveUsers(users);

    if (!saved) {
      return {
        success: false,
        error: 'Failed to save changes.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: 'Failed to delete user. Please try again.',
    };
  }
}
