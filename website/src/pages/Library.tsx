import React, { useState, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Typography, Grid, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTheme, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { CMSArticleType } from '@righton/networking';
import { ScreenSize } from '../lib/WebsiteModels';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';
import CornerstoneArticleCard from '../lib/styledcomponents/CornerstoneArticleCard';
import ArticleCard from '../lib/styledcomponents/ArticleCard';
import CornerstoneSkeleton from '../components/library/CornerstoneSkeleton';
import ArticleSkeleton from '../components/library/ArticleSkeleton';

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
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 1,
  backgroundImage: `linear-gradient(rgba(2, 33, 95), rgba(2, 33, 95, 0.94)),
  url(${MathSymbolBackground})
  `,
  background: 'cover',
  flexGrow: 1
}));

const Uppercontainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px', 
  boxSizing: 'border-box',
}));


const ArticlesAndBorderContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '48px',
  boxSizing: 'border-box',
  width: '100%',
}));

const ArticlesContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  gap: ' 48px',
  boxSizing: 'border-box',
}));
const SwiperContainer = styled(Box)(({ theme }) => ({
  width: '100%',
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


export function Library({cmsClient} : any ) { // eslint-disable-line
 
  const [selected, setSelected] = useState<'all' | 'research' | 'resources'>('all');
  const [articles, setArticles] = useState<any[]>([]);
  const [cornerstones, setCornerstones] = useState<any[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingCornerstones, setIsLoadingCornerstones] = useState(false);
  const [isLoadingSingleArticle, setIsLoadingSingleArticle] = useState(false);
  const isContentPage = useMatch('/library/:contentId');
  const contentId = isContentPage ? isContentPage.params.contentId : null;
  
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const screenSize = isLargeScreen ? ScreenSize.LARGE : // eslint-disable-line
    isMediumScreen ? ScreenSize.MEDIUM : 
    ScreenSize.SMALL;
  const countCornerstone = screenSize === ScreenSize.LARGE ? 5 : 3;
  const countArticle = screenSize === ScreenSize.LARGE ? 12 : 6;
  const MainContainerPadding = screenSize === ScreenSize.LARGE? // eslint-disable-line
    "96px 72px": screenSize === ScreenSize.MEDIUM? "60px 72px": "60px 12px"; // eslint-disable-line

  // simple loading of CMS content
  useEffect(() => {
    setIsLoadingArticles(true);
    setIsLoadingCornerstones(true);
    setIsLoadingSingleArticle(true);
    
    const fetchSingleArticle = async () => {
      if (contentId) {
        const content = await cmsClient.fetchContentById(contentId);
        setArticles([content]); // Wrap in an array to match the expected type
      }
    }
    const fetchCornerstones = async () => {
      const fetchedCornerstones = await cmsClient.fetchAllCornerstones();
      setCornerstones(fetchedCornerstones);
    }
    const fetchArticles = async () => {
      const content = await cmsClient.fetchAllArticles();
      setArticles(content);
    }
    if (contentId){
      fetchSingleArticle().then(() => {
        setIsLoadingSingleArticle(false);
      })
    } else {
      fetchCornerstones().then(() => {
        setIsLoadingCornerstones(false);
      })
      fetchArticles().then(() => {
        setIsLoadingArticles(false);
      })
    }
  }, []); // eslint-disable-line

  const renderArticleContainerArray = [
    (screenSize === ScreenSize.LARGE) ? (
      <ArticlesContainer>
        {isLoadingCornerstones 
          ? Array.from({ length: countCornerstone }).map((_, i) => (
            <CornerstoneSkeleton index={i} screenSize={screenSize} />
          ))
          : cornerstones.map((article: CMSArticleType) => (
            <Box 
              onClick={() => {
                window.location.href = `/library/${article._id}`;
              }} 
              style={{ cursor: 'pointer' }}
            >
              <CornerstoneArticleCard
                key={article._id}
                screenSize={screenSize}
                article={article}
              />
            </Box>
          ))
        }
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
            {cornerstones.map((article: CMSArticleType) => (
              <SwiperSlide>
                <Box 
                  onClick={() => {
                    window.location.href = `/library/${article._id}`;
                  }} 
                  style={{ cursor: 'pointer' }}
                >
                  <CornerstoneArticleCard
                    key={article._id}
                    screenSize={screenSize}
                    article={article}
                  />
                </Box>
              </SwiperSlide>
            ))}
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
      <Grid container columnSpacing='16px' rowSpacing='24px'>
        { isLoadingArticles 
          ? Array.from({ length: countArticle }).map((_, i) => (
              <Grid size={{xs:12, md:12, lg:4}} key={uuidv4()}>
                <ArticleSkeleton index={i} />
              </Grid>
            ))
          : articles.map((article: any) => (
            <Grid size={{xs:12, md:12, lg:4}} key={article.id}>
              <Box 
                onClick={() => {
                  window.location.href = `/library/${article._id}`;
                }} 
                style={{ cursor: 'pointer' }}
              >
                <ArticleCard
                  image={article.image}
                  date={article.date}
                  tags={article.tags}
                  title={article.title}
                  caption={article.caption}
                />
              </Box>
            </Grid>
          ))
        }
      </Grid>
    </MainContainer>
  )
}