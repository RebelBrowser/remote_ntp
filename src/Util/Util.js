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
