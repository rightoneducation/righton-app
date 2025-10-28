import React from 'react';
import { Typography, Box, Paper, Grid, styled, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CloudFrontDistributionUrl } from '@righton/networking';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import placeHolderProfilePicture from '../../images/placeholderProfilePic.png';
import OwnerNamePill from './OwnerNamePill';
import { ScreenSize, userNameOverrides } from '../../lib/CentralModels';
import rightOnLogo from '../../images/RightOnUserLogo.svg';

interface OwnerTagProps {
  screenSize?: ScreenSize;
  isViewGame?: boolean;
}

const OwnerTagFlexContainer = styled(Paper)<OwnerTagProps>(
  ({ theme, screenSize, isViewGame }) => ({
    width: '100%',
    height: 'fit-content',
    display: 'flex',
    flexDirection: screenSize === ScreenSize.MEDIUM ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    background: isViewGame
      ? `${theme.palette.primary.extraDarkBlue}`
      : 'transparent',
    borderRadius: '8px',
    boxSizing: 'border-box',
    paddingTop: `${theme.sizing.smPadding}px`,
    paddingBottom: `${theme.sizing.smPadding}px`,
    paddingLeft: `${theme.sizing.mdPadding}px`,
    paddingRight: `${theme.sizing.mdPadding}px`,
    gap: `${theme.sizing.xSmPadding}px`,
  }),
);

const OwnerTagGridContainer = styled(Grid)<OwnerTagProps>(
  ({ theme, isViewGame, screenSize }) => ({
    width: 'fit-content',
    height: '100%',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    background: isViewGame
      ? `${theme.palette.primary.extraDarkBlue}`
      : 'transparent',
    paddingTop: `${theme.sizing.smPadding}px`,
    paddingBottom: `${theme.sizing.smPadding}px`,
    paddingLeft: `${theme.sizing.lgPadding}px`,
    paddingRight: `${theme.sizing.lgPadding}px`,
  }),
);

const OwnerTagSubGridContainer = styled(Grid)(({ theme }) => ({
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: `${theme.sizing.xSmPadding}px`,
}));

const OwnerTagProfilePicture = styled('img')<OwnerTagProps>(
  ({ theme, screenSize }) => ({
    height: '128px',
    width: '128px',
    borderRadius: '50%',
    objectFit: 'cover',
  }),
);

const OwnerTagTextContainer = styled(Box)<OwnerTagProps>(
  ({ theme, screenSize }) => ({
    display: 'flex',
    flexDirection: screenSize === ScreenSize.MEDIUM ? 'row' : 'column',
    gap: `${theme.sizing.xSmPadding}px`,
    alignItems: 'flex-start',
    textAlign: 'center',
  }),
);

const OwnerTagSubContainer = styled(Box)<OwnerTagProps>(
  ({ theme, screenSize }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.sizing.xSmPadding}px`,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  }),
);

const OwnerTagHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFF',
  textAlign: 'center',
}));

const OwnerTagBody = styled(OwnerTagHeader)(({ theme }) => ({
  fontWeight: 300,
  textAlign: 'center',
}));

export default function OwnerTag({ screenSize, isViewGame }: OwnerTagProps) {
  const theme = useTheme();
  const centralData = useCentralDataState();
  let displayProfilePic = rightOnLogo;
  let displayCreatedName = '';
  let displayLastModified = '';
  let displayNumUsed = 0;
  if (isViewGame) {
    if (centralData.selectedGame) {
      const { profilePic, createdName, lastModified, timesPlayed } =
        centralData.selectedGame;
      displayProfilePic = `${CloudFrontDistributionUrl}${profilePic}`;
      const override = userNameOverrides.find((o) =>
        createdName.includes(o.raw),
      );
      displayCreatedName = override ? override.display : createdName;
      displayNumUsed = timesPlayed ?? 0;
      displayLastModified = (lastModified ?? new Date()).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
      );
    }
  } else if (centralData.selectedQuestion) {
    const { profilePic, createdName, lastModified, timesPlayed } =
      centralData.selectedQuestion;
    displayProfilePic = `${CloudFrontDistributionUrl}${profilePic}`;
    const override = userNameOverrides.find((o) => createdName.includes(o.raw));
    displayCreatedName = override ? override.display : createdName;
    displayNumUsed = timesPlayed ?? 0;
    displayLastModified = (lastModified ?? new Date()).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
    );
  }
  const isOwnerLoaded =
    displayCreatedName !== '' &&
    displayProfilePic !== '' &&
    displayNumUsed !== undefined;

  return  (
    <OwnerTagFlexContainer isViewGame={isViewGame} screenSize={screenSize} elevation={6} >
      {isOwnerLoaded ? (
        <Box style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', gap: `40px` }}>
          <Box
          style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.xSmPadding}px` }}
          >
          <OwnerTagSubContainer screenSize={screenSize} style={{ alignItems: 'center'}}>
            <OwnerTagHeader>Created By:</OwnerTagHeader>
            <OwnerNamePill ownerName={displayCreatedName} />
          </OwnerTagSubContainer>
          <OwnerTagProfilePicture
            src={displayProfilePic}
            screenSize={screenSize}
          />
          </Box>
          <Box
          style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}
          >
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Last Modified:</OwnerTagHeader>
              <OwnerTagBody>{displayLastModified}</OwnerTagBody>
            </OwnerTagSubContainer>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Times Played:</OwnerTagHeader>
              <OwnerTagBody>{displayNumUsed}</OwnerTagBody>
            </OwnerTagSubContainer>
          </Box>
        </Box>
      ) : (
        <CircularProgress style={{ color: '#FFF' }} />
      )}
    </OwnerTagFlexContainer>
  ); 
}
