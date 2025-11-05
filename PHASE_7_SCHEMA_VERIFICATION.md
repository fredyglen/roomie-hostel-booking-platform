# Phase 7 Schema Verification - Property Views Table

**Date:** 2025-11-05  
**Protocol:** DATABASE_MIGRATION_PROTOCOL.md compliance  
**Status:** ✅ VERIFIED

---

## 🔍 Schema Verification Query

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'property_views' 
ORDER BY ordinal_position;
```

---

## 📊 Actual Database Schema

| Column Name       | Data Type                | Nullable | Default           |
|-------------------|--------------------------|----------|-------------------|
| id                | uuid                     | NO       | gen_random_uuid() |
| user_id           | uuid                     | NO       | null              |
| property_id       | uuid                     | NO       | null              |
| viewed_at         | timestamp with time zone | NO       | now()             |
| session_id        | text                     | YES      | null              |
| user_agent        | text                     | YES      | null              |
| ip_address        | inet                     | YES      | null              |
| view_duration     | integer                  | YES      | null              |
| source_page       | text                     | YES      | null              |
| device_type       | text                     | YES      | null              |
| created_at        | timestamp with time zone | YES      | now()             |
| viewed_hour_epoch | bigint                   | YES      | null              |

**Total Columns:** 12

---

## 🎯 Schema Analysis

### Core Fields:
- **id** (uuid, PK): Unique view identifier
- **user_id** (uuid, required): User who viewed (can be anonymous user ID)
- **property_id** (uuid, required): Property that was viewed
- **viewed_at** (timestamp, required, default now()): When view occurred

### Analytics Fields:
- **session_id** (text, optional): Browser session identifier
- **user_agent** (text, optional): Browser/device user agent string
- **ip_address** (inet, optional): IP address of viewer
- **view_duration** (integer, optional): How long user viewed (seconds)
- **source_page** (text, optional): Referrer/source page
- **device_type** (text, optional): Mobile/Desktop/Tablet
- **created_at** (timestamp, optional): Record creation time
- **viewed_hour_epoch** (bigint, optional): Hour-based epoch for analytics

### Key Features:
✅ **Comprehensive Tracking:** Captures detailed view analytics
✅ **Anonymous Support:** user_id can be anonymous session ID
✅ **Device Detection:** Tracks device type and user agent
✅ **Duration Tracking:** Can measure engagement time
✅ **Source Attribution:** Tracks where views came from
✅ **Time-Based Analytics:** viewed_hour_epoch for hourly aggregation

---

## 📝 TypeScript Type Definition

```typescript
export interface PropertyView {
  readonly id: string;
  readonly user_id: string; // Can be authenticated user or anonymous session ID
  readonly property_id: string;
  readonly viewed_at: string;
  readonly session_id?: string | null;
  readonly user_agent?: string | null;
  readonly ip_address?: string | null;
  readonly view_duration?: number | null;
  readonly source_page?: string | null;
  readonly device_type?: 'mobile' | 'tablet' | 'desktop' | null;
  readonly created_at?: string | null;
  readonly viewed_hour_epoch?: number | null;
}

export interface PropertyViewInsert {
  user_id: string; // Required: authenticated user ID or anonymous session ID
  property_id: string; // Required: property being viewed
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  view_duration?: number;
  source_page?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
}

export interface PropertyViewAnalytics {
  total_views: number;
  unique_viewers: number;
  avg_view_duration: number;
  views_by_device: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  views_by_hour: Array<{
    hour: number;
    count: number;
  }>;
}
```

---

## 🔧 Implementation Plan

### 1. Create Hook (`src/hooks/usePropertyViews.ts`):
- `useTrackPropertyView(propertyId, userId)` - Track view when component mounts
- `usePropertyViewAnalytics(propertyId)` - Get analytics for property
- Auto-detect device type from user agent
- Generate anonymous session ID if user not authenticated
- Track view duration using useEffect cleanup

### 2. Update Components:
- `PropertyDetailDesktop.tsx` - Add view tracking on mount
- `PropertyDetailModal.tsx` - Add view tracking on mount
- Track both authenticated and anonymous users

### 3. Analytics Integration:
- Update owner analytics to show real view data
- Display view counts on property cards
- Show view trends in admin dashboard

### 4. Device Detection:
- Detect mobile/tablet/desktop from window.innerWidth
- Capture user agent string
- Store device type for analytics

---

## ⚠️ Critical Notes

1. **Use Exact Column Names:**
   - Database uses `user_id` (not `viewer_id`)
   - Database uses `viewed_at` (not `view_time` or `timestamp`)
   - Database uses `view_duration` (not `duration_seconds`)
   - Database uses `device_type` (not `device`)

2. **Anonymous User Handling:**
   - If user not authenticated, generate session-based anonymous ID
   - Store in localStorage for consistency across page views
   - Format: `anon_${sessionId}`

3. **View Duration Tracking:**
   - Start timer when component mounts
   - Update duration on component unmount
   - Use useEffect cleanup function

4. **Privacy Considerations:**
   - IP address should be anonymized (last octet masked)
   - User agent stored for analytics only
   - Comply with privacy regulations

5. **Performance:**
   - Track view asynchronously (don't block UI)
   - Debounce rapid view events
   - Use fire-and-forget pattern (no loading states)

---

## 🚀 Next Steps

1. ✅ Schema verified and documented
2. ⏳ Create `usePropertyViews.ts` hook
3. ⏳ Add tracking to PropertyDetailDesktop
4. ⏳ Add tracking to PropertyDetailModal
5. ⏳ Update analytics queries
6. ⏳ Test view tracking
7. ⏳ Commit Phase 7

**Estimated Time:** 2 hours

