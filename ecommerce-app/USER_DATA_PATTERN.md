# User Data Management - Correct Pattern

## ❌ **WRONG** (What You Had)

```typescript
// Storing user in localStorage + Redux
import { User } from '@prisma/client';

userSlice.ts:
- Save to localStorage on every change
- Load from localStorage on startup
- Try to keep Redux + localStorage in sync

❌ Problems:
- Stale data (changes in DB don't sync)
- Duplicates data source (DB + localStorage)
- Security risk (user data in localStorage)
- Complex sync logic
```

## ✅ **CORRECT** (What You Need)

```typescript
// User data flows from: next-auth session → Redux (cached) → Database
App Component:
├─ const { data: session } = useSession()  ← Get current user
├─ dispatch(setCurrentUser(session?.user))  ← Cache in Redux for UI
└─ Update action calls Server Action
   ↓
Server Action (updateUserAction):
├─ Check session auth
├─ Update Prisma
├─ Return updated user
└─ Component dispatches setCurrentUser()

✅ Benefits:
- Single source of truth (database)
- Automatic sync (session-based)
- Secure (no localStorage)
- Simple (Redux is just cache)
```

---

## **Implementation Guide**

### Step 1: Get Current User (In Component)

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setCurrentUser } from '@/lib/store/slices/userSlice';
import { useEffect } from 'react';

export function MyComponent() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Sync session to Redux on change
  useEffect(() => {
    if (session?.user) {
      dispatch(setCurrentUser(session.user));
    }
  }, [session, dispatch]);

  // Now Redux.user.currentUser has the user data
}
```

### Step 2: Update User (Server Action)

```typescript
// src/actions/user-actions.ts
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export async function updateUserAction(data: {
  name?: string;
  email?: string;
  bio?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Not authenticated');
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return updatedUser;
}
```

### Step 3: Update Component

```typescript
'use client';

import { updateUserAction } from '@/actions/user-actions';
import { setCurrentUser } from '@/lib/store/slices/userSlice';

export function EditProfileForm() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (formData: FormData) => {
    try {
      const updated = await updateUserAction({
        name: formData.get('name') as string,
        bio: formData.get('bio') as string,
      });

      // Update Redux cache
      dispatch(setCurrentUser(updated));
    } catch (error) {
      console.error('Failed to update', error);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## **What Removed from userSlice**

| Removed                | Why                                 |
| ---------------------- | ----------------------------------- |
| `localStorage` logic   | Use next-auth session instead       |
| `StorageManager` class | Not needed                          |
| `saveCurrentUser()`    | Database is source of truth         |
| `loadCurrentUser()`    | Session provides this               |
| `users` array          | Fetch as needed with Server Actions |
| `toggleHelpfulReview`  | Manage via server                   |

---

## **Updated userSlice Reducers**

### What to Keep

```typescript
setCurrentUser()      ← Cache session user for UI
setError()           ← Error messages
setIsLoadingUsers()  ← Loading state for admin
selectUser()         ← UI state for admin selection
logout()             ← Clear on signout
clearUserState()     ← Reset all state
```

### What NOT to Do

```typescript
❌ Save/load from localStorage
❌ Try to keep multiple user arrays
❌ Manage user creation/deletion in Redux
```

---

## **Data Flow Diagram**

```
┌─────────────────────────────────────────┐
│ next-auth Session                        │
│ (session.user = User from database)      │
└────────────┬────────────────────────────┘
             │
             │ useSession() hook
             ↓
┌─────────────────────────────────────────┐
│ Component                                │
│ dispatch(setCurrentUser(session.user))   │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│ Redux userSlice                          │
│ state.currentUser (CACHED for UI)        │
└────────────┬────────────────────────────┘
             │
             │ Component calls Server Action
             ↓
┌─────────────────────────────────────────┐
│ Server Action (updateUserAction)         │
│ - Check session auth                     │
│ - Update Prisma                          │
│ - Return updated user                    │
└────────────┬────────────────────────────┘
             │
             │ Returns updated User
             ↓
┌─────────────────────────────────────────┐
│ Component                                │
│ dispatch(setCurrentUser(updated))        │
└─────────────────────────────────────────┘
```

---

## **Summary: When to Use What**

| Need                   | Use                           |
| ---------------------- | ----------------------------- |
| Get current user       | `useSession()` hook           |
| Cache for UI           | Redux `currentUser`           |
| Update user            | Server Action                 |
| Admin user list        | Server Action + fetch         |
| User state persistence | next-auth session (automatic) |
| UI preferences         | localStorage (NOT user data)  |

**Key Point:** localStorage is ONLY for UI preferences (theme, filters), not for user account data! 🔐
