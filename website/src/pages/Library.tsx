import React, { useState } from 'react';

import { Typography, Grid, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Navigation, Pagination } from 'swiper/modules';
import { useTheme, styled } from '@mui/material/styles';
import { ScreenSize } from '../lib/WebsiteModels';
import RedAvatar from '../images/redimage.svg';
import StudentImage from '../images/studentimage.svg';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import ArticleCard from '../lib/styledcomponents/ArticleCard';
import BottomCard from '../lib/styledcomponents/LibraryCategoryCard';
import ResarchImage from '../images/researchimage.svg';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css/pagination';

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '72px', 
  width: '100%', 
  minWidth: '300px',
  height: '100%',
  justifyContent: 'center',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
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
  },
  flexGrow: 1
}));

const Uppercontainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px', 
  // border: '1px solid red',
  boxSizing: 'border-box',
}));


const ArticlesAndBorderContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '48px',
  boxSizing: 'border-box',
  width: '100%',
  // border: '1px solid brown',
}));

const ArticlesContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: ' 48px',
  boxSizing: 'border-box',
}));
const SwiperContainer = styled(Box)(({ theme }) => ({
  // border: '1px solid red',
  width: '100%',
  // maxWidth: `${theme.breakpoints.values.md}px`,
  boxSizing: 'border-box',

}));
const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: 'clamp(12px, 1.5vw, 24px)',
  boxSizing: 'border-box',
}));

const StyledButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ selected }) => ({
  padding: 'clamp(8px, 1vw, 12px) clamp(16px, 2vw, 24px)',
  borderRadius: '24px',
  border: selected ? '1px solid #FFFFFF' : '1px solid transparent',
  color: '#FFFFFF',
  fontFamily: 'Poppins, sans-serif',
  fontSize: 'clamp(14px, 1.2vw, 20px)',
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'border 0.3s ease',
}));

const BottomCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: 'clamp(12px, 1.5vw, 16px)',
  flexWrap: 'wrap',
  boxSizing: 'border-box',
  // border: '1px solid red',
}));



export function Library() { // eslint-disable-line

  const [selected, setSelected] = useState<'all' | 'research' | 'resources'>('all');

  const cards = [
    { id: '1', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '2', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '3', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '4', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '5', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '6', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '7', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '8', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },
    { id: '9', image: ResarchImage, tag: "Research", date: "Jan 1, 2022", views: "9823", title: "Title", caption: "Caption..." },];
  
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const screenSize = isLargeScreen ? ScreenSize.LARGE : // eslint-disable-line
  isMediumScreen ? ScreenSize.MEDIUM : 
  ScreenSize.SMALL;
  
  const MainContainerPadding = screenSize === ScreenSize.LARGE? // eslint-disable-line
  "96px 72px": screenSize === ScreenSize.MEDIUM? "60px 72px": "60px 12px"; // eslint-disable-line
  
  const renderArticleContainerArray = [
    (screenSize === ScreenSize.LARGE) ? (
      <ArticlesContainer>
          <ArticleCard
            image={StudentImage}
            category="Teaching Resources"
            title="Math Hospital"
            description="Help students diagnose their own mistakes with this teaching strategy"
            avatar={RedAvatar}
            author="Righton! Team"
            date="11 Jan 2025"
            readTime="5 min read"
            screenSize={screenSize}
          />
          <ArticleCard
            image={StudentImage}
            category="Teaching Resources"
            title="Math Hospital"
            description="Help students diagnose their own mistakes with this teaching strategy"
            avatar={RedAvatar}
            author="Righton! Team"
            date="11 Jan 2025"
            readTime="5 min read"
            screenSize={screenSize}
          />
          <ArticleCard
            image={StudentImage}
            category="Teaching Resources"
            title="Math Hospital"
            description="Help students diagnose their own mistakes with this teaching strategy"
            avatar={RedAvatar}
            author="Righton! Team"
            date="11 Jan 2025"
            readTime="5 min read"
            screenSize={screenSize}
          />
        </ArticlesContainer>
    ) : (
      <SwiperContainer>
          <Swiper
            modules={[]}
            spaceBetween={48}
            slidesPerView={screenSize === ScreenSize.MEDIUM ? 2.2 : 1.2}
            style={{ width: '100%' }}
            grabCursor
            freeMode
          >
            <SwiperSlide>
              <ArticleCard
                image={StudentImage}
                category="Teaching Resources"
                title="Math Hospital"
                description="Help students diagnose their own mistakes with this teaching strategy"
                avatar={RedAvatar}
                author="Righton! Team"
                date="11 Jan 2025"
                readTime="5 min read"
                screenSize={screenSize}
              />
            </SwiperSlide>
            <SwiperSlide>
              <ArticleCard
                image={StudentImage}
                category="Teaching Resources"
                title="Math Hospital"
                description="Help students diagnose their own mistakes with this teaching strategy"
                avatar={RedAvatar}
                author="Righton! Team"
                date="11 Jan 2025"
                readTime="5 min read"
                screenSize={screenSize}
              />
            </SwiperSlide>
            <SwiperSlide>
              <ArticleCard
                image={StudentImage}
                category="Teaching Resources"
                title="Math Hospital"
                description="Help students diagnose their own mistakes with this teaching strategy"
                avatar={RedAvatar}
                author="Righton! Team"
                date="11 Jan 2025"
                readTime="5 min read"
                screenSize={screenSize}
              />
            </SwiperSlide>
          </Swiper>
        </SwiperContainer>
    )
  ]
  
    return (
    <MainContainer sx={{
      alignItems: screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
      padding: MainContainerPadding,
      }}>
      <Uppercontainer sx={{
        alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', 
            alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',
            boxSizing: 'border-box',}}>
          <Typography sx={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600,   color: '#FFFFFF'}}>
            RESOURCES
          </Typography>
          <Typography sx={{ lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF'}}>
            Educator our Resource Library
          </Typography>
        </Box>
        <Typography sx={{ 
          fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
          : '24px',
          lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
          : '130%',
          fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF'}}>
            Explore our library of resources created by educators like you!
        </Typography>
      </Uppercontainer>
      <ArticlesAndBorderContainer>
        <Box sx={{ 
          justifySelf: 'start', 
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <Typography sx={{fontSize: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF',}}>
            Suggested Articles: 
          </Typography>
        </Box>
        {renderArticleContainerArray}
      </ArticlesAndBorderContainer>
      <Box sx={{ border: '1px solid #FFFFFF', width: '100%'}} />
      <ButtonContainer>
        <StyledButton selected={selected === 'all'} onClick={() => setSelected('all')}>
          All
        </StyledButton>
        <StyledButton selected={selected === 'research'} onClick={() => setSelected('research')}>
          Research
        </StyledButton>
        <StyledButton selected={selected === 'resources'} onClick={() => setSelected('resources')}>
          Resources
        </StyledButton>
      </ButtonContainer>
      <Grid container   columnSpacing={2} rowSpacing={6}>
        {cards.map((card) => (
          <Grid  size={{xs:12, md:12, lg:4}}  key={card.id}>
            <BottomCard
              image={card.image}
              tag={card.tag}
              date={card.date}
              views={card.views}
              title={card.title}
              caption={card.caption}
            />
          </Grid>
        ))}
      </Grid>

    </MainContainer>
  )
}