import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { ScreenSize } from '../lib/MicroCoachModels';
import {
  ProfileForm,
  ProfileLayout,
  ProfilePage,
  ProfileSidebar,
  ScreenSizeProps,
} from '../lib/styledcomponents/ProfileStyledComponents';

/**
 * Stands in for Account Settings while the copy resolves. Built out of the
 * page's own layout components so the two columns land in the same places —
 * a hand-drawn approximation would shift as soon as either column changed.
 *
 * The sidebar keeps its navy fill, so its blocks are drawn in the pale veil
 * the header skeleton uses; the page-level grey vanishes against darkBlue.
 */
export default function ProfileSkeleton({ screenSize }: ScreenSizeProps) {
  const theme = useTheme();
  const isLarge = screenSize === ScreenSize.LARGE;
  const onNavy = { bgcolor: 'designSystem.background.fadedWhiteVeil' };

  return (
    <ProfilePage screenSize={screenSize}>
      <ProfileLayout screenSize={screenSize}>
        <ProfileSidebar screenSize={screenSize}>
          <Skeleton
            animation="wave"
            variant="text"
            width="80%"
            height={48}
            sx={onNavy}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={131}
            height={36}
            sx={{ ...onNavy, borderRadius: '18px' }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={123}
            height={152}
            sx={{ ...onNavy, borderRadius: '28px' }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={97}
            height={36}
            sx={{ ...onNavy, borderRadius: '18px' }}
          />
          {Array.from({ length: 2 }).map((unused, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Skeleton
                animation="wave"
                variant="text"
                width="60%"
                height={24}
                sx={onNavy}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width="40%"
                height={24}
                sx={onNavy}
              />
            </Box>
          ))}
        </ProfileSidebar>

        <ProfileForm screenSize={screenSize}>
          <Skeleton
            animation="wave"
            variant="text"
            width={isLarge ? 350 : '80%'}
            height={56}
            sx={{ alignSelf: 'center' }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width={220}
            height={32}
            sx={{ alignSelf: 'center' }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: isLarge ? 'row' : 'column',
              gap: `${theme.sizing.space2}px`,
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              height={40}
              sx={{ flex: '1 1 0', borderRadius: '8px' }}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              height={40}
              sx={{ flex: '1 1 0', borderRadius: '8px' }}
            />
          </Box>

          <Box>
            <Skeleton animation="wave" variant="text" width={80} height={24} />
            <Skeleton animation="wave" variant="text" width={240} height={24} />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            height={44}
            sx={{ borderRadius: '7px' }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={126}
            height={36}
            sx={{ alignSelf: 'center', borderRadius: '18px' }}
          />

          <Skeleton animation="wave" variant="text" width={110} height={24} />
          <Skeleton
            animation="wave"
            variant="rounded"
            height={40}
            sx={{ borderRadius: '8px' }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={137}
            height={36}
            sx={{ alignSelf: 'center', borderRadius: '18px' }}
          />
        </ProfileForm>
      </ProfileLayout>
    </ProfilePage>
  );
}
