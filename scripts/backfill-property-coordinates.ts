/**
 * Backfill Property Coordinates Script
 * - Fetches properties missing coordinates
 * - Calls geocode-property edge function
 * - Updates properties with latitude/longitude
 *
 * Usage:
 *   ts-node scripts/backfill-property-coordinates.ts --limit=200 --dry-run=false
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/geocode-property`;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function parseArgs() {
  const args = Object.fromEntries(process.argv.slice(2).map(arg => {
    const [k, v] = arg.replace(/^--/, '').split('=');
    return [k, v ?? 'true'];
  }));
  return {
    limit: Number(args.limit ?? 500),
    dryRun: String(args.dry-run ?? args.dryRun ?? 'false') === 'true',
    delayMs: Number(args.delayMs ?? 400),
  };
}

async function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function geocode(address: string, city?: string, state?: string, country = 'Ghana') {
  const resp = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ address, city, state, country, update: false }),
  });
  if (!resp.ok) throw new Error(`Geocode failed: ${resp.status} ${await resp.text()}`);
  const json = await resp.json();
  if (!json?.success) throw new Error(`Geocode error: ${json?.error || 'unknown'}`);
  return json.data as { latitude: number; longitude: number };
}

async function main() {
  const { limit, dryRun, delayMs } = parseArgs();
  console.log(`[Backfill] Starting with limit=${limit}, dryRun=${dryRun}, delayMs=${delayMs}`);

  const { data, error } = await supabase
    .from('properties')
    .select('id, title, address, city, state, latitude, longitude')
    .or('latitude.is.null,longitude.is.null')
    .limit(limit);

  if (error) throw error;
  const props = data || [];
  console.log(`[Backfill] Found ${props.length} properties to process`);

  for (const p of props) {
    try {
      if (p.latitude != null && p.longitude != null) {
        console.log(`[Skip] ${p.id} already has coordinates`);
        continue;
      }

      const addr = p.address || `${p.city || ''}, ${p.state || ''}`.trim();
      if (!addr) {
        console.warn(`[Warn] ${p.id} missing address info, skipping`);
        continue;
      }

      const { latitude, longitude } = await geocode(addr, p.city, p.state);
      console.log(`[Geocoded] ${p.id} ${p.title} -> (${latitude}, ${longitude})`);

      if (!dryRun) {
        const { error: upErr } = await supabase
          .from('properties')
          .update({ latitude, longitude })
          .eq('id', p.id);
        if (upErr) throw upErr;
        console.log(`[Updated] ${p.id} coordinates saved`);
      } else {
        console.log(`[DryRun] Would update ${p.id} with coordinates`);
      }
    } catch (e: any) {
      console.error(`[Error] ${p.id}: ${e?.message || e}`);
    }
    await sleep(delayMs);
  }

  console.log('[Backfill] Completed');
}

main().catch((e) => {
  console.error('[Backfill] Fatal error', e);
  process.exit(1);
});

