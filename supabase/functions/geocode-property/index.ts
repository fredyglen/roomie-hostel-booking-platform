// Supabase Edge Function: geocode-property
// Geocodes a property address and optionally updates the properties table
// Provider priority: Mapbox > Google > OpenStreetMap Nominatim

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MAPBOX_TOKEN = Deno.env.get('MAPBOX_TOKEN');
const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const RequestSchema = z.object({
  address: z.string().min(3),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default('Ghana').optional(),
  property_id: z.string().uuid().optional(),
  update: z.boolean().default(true).optional(),
});

type Provider = 'mapbox' | 'google' | 'nominatim';

async function geocodeWithMapbox(query: string) {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ROOMie-Geocoder/1.0' } });
  if (!res.ok) return null;
  const json = await res.json();
  const feature = json.features?.[0];
  if (!feature) return null;
  const [lon, lat] = feature.center || [];
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  return { provider: 'mapbox' as Provider, latitude: lat, longitude: lon, raw: feature };
}

async function geocodeWithGoogle(query: string) {
  if (!GOOGLE_MAPS_API_KEY) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ROOMie-Geocoder/1.0' } });
  if (!res.ok) return null;
  const json = await res.json();
  const result = json.results?.[0];
  const loc = result?.geometry?.location;
  if (!loc) return null;
  return { provider: 'google' as Provider, latitude: loc.lat, longitude: loc.lng, raw: result };
}

async function geocodeWithNominatim(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ROOMie-Geocoder/1.0',
      'Accept-Language': 'en',
    },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const entry = json?.[0];
  if (!entry) return null;
  const lat = parseFloat(entry.lat);
  const lon = parseFloat(entry.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { provider: 'nominatim' as Provider, latitude: lat, longitude: lon, raw: entry };
}

function buildAddress({ address, city, state, country }: any) {
  return [address, city, state, country || 'Ghana'].filter(Boolean).join(', ');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = RequestSchema.parse(body);
    const query = buildAddress(parsed);

    // Try providers in order
    const result =
      (await geocodeWithMapbox(query)) ||
      (await geocodeWithGoogle(query)) ||
      (await geocodeWithNominatim(query));

    if (!result) {
      return new Response(JSON.stringify({ success: false, error: 'Geocoding failed' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Optional DB update
    if (parsed.update && parsed.property_id) {
      const { error } = await supabase
        .from('properties')
        .update({ latitude: result.latitude, longitude: result.longitude })
        .eq('id', parsed.property_id);
      if (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: { latitude: result.latitude, longitude: result.longitude, provider: result.provider } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

