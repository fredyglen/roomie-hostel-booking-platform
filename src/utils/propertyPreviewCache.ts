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
export const deriveCoverImageFromProperty = (property: any): string => {
  if (!property) return '';
  // Prefer media array with isCover
  const media = Array.isArray(property?.media) ? property.media : [];
  const cover = media.find((m: any) => {
    if (!m || !m.isCover || m.type !== 'image') return false;
    if (typeof m.url !== 'string') return false;
    const url = m.url.trim();
    if (!url) return false;
    if (url.startsWith('blob:')) return false;
    if (url.includes('localhost')) return false;
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    return true;
  });
  if (cover?.url) return cover.url as string;

	  // Direct image_url field (apply the same URL safety rules)
	  const direct = (property as any).image_url;
	  if (typeof direct === 'string') {
	    const url = direct.trim();
	    if (url && !url.startsWith('blob:') && !url.includes('localhost')) {
	      if (url.startsWith('http://') || url.startsWith('https://')) {
	        return url;
	      }
	    }
	  }

  // Fallback to first valid item in images (array or string)
  const imgs = Array.isArray(property?.images)
    ? property.images
    : typeof (property as any).images === 'string'
      ? [(property as any).images]
      : [];
  const valid = imgs.find((img: any) => {
    if (typeof img !== 'string') return false;
    const url = img.trim();
    if (!url) return false;
    if (url.startsWith('blob:')) return false;
    if (url.includes('localhost')) return false;
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    return true;
  });
  return valid || '';
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

