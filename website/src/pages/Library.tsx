import React, { useState, useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTheme, styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CMSArticleType } from '@righton/networking';
import { ScreenSize, LibraryType } from '../lib/WebsiteModels';
import CornerstoneArticleCard from '../components/article/CornerstoneArticleCard';
import ArticleCard from '../components/article/ArticleCard';
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
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isContentPage = useMatch('/library/:contentId');
  const contentId = isContentPage ? isContentPage.params.contentId : null;

  const ARTICLES_PER_PAGE = 9;

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
    if (tag !== LibraryType.ALL) {
      filtered = articles.filter((article) => article.tags.includes(tag));
    }
    setFilteredArticles(filtered);
    
    // Reset pagination state when filter changes
    setCurrentPage(0);
    setHasMore(true);
  };

  const loadMoreArticles = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const start = currentPage * ARTICLES_PER_PAGE;
      const newArticles = await cmsClient.fetchArticlesPaginated(start, ARTICLES_PER_PAGE);
      
      if (newArticles.length > 0) {
        const updatedArticles = [...articles, ...newArticles];
        setArticles(updatedArticles);
        
        // Apply current filter to new articles
        let filtered = updatedArticles;
        if (selected !== LibraryType.ALL) {
          filtered = updatedArticles.filter((article) => article.tags.includes(selected));
        }
        setFilteredArticles(filtered);
        
        setCurrentPage(prev => prev + 1);
      }
      
      // Check if we've loaded all articles
      if (newArticles.length < ARTICLES_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setIsLoadingMore(false);
    }
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
    const fetchInitialArticles = async () => {
      try {
        // Get total count first
        const total = await cmsClient.fetchArticlesCount();
        
        // Load first page
        const initialArticles = await cmsClient.fetchArticlesPaginated(0, ARTICLES_PER_PAGE);
        setArticles(initialArticles);
        setFilteredArticles(initialArticles);
        setCurrentPage(1);
        
        // Check if there are more articles to load
        const hasMoreArticles = initialArticles.length === ARTICLES_PER_PAGE;
        setHasMore(hasMoreArticles);
      } catch (error) {
        console.error('Error fetching initial articles:', error);
      }
    }
    
    if (contentId){
      fetchSingleArticle().then(() => {
        setIsLoadingSingleArticle(false);
      })
    } else {
      fetchCornerstones().then(() => {
        setIsLoadingCornerstones(false);
      })
      fetchInitialArticles().then(() => {
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
        <InfiniteScroll
          dataLength={filteredArticles.length}
          next={loadMoreArticles}
          hasMore={hasMore}
          loader={
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <CircularProgress style={{ color: '#FFF' }} />
            </Box>
          }
        >
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
                    <Grid size={{xs:12, md:12, lg:4}} key={article._id}>
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
        </InfiniteScroll>
      </ArticleContainer>
    </MainContainer>
  )
}