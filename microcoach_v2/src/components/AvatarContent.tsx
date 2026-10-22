import React from 'react';
import Box from '@mui/material/Box';

interface AvatarContentProps {
  url: string | null | undefined;
  initials: string;
}

/**
 * What fills an avatar circle: the profile picture, or the initials when there
 * is none or it fails to load. A failure is remembered per URL, so a newly
 * uploaded picture gets a fresh try.
 */
export default function AvatarContent({ url, initials }: AvatarContentProps) {
  const [failedUrl, setFailedUrl] = React.useState<string | null>(null);

  if (!url || failedUrl === url) return <span>{initials}</span>;
  return (
    <Box
      component="img"
      src={url}
      alt=""
      onError={() => setFailedUrl(url)}
      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
