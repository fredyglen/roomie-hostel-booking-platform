import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';

export type OwnerSettingsMap = Record<string, {
  wifi_included: boolean | null;
  utilities_included: boolean | null;
  minutes_to_campus: number | null;
  minutes_to_campus_mode: 'walk' | 'drive' | null;
}>;

/**
 * Fetch owner_settings for a set of owner IDs and return a mapping for quick lookups
 * Uses exact DB fields: owner_id, wifi_included, utilities_included, minutes_to_campus, minutes_to_campus_mode
 */
export function useOwnerSettingsByOwnerIds(ownerIds: string[]) {
  return useQuery({
    queryKey: ['owner_settings_by_owner_ids', ownerIds.sort().join(',')],
    enabled: ownerIds.length > 0,
    queryFn: async (): Promise<OwnerSettingsMap> => {
      const { data, error } = await supabase
        .from('owner_settings')
        .select('owner_id,wifi_included,utilities_included,minutes_to_campus,minutes_to_campus_mode')
        .in('owner_id', ownerIds);

      if (error) throw error;

      const map: OwnerSettingsMap = {};
      for (const row of data || []) {
        map[(row as any).owner_id as string] = {
          wifi_included: (row as any).wifi_included ?? null,
          utilities_included: (row as any).utilities_included ?? null,
          minutes_to_campus: (row as any).minutes_to_campus ?? null,
          minutes_to_campus_mode: ((row as any).minutes_to_campus_mode ?? null) as 'walk' | 'drive' | null,
        };
      }
      return map;
    },
    staleTime: 5 * 60 * 1000,
  });
}

