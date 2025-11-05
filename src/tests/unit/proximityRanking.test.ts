import { describe, it, expect } from 'vitest';
import { rankByProximity } from '@/utils/proximityRanking';

const mk = (overrides: any = {}) => ({
  id: Math.random().toString(36).slice(2),
  title: overrides.title || 'P',
  city: overrides.city || 'Accra',
  state: overrides.state || 'Greater Accra',
  created_at: overrides.created_at || new Date().toISOString(),
});

describe('rankByProximity', () => {
  it('buckets by city then state and sorts newest first within bucket', () => {
    const now = Date.now();
    const props = [
      mk({ title: 'A-old', city: 'Accra', created_at: new Date(now - 2000).toISOString()}),
      mk({ title: 'A-new', city: 'Accra', created_at: new Date(now - 1000).toISOString()}),
      mk({ title: 'Kumasi', city: 'Kumasi', state: 'Ashanti', created_at: new Date(now - 5000).toISOString()}),
      mk({ title: 'Cape Coast', city: 'Cape Coast', state: 'Central', created_at: new Date(now - 3000).toISOString()}),
      mk({ title: 'Other-ash', city: 'Obuasi', state: 'Ashanti', created_at: new Date(now - 4000).toISOString()}),
    ] as any[];

    const ranked = rankByProximity(props as any, { userCity: 'Accra', userState: 'Greater Accra' });

    expect(ranked.map((p: any) => p.title)).toEqual([
      'A-new', // same city newest first
      'A-old',
      'Cape Coast', // others bucket, newest first within bucket
      'Other-ash',
      'Kumasi',
    ]);
  });

  it('handles empty input', () => {
    expect(rankByProximity([], { userCity: 'Accra' })).toEqual([]);
  });

  it('is case-insensitive and tolerant to missing fields', () => {
    const props = [
      { title: 'accra1', city: 'ACCRA', created_at: '2024-01-01' },
      { title: 'accra2', city: 'accra', created_at: '2024-01-02' },
      { title: 'unknown' },
    ] as any[];
    const ranked = rankByProximity(props as any, { userCity: 'Accra' });
    expect(ranked[0].title).toBe('accra2');
  });
});

