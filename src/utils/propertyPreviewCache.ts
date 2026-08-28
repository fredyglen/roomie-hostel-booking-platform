// Utility to cache minimal property preview for no-flicker booking hydration
// Kept framework-agnostic (localStorage only)

export interface PropertyPreview {
  id: string;
  title: string;
  address?: string;
  rent?: number;
  coverImage?: string;
}

const KEY = (id: string) => `booking:preview:${id}`;

/**
 * Derive a single hero/cover image URL from a heterogeneous property-like object.
 *
 * Priority:
 *  1. media[] entry where isCover === true and type === 'image'
 *  2. image_url string field
 *  3. first valid entry in images (array or string)
 *
 * In all branches we only accept remote http(s) URLs and explicitly reject
 * blob: URLs and localhost references. When no valid remote URL is found,
 * this function returns an empty string and callers are expected to render a
 * local placeholder image instead.
 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

/**
 * A URL is usable as a cover image only if it is a remote http(s) address that
 * will resolve for a real user. blob: URLs are session-scoped and localhost
 * addresses are development artifacts; both render as broken images in production.
 */
const isSafeRemoteImageUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith('blob:')) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  try {
    return !LOCAL_HOSTNAMES.has(new URL(url).hostname);
  } catch {
    return false;
  }
};

export const deriveCoverImageFromProperty = (property: any): string => {
  if (!property) return '';

  // 1. media[] entry explicitly flagged as the cover
  const media = Array.isArray(property.media) ? property.media : [];
  const cover = media.find(
    (m: any) => m?.isCover && m?.type === 'image' && isSafeRemoteImageUrl(m?.url)
  );
  if (cover) return String(cover.url).trim();

  // 2. legacy direct image_url field
  const direct = property.image_url;
  if (isSafeRemoteImageUrl(direct)) return direct.trim();

  // 3. first usable entry in images (array or single string)
  const imgs = Array.isArray(property.images)
    ? property.images
    : typeof property.images === 'string'
      ? [property.images]
      : [];
  const valid = imgs.find(isSafeRemoteImageUrl);
  return valid ? String(valid).trim() : '';
};

export const buildPreviewFromProperty = (property: any): PropertyPreview | null => {
  if (!property || !property.id) return null;
  const title = property.title || property.name || '';
  const address = property.address || property.city || '';
  const rentRaw = property.rent ?? property.price;
  const rent = typeof rentRaw === 'number' ? rentRaw : Number(rentRaw || 0);
  const coverImage = deriveCoverImageFromProperty(property);
  return { id: String(property.id), title, address, rent, coverImage };
};

export const setPropertyPreviewFromProperty = (property: any): void => {
  try {
    const preview = buildPreviewFromProperty(property);
    if (!preview) return;
    localStorage.setItem(KEY(preview.id), JSON.stringify(preview));
  } catch (e) {
    // Non-fatal
    console.warn('setPropertyPreviewFromProperty failed', e);
  }
};

export const setPropertyPreview = (preview: PropertyPreview): void => {
  try {
    if (!preview?.id) return;
    localStorage.setItem(KEY(preview.id), JSON.stringify(preview));
  } catch (e) {
    console.warn('setPropertyPreview failed', e);
  }
};

export const getPropertyPreview = (id: string): PropertyPreview | null => {
  try {
    const raw = localStorage.getItem(KEY(String(id)));
    return raw ? (JSON.parse(raw) as PropertyPreview) : null;
  } catch (e) {
    return null;
  }
};

