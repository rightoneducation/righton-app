import React from 'react';
import { Box, Paper, Typography, useTheme, styled } from '@mui/material';
import { PublicPrivateType } from '@righton/networking';
import { ScreenSize } from '../../../lib/CentralModels';
import { CreateGameContentContainer } from '../../../lib/styledcomponents/CreateGameStyledComponent';
import CreateGamePublicPrivateButton from './CreateGamePublicPrivateButton';
import { ButtonType } from '../../button/ButtonModels';
import CentralButton from '../../button/Button';
import aiMonster from '../../../images/aiMonster.svg';
import CreateGamePublicPrivateSwiper from './CreateGamePublicPrivateSwiper';
import PaginationContainerStyled from '../../../lib/PaginationContainerStyled';

const TitleText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 700,
  fontSize: '40px',
  color: '#02215F',
  lineHeight: '40px',
}));

const SubTitleText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: '16px',
  color: '#02215F',
  lineHeight: '18px',
}));

interface CreateGamePublicPrivateBodyProps {
  screenSize: ScreenSize;
  selectedButton: PublicPrivateType;
  setSelectedButton: (button: PublicPrivateType) => void;
  handleStartCreating: (selected: PublicPrivateType) => void;
}

export default function CreateGamePublicPrivateBody({ screenSize, selectedButton, setSelectedButton, handleStartCreating }: CreateGamePublicPrivateBodyProps) {
  const theme = useTheme();

  let gap = '88px';
  if (screenSize === ScreenSize.MEDIUM) {
    gap = '72px';
  } else if (screenSize === ScreenSize.SMALL) {
    gap = '48px';
  }

  const infoCard = (
      <Paper 
        elevation={6}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '436px',
          minHeight: screenSize === ScreenSize.MEDIUM ? '460px' : '577px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingTop: '88px',
          paddingLeft: '24px',
          paddingRight: '24px',
          borderRadius: '8px',
          zIndex: 1,
          boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Box
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: `${theme.sizing.lgPadding}px`
          }}
        >
          <CreateGamePublicPrivateSwiper />
          <PaginationContainerStyled className="swiper-pagination-container" style={{justifyContent: 'flex-start'}}/>
        </Box>
        <img 
          src={aiMonster} 
          alt="Monster"
          style={{
            position: 'absolute',
            bottom: '-40px',
            width: '144px',
            height: 'auto',
          }}
        />
      </Paper>
  );
  let paddingTop= '88px';
  if (screenSize === ScreenSize.MEDIUM) {
    paddingTop = '32px';
  } else if (screenSize === ScreenSize.SMALL) {
    paddingTop = '16px';
  }
  return (
    <CreateGameContentContainer
      style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop, paddingBottom: `${theme.sizing.xLgPadding}px`}}
    >
      <Box
        style={{
          width: '100%',
          maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '1100px',
          display: 'flex',
          flexDirection: screenSize !== ScreenSize.LARGE ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap
        }}
      >
        {screenSize === ScreenSize.LARGE && infoCard}
        <Box
          style={{
            position: 'relative',
            width: '100%',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            gap: `${theme.sizing.xLgPadding}px`,
          }}
        >
          <Box
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: `72px`,
            }}
          >
            <Box
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: `${theme.sizing.smPadding}px`,
              }}
            >
              <TitleText>Choose your game type</TitleText>
              <SubTitleText>You can change your mind while editing your game before publishing</SubTitleText>
            </Box>
            <Box
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: `${theme.sizing.lgPadding}px`,
              }}
            >
              <Box style={{width: '100%', cursor: 'pointer'}} onClick={() => setSelectedButton(PublicPrivateType.PUBLIC)}> 
                <CreateGamePublicPrivateButton isPublic isSelected={selectedButton === PublicPrivateType.PUBLIC} />
              </Box >
              <Box style={{width: '100%', cursor: 'pointer'}} onClick={() => setSelectedButton(PublicPrivateType.PRIVATE)}> 
                <CreateGamePublicPrivateButton isPublic={false} isSelected={selectedButton === PublicPrivateType.PRIVATE} />
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: screenSize === ScreenSize.LARGE ? 'flex-start' : 'flex-end',
              alignItems: 'center',
            }}
          >
            <CentralButton 
              buttonType={ButtonType.STARTCREATING}
              buttonWidthOverride={ screenSize !== ScreenSize.SMALL ? "240px" : "100%" }
              isEnabled 
              onClick={() => handleStartCreating(selectedButton)}
            /> 
          </Box>
        </Box>
        {screenSize !== ScreenSize.LARGE && infoCard}
      </Box>
    </CreateGameContentContainer> 
  );
}