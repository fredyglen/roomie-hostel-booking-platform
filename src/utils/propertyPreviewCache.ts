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

// Derive a single cover image URL from a heterogeneous property object
export const deriveCoverImageFromProperty = (property: any): string => {
  if (!property) return '';
  // Prefer media array with isCover
  const media = Array.isArray(property?.media) ? property.media : [];
  const cover = media.find(
    (m: any) => m && m.isCover && m.type === 'image' && typeof m.url === 'string' && m.url.trim()
  );
  if (cover?.url) return cover.url as string;

  // Direct image_url field
  const direct = (property as any).image_url;
  if (typeof direct === 'string' && direct.trim()) return direct;

  // Fallback to first valid item in images (array or string)
  const imgs = Array.isArray(property?.images)
    ? property.images
    : typeof (property as any).images === 'string'
      ? [(property as any).images]
      : [];
  const valid = imgs.find(
    (img: any) => typeof img === 'string' && img.trim() && !img.includes('blob:') && !img.includes('localhost')
  );
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

