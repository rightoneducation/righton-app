import React from 'react';
import { Box, Paper, Typography, useTheme, styled } from '@mui/material';
import { ScreenSize } from '../../../lib/CentralModels';
import { CreateGameContentContainer } from '../../../lib/styledcomponents/CreateGameStyledComponent';
import aiMonster from '../../../images/aiMonster.svg';

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

const HeaderText = styled(Typography)({
  fontSize: '24px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  lineHeight: '32px',
  color: '#384466',
});

const BodyText = styled(Typography)({
  fontSize: '16px',
  fontFamily: 'Rubik',
  fontWeight: '400',
  lineHeight: '18px',
  color: '#384466',
});

interface CreateGamePublicPrivateBodyProps {
  screenSize: ScreenSize;
}

export default function CreateGamePublicPrivateBody({ screenSize }: CreateGamePublicPrivateBodyProps) {
  const theme = useTheme();
  return (
    <CreateGameContentContainer
      style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: '88px'}}
    >
      <Box
        style={{
          width: '100%',
          maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '1100px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: `88px`,
        }}
      >
        {/* Column 1 */}
        <Box>
          <Paper 
            elevation={6}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '436px',
              minHeight: '577px',
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: `${theme.sizing.mdPadding}px`,
              }}
            >
              <HeaderText>What happens if my game is made public?</HeaderText>
              <BodyText>Public games are usable by other users, once published, without making edits to your game. </BodyText>
              <BodyText>
                  <b>If you decide to make your game private before publishing, all public questions added from the question bank will be removed.</b> Once your game is published, you will no longer be able to edit 
                  this setting.
              </BodyText>
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
        </Box>
        {/* Column 2 */}
        <Box>
          <Box
            style={{
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
        </Box>
      </Box>
    </CreateGameContentContainer> 
  );
}