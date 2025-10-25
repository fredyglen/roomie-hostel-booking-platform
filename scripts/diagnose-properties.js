/* Diagnostic script: prints properties and verification counts/statuses
 * Usage:
 *   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/diagnose-properties.js
 */

const { createClient } = require('@supabase/supabase-js');

(async () => {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  try {
    console.log('Connected to:', url);

    // Properties counts
    const { data: propsAll, error: propsErr } = await supabase
      .from('properties')
      .select('id, is_available, verification_status, created_at, title')
      .order('created_at', { ascending: false })
      .limit(50);

    if (propsErr) throw propsErr;

    const counts = (propsAll || []).reduce(
      (acc, p) => {
        const vs = (p.verification_status || 'null').toLowerCase();
        acc.total += 1;
        acc.byStatus[vs] = (acc.byStatus[vs] || 0) + 1;
        if (p.is_available) acc.available += 1;
        return acc;
      },
      { total: 0, available: 0, byStatus: {} }
    );

    console.log('Properties summary:', counts);
    console.log('Recent properties (top 5):');
    (propsAll || []).slice(0, 5).forEach((p) => {
      console.log(` - ${p.id} | ${p.title} | available=${p.is_available} | status=${p.verification_status} | ${p.created_at}`);
    });

    // property_verifications counts
    const { data: verifs, error: verErr } = await supabase
      .from('property_verifications')
      .select('id, property_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (verErr) {
      console.error('property_verifications query error:', verErr.message);
    } else {
      const vCounts = (verifs || []).reduce(
        (acc, v) => {
          const s = (v.status || 'null').toLowerCase();
          acc.total += 1;
          acc.byStatus[s] = (acc.byStatus[s] || 0) + 1;
          return acc;
        },
        { total: 0, byStatus: {} }
      );
      console.log('Verification summary:', vCounts);
      console.log('Recent verifications (top 5):');
      (verifs || []).slice(0, 5).forEach((v) => {
        console.log(` - ${v.id} | property=${v.property_id} | status=${v.status} | ${v.created_at}`);
      });
    }

    process.exit(0);
  } catch (e) {
    console.error('Diagnostics failed:', e.message || e);
    process.exit(2);
  }
})();

