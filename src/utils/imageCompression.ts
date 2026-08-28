/**
 * Client-side image compression, applied before anything reaches Supabase Storage.
 *
 * Why this exists: Supabase's on-the-fly image transformation is a paid add-on and
 * is not enabled on this project (`/storage/v1/render/image/...` returns 403
 * FeatureNotEnabled -- see src/utils/imageOptimization.ts). Rather than serving
 * multi-megabyte originals to students on mobile data, we shrink at upload time so
 * the stored object is already the size we want to serve.
 */

/** MIME types we can decode and re-encode in the browser. */
const COMPRESSIBLE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Files below this are already small enough that re-encoding is not worth it. */
const SKIP_UNDER_BYTES = 200 * 1024; // 200 KB

/** Refuse to load anything pathological into memory. */
const HARD_CEILING_BYTES = 25 * 1024 * 1024; // 25 MB

export interface CompressImageOptions {
  /** Longest edge in pixels. 1600 comfortably covers full-bleed detail views. */
  maxWidthOrHeight?: number;
  /** Target size in MB, best-effort. */
  maxSizeMB?: number;
  /** Output type. WebP is materially smaller than JPEG at equal quality. */
  fileType?: 'image/webp' | 'image/jpeg';
  /** Starting quality, 0-1. */
  initialQuality?: number;
}

export interface CompressImageResult {
  /** The file to upload -- the compressed one, or the original if skipped. */
  file: File;
  originalBytes: number;
  finalBytes: number;
  /** True when the original was returned unchanged. */
  skipped: boolean;
  /** Why it was skipped, for logging. */
  reason?: 'not-an-image' | 'already-small' | 'too-large-to-process' | 'compression-failed';
}

/** Swap the extension so the stored object name matches its actual encoding. */
const withExtension = (name: string, mime: string): string => {
  const ext = mime === 'image/webp' ? 'webp' : 'jpg';
  const base = name.replace(/\.[^.]+$/, '') || 'image';
  return `${base}.${ext}`;
};

/**
 * Compress an image file. Never throws: on any failure the original file is
 * returned so an upload is never blocked by the optimisation step.
 */
export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressImageResult> {
  const originalBytes = file.size;
  const base = { file, originalBytes, finalBytes: originalBytes, skipped: true as const };

  // Videos and anything exotic pass straight through.
  if (!COMPRESSIBLE_TYPES.has(file.type)) {
    return { ...base, reason: 'not-an-image' };
  }
  if (originalBytes <= SKIP_UNDER_BYTES) {
    return { ...base, reason: 'already-small' };
  }
  if (originalBytes > HARD_CEILING_BYTES) {
    return { ...base, reason: 'too-large-to-process' };
  }

  const {
    maxWidthOrHeight = 1600,
    maxSizeMB = 0.4,
    fileType = 'image/webp',
    initialQuality = 0.8,
  } = options;

  try {
    // Loaded on demand so the ~21 KB (gzipped) library is not in the bundle
    // every student downloads -- only owners uploading photos pay for it.
    const { default: imageCompression } = await import('browser-image-compression');

    const compressed = await imageCompression(file, {
      maxWidthOrHeight,
      maxSizeMB,
      fileType,
      initialQuality,
      // Keeps the main thread responsive on mid-range phones.
      useWebWorker: true,
      // Strip EXIF. The canvas re-encode already bakes in the correct rotation,
      // and dropping the metadata also removes the GPS coordinates that phone
      // cameras attach -- worth doing when owners photograph their own homes.
      preserveExif: false,
    });

    // If re-encoding somehow made it bigger, keep the original.
    if (compressed.size >= originalBytes) {
      return { ...base, reason: 'compression-failed' };
    }

    // browser-image-compression preserves the input filename, so the extension
    // would still say .jpg while the bytes are WebP. Rename to match.
    const renamed = new File([compressed], withExtension(file.name, fileType), {
      type: fileType,
      lastModified: Date.now(),
    });

    return {
      file: renamed,
      originalBytes,
      finalBytes: renamed.size,
      skipped: false,
    };
  } catch {
    // Compression is an optimisation, never a gate.
    return { ...base, reason: 'compression-failed' };
  }
}

/** Human-readable size, for logs and toasts. */
export const formatBytes = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
