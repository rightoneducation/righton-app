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

const videoDimensions = {
  width: { lg: '1042px', md: '600px', sm: '353px' },
  height: { lg: '586px', md: '336px', sm: '199px' },
};

export default function FeaturedVideo({ screenSize }: IFeatureVideo) {
  return (
    <StyledFlexBox direction="column" align="center" gap={72}>
      {/* Header Section */}
      <StyledFlexBox
        direction="column"
        align={screenSize !== ScreenSize.LARGE ? 'normal' : 'center'}
        gap={12}
      >
        <StyledText fontFamily="Poppins" fontSize="16px" fontWeight={600}>
          Media
        </StyledText>
        <StyledText
          fontFamily="Poppins"
          fontSize="40px"
          fontWeight={700}
          lineHeight={1.2}
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
          maxWidth: videoDimensions.width,
          height: videoDimensions.height,
          margin: '0 auto',
        }}
      >
        {/* Blue Monster - Behind Left Side */}
        <img
          src={blueMonsterImg}
          alt="blue-monster"
          style={{
            position: 'absolute',
            left: '-160px',
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
            right: '-160px',
            bottom: '-50px',
            height: '219px',
            zIndex: 0,
            ...(screenSize !== ScreenSize.LARGE && { display: 'none' }),
          }}
        />

        {/* Card on Top of Blue Monster */}
        {/* <StyledFlexBox
    align="center"
    justify="center"
      sx={{
        position: 'absolute',
        right: '-118px',
        bottom: '118px',
        backgroundImage: 'linear-gradient(to top, #02215f, #0D68B1)',
        boxShadow: '5px 15px 15px rgba(0, 0, 0, 0.25)',
        borderRadius: '21px',
        minWidth: '230px',
        zIndex: 2,
        height: '79px',
        width: '229px',
        ...(screenSize !== ScreenSize.LARGE && { display: 'none'})
      }}
    >
      <Box>
        <StyledText align="center" fontFamily="Poppins" fontWeight={600} style={{ color: 'white', }}>
          We’re featured on<br />NBC Nightly News!
        </StyledText>
      </Box>
    </StyledFlexBox> */}

        {/* Video in the center */}
        <Box sx={{ ...videoDimensions, zIndex: 1, position: 'relative' }}>
          {/* note: video does not fill container on iphone 14 and iphone SE */}
          <iframe
            width="100%"
            height="100%"
            src="https://www.nbcnews.com/news/embedded-video/mmvo160212037562"
            title="RightOn! Beta overview"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder={0}
            className="right-on-video"
          />
        </Box>
      </Box>
    </StyledFlexBox>
  );
}
