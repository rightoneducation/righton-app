import {useEffect, useMemo, useState} from 'react';

/**
 * Check if a media query matches the UI
 * @param {*} mediaQueryString 
 * @returns {Boolean}
 * 
 * from:
 * https://pgarciacamou.medium.com/reactjs-usemediaquery-hook-using-window-matchmedia-650e36363561
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 */

export function useMediaQuery (mediaQueryString){
  const query = useMemo ( () => window.matchMedia(mediaQueryString), [mediaQueryString]);
  const [matches, setMatches] = useState(query.matches);

  useEffect(() => {
    const listener = (e) => setMatches(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [query])

  return matches;
}