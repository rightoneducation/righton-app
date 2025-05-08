import React from 'react';
import { Typography, Box, Grid, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IGameTemplate, IQuestionTemplate, CloudFrontDistributionUrl } from '@righton/networking';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import placeHolderProfilePicture from '../../images/placeholderProfilePic.png';
import OwnerNamePill from './OwnerNamePill';
import { ScreenSize } from '../../lib/CentralModels';

interface OwnerTagProps {
  screenSize?: ScreenSize;
  isViewGame?: boolean;
}

const OwnerTagFlexContainer = styled(Box)<OwnerTagProps>(({ theme, screenSize, isViewGame }) => ({
  width: 'fit-content',
  height: 'fit-content',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.MEDIUM ? 'row' : 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  background: isViewGame ? `${theme.palette.primary.extraDarkBlue}` : 'transparent',
  borderRadius: '8px',
  padding: `${theme.sizing.smPadding}px`,
  gap: `${theme.sizing.xSmPadding}px`,
}));

const OwnerTagGridContainer = styled(Grid)<OwnerTagProps>(({ theme, isViewGame }) => ({
  width: 'fit-content',
  height: '100%',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  background: isViewGame ? `${theme.palette.primary.extraDarkBlue}` : 'transparent',
  paddingTop: `${theme.sizing.smPadding}px`,
  paddingBottom: `${theme.sizing.smPadding}px`,
  paddingLeft: `${theme.sizing.lgPadding}px`,
  paddingRight: `${theme.sizing.lgPadding}px`,
}));

const OwnerTagSubGridContainer = styled(Grid)(({ theme }) => ({
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: `${theme.sizing.xSmPadding}px`,
}));

const OwnerTagProfilePicture = styled('img')<OwnerTagProps>(({ theme, screenSize }) => ({
  height: screenSize === ScreenSize.LARGE ? '128px' : '64px',
  width: screenSize === ScreenSize.LARGE ? '128px' : '64px',
  borderRadius: '50%',
  objectFit: 'cover',
}));

const OwnerTagTextContainer = styled(Box)<OwnerTagProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: screenSize === ScreenSize.MEDIUM ? 'row' : 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  alignItems: 'flex-start',
}));

const OwnerTagSubContainer = styled(Box)<OwnerTagProps>(({ theme, screenSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  justifyContent: screenSize !== ScreenSize.SMALL ? 'center' : 'flex-start',
  alignItems: 'center',
}));

const OwnerTagHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFF',
}));

const OwnerTagBody = styled(OwnerTagHeader)(({ theme }) => ({
  fontWeight: 300,
}));

export default function OwnerTag({
    screenSize,
    isViewGame
}: OwnerTagProps) {
  const theme = useTheme();
  const centralData = useCentralDataState();

  const gamesUsed = '234';
  const userName = 'Mr. J. Jiminez';


  
  // TODO: Get this data (adjust useCentralDataActions to get the data from fetchElements)
  // let gamesUsed = 0;
  // let userName = '';
  // let createdAt = '';

  // if (isViewGame) {
  //   const selectedGame = centralData.selectedGame as IGameTemplate;
  //   gamesUsed = selectedGame?.gamesUsed || 0;
  //   userName = `${selectedGame?.title} ${selectedGame?.lowerCaseTitle}`;}
  //   createdAt = selectedGame?.createdAt || '';
  // } else {
  //   const selectedQuestion = centralData.selectedQuestion as IQuestionTemplate;
  //   gamesUsed = selectedQuestion?.gamesUsed || 0;
  //   userName = selectedQuestion?.owner || '';
  //   createdAt = selectedQuestion?.createdAt || '';
  // }


  const createdAt = centralData.selectedGame?.createdAt || '';

  const date = new Date(createdAt);
  const modifiedDate = date.toLocaleDateString('en-US', {
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
  });


  return (
    screenSize !== ScreenSize.SMALL ? 
      <OwnerTagFlexContainer isViewGame={isViewGame} screenSize={screenSize}>
        <OwnerTagProfilePicture src={placeHolderProfilePicture} screenSize={screenSize}/>
        <OwnerTagTextContainer screenSize={screenSize}>
          <OwnerTagSubContainer screenSize={screenSize}>
            <OwnerTagHeader>Created By:</OwnerTagHeader>
            <OwnerNamePill ownerName={userName} />
          </OwnerTagSubContainer>
          <OwnerTagSubContainer screenSize={screenSize}>
            <OwnerTagHeader>Last Modified:</OwnerTagHeader>
            <OwnerTagBody>{modifiedDate}</OwnerTagBody>
          </OwnerTagSubContainer>
          <OwnerTagSubContainer screenSize={screenSize}>
            <OwnerTagHeader>Games Used:</OwnerTagHeader>
            <OwnerTagBody>{gamesUsed}</OwnerTagBody>
          </OwnerTagSubContainer>
        </OwnerTagTextContainer>
      </OwnerTagFlexContainer>
    :
      <OwnerTagGridContainer isViewGame={isViewGame}  container>
        <OwnerTagSubGridContainer item xs={6}>
          <OwnerTagProfilePicture src={placeHolderProfilePicture} screenSize={screenSize}/>
        </OwnerTagSubGridContainer>
        <OwnerTagSubGridContainer item xs={6}>
          <OwnerTagSubContainer screenSize={screenSize}>
            <OwnerTagHeader>Last Modified:</OwnerTagHeader>
            <OwnerTagBody>{modifiedDate}</OwnerTagBody>
          </OwnerTagSubContainer>
        </OwnerTagSubGridContainer>
        <OwnerTagSubGridContainer item xs={6}>
          <OwnerTagSubContainer screenSize={screenSize}>
            <OwnerTagHeader>Created By:</OwnerTagHeader>
            <OwnerNamePill ownerName={userName} />
          </OwnerTagSubContainer>
        </OwnerTagSubGridContainer>
        <OwnerTagSubGridContainer item xs={6}>
          <OwnerTagSubContainer screenSize={screenSize}>
            <OwnerTagHeader>Games Used:</OwnerTagHeader>
            <OwnerTagBody>{gamesUsed}</OwnerTagBody>
          </OwnerTagSubContainer>
        </OwnerTagSubGridContainer>
      </OwnerTagGridContainer>
  );
}
