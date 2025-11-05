/**
 * Custom Image Loader for Next.js
 * Prevents empty strings from reaching picomatch and causing errors
 */

export default function customImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // CRITICAL: Validate src before processing
  if (!src || typeof src !== 'string' || src.trim().length === 0) {
    console.warn('imageLoader: Received invalid src, using fallback', { src, width });
    return '/images/default-avatar.png';
  }

  // If src is already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // For local images, ensure they start with /
  if (!src.startsWith('/')) {
    return `/${src}`;
  }

  return src;
}
