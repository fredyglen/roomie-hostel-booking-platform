# Phase 6 Schema Verification - Notifications Table

**Date:** 2025-11-05  
**Protocol:** DATABASE_MIGRATION_PROTOCOL.md compliance  
**Status:** ✅ VERIFIED

---

## 🔍 Schema Verification Query

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
```

---

## 📊 Actual Database Schema

| Column Name | Data Type                | Nullable | Default           |
|-------------|--------------------------|----------|-------------------|
| id          | uuid                     | NO       | gen_random_uuid() |
| created_at  | timestamp with time zone | NO       | now()             |
| updated_at  | timestamp with time zone | NO       | now()             |
| user_id     | uuid                     | NO       | null              |
| title       | text                     | NO       | null              |
| message     | text                     | NO       | null              |
| type        | character varying        | NO       | null              |
| read        | boolean                  | NO       | false             |
| data        | jsonb                    | YES      | '{}'::jsonb       |

**Total Columns:** 9

---

## 🎯 Schema Analysis

### Core Fields:
- **id** (uuid, PK): Unique notification identifier
- **created_at** (timestamp): When notification was created
- **updated_at** (timestamp): Last update timestamp
- **user_id** (uuid, FK): Target user for notification

### Notification Content:
- **title** (text, required): Notification headline
- **message** (text, required): Notification body text
- **type** (varchar, required): Notification category/type
- **read** (boolean, default false): Read status flag
- **data** (jsonb, optional): Additional metadata/context

### Key Features:
✅ **Simple Schema:** Clean, focused design
✅ **Read Tracking:** Boolean flag for read/unread status
✅ **Flexible Data:** JSONB field for custom metadata
✅ **Type System:** Categorize notifications by type
✅ **Timestamps:** Track creation and updates

---

## 📝 TypeScript Type Definition

```typescript
export interface Notification {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly user_id: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly read: boolean;
  readonly data?: Record<string, unknown> | null;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payment_failed'
  | 'property_approved'
  | 'property_rejected'
  | 'review_received'
  | 'message_received'
  | 'system_announcement';

export interface NotificationInsert {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}

export interface NotificationUpdate {
  read?: boolean;
  updated_at?: string;
}
```

---

## 🔧 Implementation Plan

### 1. Create Hooks (`src/hooks/useNotifications.ts`):
- `useNotifications(userId)` - Get all notifications for user
- `useUnreadCount(userId)` - Get count of unread notifications
- `useMarkAsRead(notificationId)` - Mark single notification as read
- `useMarkAllAsRead(userId)` - Mark all notifications as read
- `useSendNotification()` - Create new notification
- `useNotificationSubscription(userId)` - Real-time subscription

### 2. Create Components:
- `NotificationBell.tsx` - Bell icon with unread count badge
- `NotificationDropdown.tsx` - Dropdown list of recent notifications
- `NotificationsList.tsx` - Full page list of all notifications
- `NotificationItem.tsx` - Individual notification card

### 3. Integration Points:
- Add NotificationBell to Student/Owner/Admin headers
- Trigger notifications after:
  - Booking confirmation
  - Payment completion
  - Property approval/rejection
  - Review submission
  - System announcements

### 4. Real-Time Features:
- Supabase real-time subscription for instant updates
- Auto-refresh unread count
- Toast notifications for new notifications
- Sound/visual alerts (optional)

---

## ⚠️ Critical Notes

1. **Use Exact Column Names:**
   - Database uses `read` (not `is_read` or `read_status`)
   - Database uses `user_id` (not `recipient_id`)
   - Database uses `type` (not `notification_type`)

2. **Type Field Values:**
   - Need to verify what type values are currently in use
   - Suggest standardized enum for consistency

3. **Data Field Usage:**
   - JSONB allows flexible metadata
   - Examples: `{ property_id, booking_id, amount, etc. }`
   - Should document common data structures

4. **Real-Time Subscription:**
   - Filter by `user_id` to only receive user's notifications
   - Listen for INSERT events for new notifications
   - Listen for UPDATE events for read status changes

---

## 🚀 Next Steps

1. ✅ Schema verified and documented
2. ⏳ Create `useNotifications.ts` hooks
3. ⏳ Create notification UI components
4. ⏳ Integrate with existing flows
5. ⏳ Test real-time subscriptions
6. ⏳ Commit Phase 6

**Estimated Time:** 6 hours

