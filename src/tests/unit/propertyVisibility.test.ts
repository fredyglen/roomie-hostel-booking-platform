import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyPipelineService } from '@/services/propertyPipeline';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => {
  const from = vi.fn();
  return { supabase: { from } };
});

const getSupabaseFromMock = () => (supabase as unknown as { from: ReturnType<typeof vi.fn> }).from;

const setupSupabaseVisibilityResponse = (data: any, error: any = null) => {
  const single = vi.fn().mockResolvedValue({ data, error });
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single,
  } as any;

  getSupabaseFromMock().mockReturnValue(builder);

  return { single, builder };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PropertyPipelineService.verifyPropertyVisibility', () => {
  const matrix: Array<{
    is_available: boolean;
    verification_status: 'pending' | 'verified' | 'rejected';
    expectedVisible: boolean;
  }> = [
    { is_available: true, verification_status: 'verified', expectedVisible: true },
    { is_available: true, verification_status: 'pending', expectedVisible: false },
    { is_available: true, verification_status: 'rejected', expectedVisible: false },
    { is_available: false, verification_status: 'verified', expectedVisible: false },
    { is_available: false, verification_status: 'pending', expectedVisible: false },
    { is_available: false, verification_status: 'rejected', expectedVisible: false },
  ];

  it.each(matrix)(
    'computes studentVisible=%s for is_available=%s, verification_status=%s',
    async ({ is_available, verification_status, expectedVisible }) => {
      setupSupabaseVisibilityResponse({
        id: 'prop-1',
        title: 'Test Property',
        is_available,
        verification_status,
      });

      const result = await PropertyPipelineService.verifyPropertyVisibility('prop-1');

      expect(result.pipelineHealthy).toBe(true);
      expect(result.studentVisible).toBe(expectedVisible);
      expect(result.property).toMatchObject({
        id: 'prop-1',
        is_available,
        verification_status,
      });
    },
  );

  it('returns pipelineHealthy=false and studentVisible=false when Supabase returns an error', async () => {
    setupSupabaseVisibilityResponse(null, new Error('db error'));

    const result = await PropertyPipelineService.verifyPropertyVisibility('prop-2');

    expect(result.pipelineHealthy).toBe(false);
    expect(result.studentVisible).toBe(false);
    expect(result.property).toBeUndefined();
  });
});

