import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import RedAvatar from '../images/redimage.svg';
import StudentImage from '../images/studentimage.svg';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px', 
  width: '100%', 
  height: '100%',
  paddingTop: '101px',
  paddingBottom: '101px',
  paddingLeft: '105px',
  paddingRight: '105px',
  boxSizing: 'border-box',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${MathSymbolBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(2, 33, 95, 0.9)',
    zIndex: -1,
  }
}));

const Uppercontainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px', 
  alignItems: 'center',
  border: '1px solid red',
  boxSizing: 'border-box'
}));

const ArticlesAndBorderContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '36px',
  boxSizing: 'border-box'

}));

const ArticlesContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: '32px',
  boxSizing: 'border-box',
  border: '1px solid yellow'
}));

const ArticlesCard = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  border: '1px solid white',
  boxSizing: 'border-box',
  borderRadius: '8px',
  background: '#224996'
}));


export function Library( // eslint-disable-line
  {cmsClient} : any 
) { 
  useEffect(() => {
    const fetch = cmsClient.fetchAllArticles();
    console.log('Fetched articles:', fetch);
  }, []); // eslint-disable-line
  return (
    <MainContainer>
      <Uppercontainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center'}}>
          <Typography sx={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600,   color: '#FFFFFF'}}>
            RESOURCES
          </Typography>
          <Typography sx={{ fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF'}}>
            Educator Resource Library
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF'}}>
            Explore our library of resources created by educators like you!
        </Typography>
      </Uppercontainer>
      <Typography sx={{fontSize: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', border: '1px solid green'}}>
        Suggested Articles: 
      </Typography>
      <ArticlesAndBorderContainer>
        <ArticlesContainer>
          <ArticlesCard>
            <img
              src={StudentImage}
              alt="StudentImage"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '24px', gap: '2px', boxSizing: 'border-box'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  Teaching Resources
                </Typography>
                <Typography sx={{fontSize: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                  Math Hospital
                </Typography>
                <Typography sx={{fontSize: '16px', fontFamily: 'Roboto, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  Help students diagnose their own mistakes with this teaching strategy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center'}}>
                <img
                  src={RedAvatar}
                  alt="RedAvatar"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                  <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    Righton! Team
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '8px'}}>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      11 Jan 2025
                    </Typography>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      •
                    </Typography>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      5 min read
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ArticlesCard>
          <ArticlesCard>
            <img
              src={StudentImage}
              alt="StudentImage"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '24px', gap: '2px', boxSizing: 'border-box'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  Teaching Resources
                </Typography>
                <Typography sx={{fontSize: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                  Math Hospital
                </Typography>
                <Typography sx={{fontSize: '16px', fontFamily: 'Roboto, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  Help students diagnose their own mistakes with this teaching strategy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center'}}>
                <img
                  src={RedAvatar}
                  alt="RedAvatar"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                  <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    Righton! Team
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '8px'}}>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      11 Jan 2025
                    </Typography>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      •
                    </Typography>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      5 min read
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ArticlesCard>
          <ArticlesCard>
            <img
              src={StudentImage}
              alt="StudentImage"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '24px', gap: '2px', boxSizing: 'border-box'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  Teaching Resources
                </Typography>
                <Typography sx={{fontSize: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                  Math Hospital
                </Typography>
                <Typography sx={{fontSize: '16px', fontFamily: 'Roboto, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  Help students diagnose their own mistakes with this teaching strategy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center'}}>
                <img
                  src={RedAvatar}
                  alt="RedAvatar"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                  <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    Righton! Team
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '8px'}}>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      11 Jan 2025
                    </Typography>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      •
                    </Typography>
                    <Typography sx={{fontSize: '14px', fontFamily: 'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                      5 min read
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ArticlesCard>
        </ArticlesContainer>
      </ArticlesAndBorderContainer>
    </MainContainer>
  )
}