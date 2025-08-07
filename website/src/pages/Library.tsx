import React, { useState, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Typography, Grid, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTheme, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { CMSArticleType } from '@righton/networking';
import { ScreenSize, LibraryType } from '../lib/WebsiteModels';
import CornerstoneArticleCard from '../lib/styledcomponents/CornerstoneArticleCard';
import ArticleCard from '../lib/styledcomponents/ArticleCard';
import CornerstoneSkeleton from '../components/library/CornerstoneSkeleton';
import ArticleSkeleton from '../components/library/ArticleSkeleton';
import { ButtonContainer, StyledButton, MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css/pagination';


const MainContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  background: 'transparent',
}));

const Uppercontainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  gap: '24px', 
  boxSizing: 'border-box',
}));


const CornerStonesTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  width: '100%',
}));

const CornerStonesContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex', 
  gap: ' 48px',
}));

const ArticleContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'center'
}));

export function Library({cmsClient} : any ) { // eslint-disable-line
 
  const [selected, setSelected] = useState<LibraryType>(LibraryType.ALL);
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [cornerstones, setCornerstones] = useState<any[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingCornerstones, setIsLoadingCornerstones] = useState(false);
  const [isLoadingSingleArticle, setIsLoadingSingleArticle] = useState(false);
  const isContentPage = useMatch('/library/:contentId');
  const contentId = isContentPage ? isContentPage.params.contentId : null;

  // TODO: ~~~Theme~~~
  const primaryGap = '72px';
  const secondaryGap = '48px';
  
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const screenSize = isLargeScreen ? ScreenSize.LARGE : // eslint-disable-line
    isMediumScreen ? ScreenSize.MEDIUM : 
    ScreenSize.SMALL;

  // TODO: ~~~Theme~~~
  const countCornerstone = screenSize === ScreenSize.LARGE ? 5 : 3;
  const countArticle = screenSize === ScreenSize.LARGE ? 12 : 6;
  const paddingSide = screenSize === ScreenSize.SMALL ? '12px' : '72px';
  const paddingTopBottom = screenSize === ScreenSize.LARGE ? '96px' : '60px';
  const slideOffset = screenSize === ScreenSize.SMALL ? 24 : 148;
  
  const handleArticleFilterClick = (tag: LibraryType) => {
    setSelected(tag);
    let filtered = articles;
    console.log(articles);
    if (tag !== LibraryType.ALL) {
      filtered = articles.filter((article) => article.tags.includes(tag));
    }
    setFilteredArticles(filtered);
  };

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
      console.log(content);
      setArticles(content);
      setFilteredArticles(content);
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
      <CornerStonesContainer 
        sx={{
          paddingLeft: paddingSide,
          paddingRight: paddingSide
        }}
      >
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
      </CornerStonesContainer>
    ) : (
      <Swiper
        slidesPerView='auto'
        spaceBetween={48}
        slidesOffsetAfter={slideOffset}
        style={{
          width: '100%', 
          paddingLeft: paddingSide
        }}
      >
        {cornerstones.map((article: CMSArticleType) => (
          <SwiperSlide
            style={{width: '287px'}}
          >
            <Box
              onClick={() => {
                window.location.href = `/library/${article._id}`;
              }} 
              style={{
                cursor: 'pointer',     
              }}
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
    )
  ]
    return (
    <MainContainer 
      sx={{
        gap: screenSize === ScreenSize.LARGE ? primaryGap : secondaryGap,
        alignItems: screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
      }}
    >
      <MathSymbolsBackground />
      <Uppercontainer sx={{
        alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',
        paddingTop: paddingTopBottom,
        paddingLeft: paddingSide,
        paddingRight: paddingSide,
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', 
            alignItems: screenSize === ScreenSize.LARGE? 'center' : 'flex-start',
            boxSizing: 'border-box',}}>
          <Typography sx={{ fontSize: '16px', fontFamily: 'Poppins, sans-serif', fontWeight: 600,   color: '#FFFFFF'}}>
            RESOURCES
          </Typography>
          <Typography sx={{ lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF'}}>
            Explore our Resource Library
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
      <CornerStonesTitleContainer
        sx={{
          paddingLeft: paddingSide,
          paddingRight: paddingSide,
          boxSizing: 'border-box'
        }}
      >
        <Typography sx={{fontSize: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF',}}>
          Suggested Articles: 
        </Typography>
      </CornerStonesTitleContainer>
      <Box 
        sx={{ 
          justifySelf: 'start', 
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
          {renderArticleContainerArray}
      </Box>
      <Box 
        sx={{ 
          border: '1px solid #FFFFFF', 
          width: '100%',  
          paddingLeft: paddingSide, 
          paddingRight: paddingSide
        }} 
      />
      <ArticleContainer
        sx={{
          gap: secondaryGap,
          paddingLeft: paddingSide,
          paddingRight: paddingSide
        }}
      >
        <ButtonContainer>
          <StyledButton selected={selected === LibraryType.ALL} onClick={() => handleArticleFilterClick(LibraryType.ALL)}>
            All
          </StyledButton>
          <StyledButton selected={selected === LibraryType.ARTICLE} onClick={() => handleArticleFilterClick(LibraryType.ARTICLE)}>
            Articles
          </StyledButton>
          <StyledButton selected={selected === LibraryType.VIDEO} onClick={() => handleArticleFilterClick(LibraryType.VIDEO)}>
            Videos
          </StyledButton>
          <StyledButton selected={selected === LibraryType.RESEARCH} onClick={() => handleArticleFilterClick(LibraryType.RESEARCH)}>
            Research
          </StyledButton>
        </ButtonContainer>
        <Grid 
          container 
          columnSpacing='16px' 
          rowSpacing='24px' 
          sx={{
            paddingBottom: paddingTopBottom,
          }}
        >
          { isLoadingArticles 
            ? Array.from({ length: countArticle }).map((_, i) => (
                <Grid size={{xs:12, md:12, lg:4}} key={uuidv4()}>
                  <ArticleSkeleton index={i} />
                </Grid>
              ))
            : filteredArticles.map((article: any) => (
                article && 
                  <Grid size={{xs:12, md:12, lg:4}} key={article.id}>
                    <Box 
                      onClick={() => {
                        window.location.href = `/library/${article._id}`;
                      }} 
                      style={{ cursor: 'pointer' }}
                    >
                      <ArticleCard
                        image={article.image || article.thumbnailImage}
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
      </ArticleContainer>
    </MainContainer>
  )
}