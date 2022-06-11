// Create an HTMLImageElement to be notified when the image has downloaded.
// Optionally may be notified of load errors.
export function LoadImage(imageUrl, onLoaded, onError) {
  const image = new Image();

  image.onload = () => onLoaded(imageUrl);
  if (typeof onError !== 'undefined') {
    image.onerror = () => onError(imageUrl);
  }

  image.src = imageUrl;
}

export function isDarkColor(rgba) {
  if (typeof rgba === 'string') {
    if (rgba.startsWith('#')) {
      rgba = rgbaFromHex(rgba);
    } else {
      // Support decoding string formats like "rgba(1,2,3,4)" if we ever need it
      console.error('Unsupported color string:', rgba);
      return false;
    }
  }

  const [r, g, b] = rgba;

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp <= 127.5;
}

export function rgbaFromHex(hex) {
  const value = parseInt(hex.substring(1), 16);

  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;

  return [r, g, b, 1];
}

export function rgbaToString(rgba) {
  const [r, g, b, a] = rgba;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function buildTouchIconUrl(url) {
  const icon = new URL('chrome-search://remote-ntp-offline/icon');
  icon.searchParams.set('size', `85@${window.devicePixelRatio}x`);
  icon.searchParams.set('url', url);

  return icon.toString();
}

export function buildFaviconUrl(url, withFallbackMonogram) {
  const favicon = new URL('chrome-search://favicon2/');
  favicon.searchParams.set('size', 64);
  favicon.searchParams.set('page_url', url);
  favicon.searchParams.set(
    'allow_google_server_fallback',
    withFallbackMonogram ? 1 : 0
  );

  return favicon.toString();
}
