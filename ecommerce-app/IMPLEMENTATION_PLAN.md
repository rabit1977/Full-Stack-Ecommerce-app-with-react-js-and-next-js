# Admin Implementation Plan & Missing Features

This document outlines the features defined in the `prisma.schema` that are currently missing or incomplete in the Admin Panel implementation.

## 1. Inventory Management (High Priority)
**Schema Model:** `InventoryLog`, `Product` (stock)
**Current State:**
- Product form allows setting stock number.
- `InventoryLog` model is defined but unused.
- No history of stock changes (who changed it, when, why).

**Missing Features:**
- **Inventory Audit Log**: A dedicated page or tab in Product Details to view the history of stock changes (`InventoryLog`).
- **Stock Adjustment UI**: A modal/form to manually adjust stock with a "reason" (Restock, Damage, Correction) which creates an entry in `InventoryLog`.

## 2. Notification System (High Priority)
**Schema Model:** `Notification`, `NotificationType`
**Current State:**
- Backend actions (`createNotificationAction`, `createBulkNotificationsAction`) exist.
- User-facing notification list exists.
- **Admin UI is completely missing**.

**Missing Features:**
- **Notification Manager**: An admin page to view all system notifications.
- **Broadcast Tool**: Admin UI to send a notification to:
    - A specific user (search by email/ID).
    - All users (Bulk action).
    - All subscribers/customers (Segmented).
- **Trigger Management**: (Optional) UI to configure automatic notifications (e.g., "Welcome message").

## 3. Product Bundles & Relations (Medium Priority)
**Schema Model:** `BundleItem`, `ProductRelation`
**Current State:**
- Product form has no section for Bundles or Related Products.
- Schema supports "Frequently Bought Together", "Similar", and "Bundles".

**Missing Features:**
- **Bundle Editor**: In Product Form, a section to select other products to create a bundle (if `isBundle` is true).
- **Cross-Sell/Upsell Manager**: In Product Form, a section to manually link "Related Products" (or allow auto-generation logic).

## 4. Advanced Analytics (Medium Priority)
**Schema Model:** `AnalyticsEvent`, `SearchHistory`, `RecentlyViewed`
**Current State:**
- Dashboard shows basic counters (Orders, Users, Revenue).
- `AnalyticsEvent` table exists but allows for much richer data.

**Missing Features:**
- **Traffic Dashboard**: A page showing Page Views, Unique Visitors (from `AnalyticsEvent`).
- **Search Insights**: A page showing top search queries (`SearchHistory`) to identify what users are looking for but not finding.
- **Sales Funnel**: Visualizing Add to Cart -> Checkout -> Purchase conversion rates.

## 5. Subscriptions (Memberships) (Low Priority)
**Schema Model:** `Subscription` (Billing, Interval, Status)
**Current State:**
- Schema supports complex recurring billing (Stripe-like model).
- Codebase only seems to use "Newsletter" style subscriptions, or is unimplemented for Paid Memberships.

**Missing Features:**
- **Plans Management**: Admin UI to create Subscription Plans (Gold, Silver, etc.).
- **Subscriber List**: Admin view of active paid subscribers.

## 6. Audit & Activity Logs (Maintenance)
**Schema Model:** `ActivityLog`
**Current State:**
- Basic `activity-logs.tsx` component exists.
- Need to ensure **ALL** admin actions (Settings change, Product delete, User ban) trigger an `ActivityLog` entry.

## 7. Shipping Management (Medium Priority)
**Schema Model:** `ShippingZone`, `ShippingRate`
**Current State:**
- `shipping` folder exists in admin.
- Likely implemented, but needs verification of complexity (Weight-based vs Price-based rules).

---

## Action Plan (Next Steps)

1.  **Implement Admin Notification Center**: allow admins to blast updates to users.
2.  **Enhance Product Form**: Add "Bundles" and "Related Products" tabs.
3.  **Build Inventory History Details**: Add a history view to the Product Edit page.
4.  **Create "Reports" Section**: For Search History and Traffic analytics.
