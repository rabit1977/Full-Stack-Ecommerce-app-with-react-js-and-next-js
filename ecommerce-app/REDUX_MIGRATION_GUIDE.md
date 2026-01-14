# Redux to Database Migration Guide

## Current Status

Your project is in a **hybrid state** between Redux + localStorage and a full-stack database-driven architecture.

### What's Fixed ✅

- **productSlice.ts** - Removed `initialProducts` dependency, now uses database via Server Actions
- **products-data-table.tsx** - Updated to use the newer `@/actions/product-actions` (Prisma-based)

### Redux Store Structure

#### **Slices That Should Keep localStorage:**

1. **cartSlice.ts** ✅ KEEP - User session data
   - Purpose: Quick access to shopping cart
   - Storage: Redux + localStorage
   - Why: Ephemeral user session, offline support

2. **wishlistSlice.ts** ⚠️ HYBRID - Can be improved
   - Purpose: Saved favorite items
   - Current: Stores only IDs, minimal localStorage
   - Suggestion: Keep for now, OR sync with user account if logged in

#### **Slices That Should Use Database:**

1. **productSlice.ts** ✅ REFACTORED
   - OLD: Loaded from `initialProducts` constant
   - NEW: Fetched via `getProductsAction` from database
   - Status: Now ephemeral state (resets on refresh)
   - Actions: Only used for optimistic updates

2. **orderSlice.ts** ⚠️ CHECK NEEDED
   - Should be fetched from database via Server Actions
   - Not persisted in localStorage

3. **userSlice.ts** ⚠️ CHECK NEEDED
   - Should be fetched from next-auth session
   - Not persisted in localStorage

4. **uiSlice.ts** ✅ FINE
   - UI state: theme, filters, loading states
   - No database sync needed

---

## What to Do Next

### Step 1: Remove Old Product Actions File

```bash
# The old file is unused - all imports use @/actions/product-actions instead
rm src/lib/actions/product-actions.ts
```

### Step 2: Verify Cart & Wishlist Integration

#### For Cart:

- Check if cart is synced to database (especially on checkout)
- Consider: Should cart persist across logins?

#### For Wishlist:

- If logged in: Sync wishlist with user account
- If not logged in: Keep localStorage
- Current implementation stores only IDs

### Step 3: Audit thunks/

Check each thunk to ensure it:

- Uses Server Actions (not localStorage)
- Has proper error handling
- Doesn't reference deleted imports

**Files to check:**

```
src/lib/store/thunks/
├── authThunks.ts
├── cartThunks.ts          ✅ Uses localStorage intentionally
├── managementThunks.ts
├── orderThunks.ts         ⚠️ Should use database
├── productThunks.ts       ✅ Now uses getProductByIdAction
├── uiThunks.ts            ✅ UI state only
└── wishlistThunks.ts      ⚠️ Should integrate with database
```

### Step 4: Check which slices actually persist

In `store.ts`, the `persistConfig` whitelist is:

```typescript
whitelist: ['cart', 'wishlist', 'user', 'orders'];
```

**These should be:**

- `cart` ✅ - User session ephemeral
- `wishlist` ⚠️ - Consider database sync if user logged in
- `user` ⚠️ - Should come from next-auth, not Redux
- `orders` ✅ - Fetched from database on load

---

## Migration Strategy

### Don't Store in Redux + localStorage if:

- ❌ Products (fetch from database)
- ❌ Reviews (fetch from database)
- ❌ Orders (fetch from database, restore on login)
- ❌ User profile (use next-auth session)

### DO Store in Redux + localStorage if:

- ✅ Shopping cart (ephemeral, user session)
- ✅ Wishlist (ephemeral user preference, OR sync to account)
- ✅ UI state (theme, sorting, filters)

---

## File Organization

### To Delete:

```
src/lib/actions/product-actions.ts  ← OLD, UNUSED
src/lib/constants/products.ts      ← DOESN'T EXIST (caused build error)
```

### To Keep (Working):

```
src/actions/product-actions.ts     ← NEW, PRISMA-BASED ✅
src/lib/data/get-products.ts       ← Helper functions ✅
src/lib/store/                     ← Redux state
```

---

## Server Actions in Use

Your app already uses these correctly:

**In `src/actions/product-actions.ts`:**

- `getProductsAction()` - Fetch with filters/pagination
- `getProductByIdAction()` - Single product
- `getProductsByIdsAction()` - Cart/wishlist products
- `getFiltersAction()` - Categories/brands
- `createProductAction()` - Admin create
- `updateProductAction()` - Admin update
- `deleteProductAction()` - Admin delete
- `getRelatedProducts()` - Similar products

These are already being called from:

- Pages: `(home)/page.tsx`, `products/page.tsx`
- Components: `ProductDetailContent.tsx`
- Thunks: `productThunks.ts`

---

## Next.js 15 SSR Best Practices

1. **Server Actions for Data:** Already using ✅
2. **Redux for Client State:** Already using ✅
3. **Session from next-auth:** Check `userSlice.ts`
4. **No localStorage for Data:** Switch to database queries ✅

---

## Summary

| Component       | Current               | Recommendation                 | Status    |
| --------------- | --------------------- | ------------------------------ | --------- |
| **Products**    | DB via Server Actions | Keep as is                     | ✅ Fixed  |
| **Cart**        | localStorage + Redux  | Keep as is                     | ✅ Good   |
| **Wishlist**    | localStorage + Redux  | Sync with account if logged in | ⚠️ Review |
| **Orders**      | Should be DB          | Verify in `orderSlice.ts`      | ⚠️ Check  |
| **User**        | Should be next-auth   | Verify in `userSlice.ts`       | ⚠️ Check  |
| **Old Actions** | `src/lib/actions/`    | Delete                         | 🗑️ Ready  |
