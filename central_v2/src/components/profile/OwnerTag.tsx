import React from 'react';
import { Typography, Box, Grid, styled, CircularProgress } from '@mui/material';
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

const OwnerTagFlexContainer = styled(Box)<OwnerTagProps>(
  ({ theme, screenSize, isViewGame }) => ({
    width: 'fit-content',
    height: 'fit-content',
    display: 'flex',
    flexDirection: screenSize === ScreenSize.MEDIUM ? 'row' : 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    background: isViewGame
      ? `${theme.palette.primary.extraDarkBlue}`
      : 'transparent',
    borderRadius: '8px',
    padding: `${theme.sizing.smPadding}px`,
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
    height: screenSize === ScreenSize.LARGE ? '128px' : '64px',
    width: screenSize === ScreenSize.LARGE ? '128px' : '64px',
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
    justifyContent: screenSize !== ScreenSize.SMALL ? 'center' : 'flex-start',
    alignItems: 'center',
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

  return screenSize !== ScreenSize.SMALL ? (
    <OwnerTagFlexContainer isViewGame={isViewGame} screenSize={screenSize}>
      {isOwnerLoaded ? (
        <>
          <OwnerTagProfilePicture
            src={displayProfilePic}
            screenSize={screenSize}
          />
          <OwnerTagTextContainer screenSize={screenSize}>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Created By:</OwnerTagHeader>
              <OwnerNamePill ownerName={displayCreatedName} />
            </OwnerTagSubContainer>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Last Modified:</OwnerTagHeader>
              <OwnerTagBody>{displayLastModified}</OwnerTagBody>
            </OwnerTagSubContainer>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Times Played:</OwnerTagHeader>
              <OwnerTagBody>{displayNumUsed}</OwnerTagBody>
            </OwnerTagSubContainer>
          </OwnerTagTextContainer>
        </>
      ) : (
        <CircularProgress style={{ color: '#FFF' }} />
      )}
    </OwnerTagFlexContainer>
  ) : (
    <OwnerTagGridContainer
      screenSize={screenSize}
      isViewGame={isViewGame}
      container
    >
      {isOwnerLoaded ? (
        <>
          <OwnerTagSubGridContainer item xs={6}>
            <OwnerTagProfilePicture
              src={displayProfilePic}
              screenSize={screenSize}
            />
          </OwnerTagSubGridContainer>
          <OwnerTagSubGridContainer item xs={6}>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Last Modified:</OwnerTagHeader>
              <OwnerTagBody>{displayLastModified}</OwnerTagBody>
            </OwnerTagSubContainer>
          </OwnerTagSubGridContainer>
          <OwnerTagSubGridContainer item xs={6}>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Created By:</OwnerTagHeader>
              <OwnerNamePill ownerName={displayCreatedName} />
            </OwnerTagSubContainer>
          </OwnerTagSubGridContainer>
          <OwnerTagSubGridContainer item xs={6}>
            <OwnerTagSubContainer screenSize={screenSize}>
              <OwnerTagHeader>Times Played:</OwnerTagHeader>
              <OwnerTagBody>{displayNumUsed}</OwnerTagBody>
            </OwnerTagSubContainer>
          </OwnerTagSubGridContainer>
        </>
      ) : (
        <OwnerTagSubGridContainer item xs={12}>
          <CircularProgress style={{ color: '#FFF' }} />
        </OwnerTagSubGridContainer>
      )}
    </OwnerTagGridContainer>
  );
}
