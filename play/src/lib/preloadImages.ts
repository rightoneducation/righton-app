// Kicks off fetches for the given image URLs so they land in the browser's
// HTTP cache before the screen that renders them mounts. The Image objects
// themselves are throwaway — the cache entry is what we're after.
export default function preloadImages(urls: string[]): void {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}
