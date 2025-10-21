/**
 * Verify bookings -> bookings_enhanced migration
 * - Compares counts
 * - Samples recent rows
 * - Checks for missing legacy rows in enhanced
 */

import { supabase } from '@/lib/supabase-node';

async function main() {
  try {
    console.log('Verifying bookings migration...');

    const [{ count: legacyCount, error: legacyErr }, { count: enhancedCount, error: enhancedErr }] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('bookings_enhanced').select('*', { count: 'exact', head: true })
    ]);

    if (legacyErr) throw legacyErr;
    if (enhancedErr) throw enhancedErr;

    console.log(`Legacy bookings count: ${legacyCount}`);
    console.log(`Enhanced bookings count: ${enhancedCount}`);

    const { data: missingInEnhanced, error: missingErr } = await supabase
      .from('bookings')
      .select('id')
      .not('id', 'in', supabase.from('bookings_enhanced').select('id')) as any; // Fallback approach; see alternative below

    if (missingErr) {
      console.warn('Could not run NOT IN subquery check in single call; trying alternative via fetch and compare');
      // Alternative: fetch IDs and compare in memory (safer for PostgREST limitations)
      const [legacyIdsRes, enhancedIdsRes] = await Promise.all([
        supabase.from('bookings').select('id'),
        supabase.from('bookings_enhanced').select('id')
      ]);
      if (legacyIdsRes.error) throw legacyIdsRes.error;
      if (enhancedIdsRes.error) throw enhancedIdsRes.error;

      const enhancedSet = new Set(enhancedIdsRes.data.map((r: any) => r.id));
      const missing = (legacyIdsRes.data || []).filter((r: any) => !enhancedSet.has(r.id));
      console.log(`Missing in enhanced: ${missing.length}`);
      if (missing.length) {
        console.log('Sample missing IDs:', missing.slice(0, 10));
      }
    } else {
      console.log(`Missing in enhanced (server-side check): ${missingInEnhanced?.length || 0}`);
    }

    // Sample recent enhanced records
    const { data: sample, error: sampleErr } = await supabase
      .from('bookings_enhanced')
      .select('id, booking_reference, student_id, property_id, property_owner_id, total_amount, payment_status, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    if (sampleErr) throw sampleErr;

    console.log('Recent enhanced bookings sample:');
    console.table(sample);

    console.log('Verification complete.');

  } catch (err) {
    console.error('Verification failed:', err);
    process.exitCode = 1;
  }
}

main();

