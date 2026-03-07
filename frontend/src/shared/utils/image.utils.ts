/**
 * Optimize a Cloudinary image URL by adding transformation parameters.
 *
 * Automatically applies:
 * - `f_auto`: Let Cloudinary choose the best image format (WebP/AVIF/JPEG).
 * - `q_auto`: Automatically adjust image quality for optimal size.
 *
 * Optionally resizes the image:
 * - `w_{width}`: Limit image width.
 * - `h_{height}` + `c_fill`: Crop/fill image to the specified height.
 *
 * This helps reduce bandwidth and improve loading performance.
 *
 * @param url Original Cloudinary image URL.
 * @param options Optional resize options.
 * @param options.width Target width in pixels.
 * @param options.height Target height in pixels.
 *
 * @example
 * optimizeCloudinary(url, { width: 120, height: 120 })
 * // -> .../upload/f_auto,q_auto,w_120,h_120,c_fill/...
 */
function optimizeCloudinary(
  url: string,
  { width, height }: { width?: number; height?: number } = {},
) {
  if (!url) return url;

  const transforms = ["f_auto", "q_auto"];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, "c_fill");

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}

export const imageUtils = {
  optimizeCloudinary,
};
