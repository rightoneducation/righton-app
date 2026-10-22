import { useEffect, useState } from 'react';
import { IAPIClients } from '../api';

/**
 * A viewable URL for the teacher's profile picture, or null while it is being
 * signed, when they have none, or when signing fails (the initials show then).
 * Keyed on the path, so a new picture never shows the old one's URL.
 */
export function useProfilePictureUrl(
  apiClients: IAPIClients,
  path: string | null | undefined,
): string | null {
  const [signed, setSigned] = useState<{ path: string; url: string } | null>(null);

  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    apiClients.upload
      .getFileUrl(path)
      .then((url) => {
        if (!cancelled) setSigned({ path, url });
      })
      .catch((error) => {
        console.error('Could not load the profile picture', error);
      });
    return () => {
      cancelled = true;
    };
  }, [apiClients, path]);

  return path && signed?.path === path ? signed.url : null;
}

export default useProfilePictureUrl;
