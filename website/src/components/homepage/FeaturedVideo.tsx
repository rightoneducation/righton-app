import React from 'react';
import {Box, Card, Grid, CardContent} from '@mui/material';
import { styled } from '@mui/material/styles';
import blueMonsterImg from '../../images/blue-monster.svg';
import redMonsterImg from '../../images/red-monster.svg';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';

export default function FeaturedVideo() {
    return (
       <StyledFlexBox direction="column" align="center" gap={24}>
  {/* Header Section */}
  <StyledFlexBox direction="column" align="center" gap={12}>
    <StyledText fontFamily="Poppins" fontSize="16px" fontWeight={600}>Media</StyledText>
    <StyledText fontFamily="Poppins" fontSize="40px" fontWeight={700} lineHeight={1.2}>
      Featured Videos
    </StyledText>
    <StyledText>Check out what&apos;s recently been happening with RightOn!</StyledText>
  </StyledFlexBox>

  {/* Video + Monsters + Card Row */}
  <Box sx={{ position: 'relative', width: '1042px', height: '586px' }}>
    

    {/* Blue Monster - Behind Left Side */}
    <img
      src={blueMonsterImg}
      alt="blue-monster"
      style={{
        position: 'absolute',
       left: '-165px',
        bottom: '-50px',
        height: '229px',
        zIndex: 0,
      }}
    />

       {/* Red Monster - Behind Right Side */}
    <img
      src={redMonsterImg}
      alt="red-monster"
      style={{
        position: 'absolute',
        right: '-175px',
        bottom: '-50px',
        height: '219px',
        zIndex: 0,
      }}
    />

    {/* Card on Top of Blue Monster */}
    <Card
      style={{
        position: 'absolute',
        right: '-180px',
        bottom: '140px',
        backgroundImage: 'linear-gradient(to top, #02215f, #0D68B1)',
        boxShadow: '5px 15px 15px rgba(0, 0, 0, 0.25)',
        borderRadius: '21px',
        padding: '16px 0px 13px 0px',
        minWidth: '260px',
        zIndex: 2,
        width: '229px',
      }}
    >
      <CardContent>
        <StyledText align="center" fontFamily="Poppins" fontWeight={600} style={{ color: 'white', }}>
          We’re featured on<br />NBC Nightly News!
        </StyledText>
      </CardContent>
    </Card>

    {/* Video in the center */}
    <Box sx={{ width: '1042px', height: '586px', zIndex: 1, position: 'relative' }}>
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

    )
}