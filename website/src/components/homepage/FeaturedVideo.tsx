import React from 'react';
import { Box, Card, Grid, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import blueMonsterImg from '../../images/blue-monster.svg';
import redMonsterImg from '../../images/red-monster.svg';
import {
  StyledFlexBox,
  StyledText,
} from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import { ScreenSize } from '../../lib/WebsiteModels';

interface IFeatureVideo {
  screenSize: ScreenSize;
}

// Video wrapper that mimics object-fit: cover for iframes
const VideoCoverContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
  backgroundColor: '#000'
}));

const CoverIframe = styled('iframe')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '177.78%', // 16/9 to ensure cover
  height: '100%',
  transform: 'translate(-50%, -50%)',
  border: 0,
}));

export default function FeaturedVideo({ screenSize }: IFeatureVideo) {
  return (
    <StyledFlexBox direction="column" align="center" gap={72}>
      {/* Header Section */}
      <StyledFlexBox
        direction="column"
        align={screenSize !== ScreenSize.LARGE ? 'normal' : 'center'}
        style={{gap: '12px'}}
      >
        <StyledText fontFamily="Poppins" fontSize="16px" fontWeight={600}>
          MEDIA
        </StyledText>
        <StyledText
          fontFamily="Poppins"
          fontSize="40px"
          fontWeight={700}
          style={{lineHeight: '100%'}}
        >
          NBC Nightly News Feature
        </StyledText>
        <StyledText>
          Check out what&apos;s recently been happening with <i>RightOn!</i>
        </StyledText>
      </StyledFlexBox>

      {/* Video + Monsters + Card Row */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Blue Monster - Behind Left Side */}
        <img
          src={blueMonsterImg}
          alt="blue-monster"
          style={{
            position: 'absolute',
            left: '0px',
            bottom: '-50px',
            height: '229px',
            zIndex: 0,
            ...(screenSize !== ScreenSize.LARGE && { display: 'none' }),
          }}
        />

        {/* Red Monster - Behind Right Side */}
        <img
          src={redMonsterImg}
          alt="red-monster"
          style={{
            position: 'absolute',
            right: '0px',
            bottom: '-50px',
            height: '219px',
            zIndex: 0,
            ...(screenSize !== ScreenSize.LARGE && { display: 'none' }),
          }}
        />
        {/* Video in the center */}
        <Box sx={{ 
          zIndex: 1, 
          position: 'relative',
          paddingLeft: screenSize === ScreenSize.LARGE ? '168px' : '0px',
          paddingRight: screenSize === ScreenSize.LARGE ? '168px' : '0px',
        }}>
          <VideoCoverContainer>
            <CoverIframe
              src="https://www.nbcnews.com/news/embedded-video/mmvo160212037562"
              title="RightOn! Intro"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </VideoCoverContainer>
        </Box>
      </Box>
    </StyledFlexBox>
  );
}
