import { Property } from '@/types/property';

export interface ProximityInput {
  userCity?: string;
  userState?: string;
}

/**
 * Buckets: same city > same state > others. Within each bucket, newest first.
 * Pure and stable function for easy testing.
 */
export function rankByProximity(properties: readonly Property[], input: ProximityInput = {}): Property[] {
  const norm = (v?: string | null) => (v || '').trim().toLowerCase();
  const userCity = norm(input.userCity);
  const userState = norm(input.userState);

  const bucketOf = (p: Property): number => {
    const city = norm(p.city as any);
    const state = norm(p.state as any);
    if (userCity && city && city === userCity) return 0;
    if (userState && state && state === userState) return 1;
    return 2;
  };

  const createdAtOf = (p: Property): number => {
    const created = (p.created_at || (p as any).createdAt) as string | undefined;
    const updated = (p.updated_at || (p as any).updatedAt) as string | undefined;
    const d = created || updated;
    return d ? Date.parse(d) : 0;
  };

  return [...properties].sort((a, b) => {
    const ba = bucketOf(a);
    const bb = bucketOf(b);
    if (ba !== bb) return ba - bb;
    return createdAtOf(b) - createdAtOf(a);
  });
}

