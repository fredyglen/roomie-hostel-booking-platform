import { supabase } from '@/integrations/supabase/client';

/**
 * Central image optimization helper for Supabase Storage assets.
 *
 * We keep original, full-resolution files in the `property-images` bucket,
 * but generate **transformed** public URLs (resized + compressed) at read time
 * using Supabase's built-in image transformations.
 */

export type ImageTransformOptions = {
  /** Target width in pixels (defaults to 800 for cards, 1080 for stories). */
  width?: number;
  /** Optional target height in pixels. If omitted, Supabase preserves aspect ratio. */
  height?: number;
  /** JPEG/WebP quality 1-100 (defaults to 80). */
  quality?: number;
  /** Resize mode; see Supabase docs for details. */
  resize?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  /** Storage bucket name (defaults to `property-images`). */
  bucket?: string;
};

/**
 * Given a public Supabase Storage URL, return an optimized variant using
 * `supabase.storage.from(bucket).getPublicUrl(path, { transform })`.
 *
 * If the URL is not a Supabase public URL for the expected bucket, it is
 * returned unchanged so we don't break Unsplash placeholders or local assets.
 */
export function getOptimizedPropertyImageUrl(
  url: string,
  options: ImageTransformOptions = {}
): string {
  if (!url || typeof url !== 'string') return url;

  const {
    width = 800,
    height,
    quality = 80,
    resize = 'cover',
    bucket = 'property-images',
  } = options;

  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${bucket}/`;

    // Only touch Supabase public URLs for the target bucket
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return url;

    const objectPath = parsed.pathname.substring(idx + marker.length);
    if (!objectPath) return url;

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath, {
      transform: {
        width,
        ...(height ? { height } : {}),
        quality,
        resize,
      },
    });

    return data?.publicUrl || url;
  } catch {
    // If URL parsing or Supabase client usage fails for any reason,
    // fall back to the original URL rather than breaking the UI.
    return url;
  }
}

