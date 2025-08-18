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
import {
  ButtonContainer,
  StyledButton,
  MathSymbolsBackground,
} from '../lib/styledcomponents/StyledComponents';

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
  alignItems: 'center',
}));

export function Library({ cmsClient }: any) { // eslint-disable-line
  const theme = useTheme();
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
  const [articleCounts, setArticleCounts] = useState<Record<LibraryType, number>>({
    [LibraryType.ALL]: 0,
    [LibraryType.ARTICLE]: 0,
    [LibraryType.VIDEO]: 0,
    [LibraryType.RESEARCH]: 0,
  });
  const isContentPage = useMatch('/library/:contentId');
  const contentId = isContentPage ? isContentPage.params.contentId : null;

  const ARTICLES_PER_PAGE = 9;

  const primaryGap = `${theme.sizing.xLgPadding}px`;
  const secondaryGap = `${theme.sizing.lgPadding}px`;

  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up(1400));

  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE 
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;

  const countCornerstone = screenSize === ScreenSize.LARGE ? 5 : 3;
  const countArticle = screenSize === ScreenSize.LARGE ? 12 : 6;
  const paddingSide =
    screenSize === ScreenSize.SMALL
      ? `${theme.sizing.smPadding}px`
      : `${theme.sizing.xLgPadding}px`;
  const paddingTopBottom =
    screenSize === ScreenSize.LARGE
      ? `${theme.sizing.xxLgPadding}px`
      : `${theme.sizing.lgPadding}px`;
  const slideOffset =
    screenSize === ScreenSize.SMALL
      ? theme.sizing.mdPadding
      : theme.sizing.xLgPadding;

  // Helper function to convert LibraryType to article type string
  const getArticleTypeString = (libraryType: LibraryType): string => {
    switch (libraryType) {
      case LibraryType.ARTICLE:
        return 'Article';
      case LibraryType.VIDEO:
        return 'Video';
      case LibraryType.RESEARCH:
        return 'Research';
      default:
        return '';
    }
  };

  const handleArticleFilterClick = async (tag: LibraryType) => {
    setSelected(tag);
    
    // Reset pagination state when filter changes
    setCurrentPage(0);
    setHasMore(true);
    
    // Load initial articles for the selected type
    try {
      setIsLoadingArticles(true);
      let initialArticles;
      
      if (tag === LibraryType.ALL) {
        initialArticles = await cmsClient.fetchAllArticlesPaginated(0, ARTICLES_PER_PAGE);
      } else {
        const articleType = getArticleTypeString(tag);
        initialArticles = await cmsClient.fetchArticlesPaginatedByType(articleType, 0, ARTICLES_PER_PAGE);
      }
      
      // Clear existing articles and set new ones
      setArticles(initialArticles);
      setFilteredArticles(initialArticles);
      setCurrentPage(1);
      
      // Use stored count instead of fetching again
      const totalCount = articleCounts[tag];
      console.log('totalCount', totalCount);
      setHasMore(initialArticles.length < totalCount);
    } catch (error) {
      console.error('Error loading articles for filter:', error);
    } finally {
      setIsLoadingArticles(false);
    }
  };

  const loadMoreArticles = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const start = currentPage * ARTICLES_PER_PAGE;
      let newArticles;
      
      if (selected === LibraryType.ALL) {
        newArticles = await cmsClient.fetchAllArticlesPaginated(start, ARTICLES_PER_PAGE);
      } else {
        const articleType = getArticleTypeString(selected);
        newArticles = await cmsClient.fetchArticlesPaginatedByType(articleType, start, ARTICLES_PER_PAGE);
      }

      if (newArticles.length > 0) {
        const updatedArticles = [...articles, ...newArticles];
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles); // No need to filter since we're using specific queries
        
        setCurrentPage((prev) => prev + 1);
        
        // Check if we've loaded all articles
        if (newArticles.length < ARTICLES_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        // No articles returned, we've reached the end
        setHasMore(false);
      }
      console.log('newArticles', newArticles.length);
      console.log('filteredArticles.length before:', filteredArticles.length);
      console.log('hasMore:', hasMore);
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
    };
    const fetchCornerstones = async () => {
      const fetchedCornerstones = await cmsClient.fetchAllCornerstones();
      setCornerstones(fetchedCornerstones);
    };
    const fetchInitialArticles = async () => {
      try {
        // Load first page of all articles
        const initialArticles = await cmsClient.fetchAllArticlesPaginated(
          0,
          ARTICLES_PER_PAGE,
        );
        setArticles(initialArticles);
        setFilteredArticles(initialArticles);
        setCurrentPage(1);

        // Fetch all article counts once
        const [allCount, articleCount, videoCount, researchCount] = await Promise.all([
          cmsClient.fetchAllArticlesCount(),
          cmsClient.fetchArticlesCountByType('Article'),
          cmsClient.fetchArticlesCountByType('Video'),
          cmsClient.fetchArticlesCountByType('Research'),
        ]);

        setArticleCounts({
          [LibraryType.ALL]: allCount,
          [LibraryType.ARTICLE]: articleCount,
          [LibraryType.VIDEO]: videoCount,
          [LibraryType.RESEARCH]: researchCount,
        });

        // Check if there are more articles to load
        setHasMore(initialArticles.length < allCount);
      } catch (error) {
        console.error('Error fetching initial articles:', error);
      }
    };

    if (contentId) {
      fetchSingleArticle().then(() => {
        setIsLoadingSingleArticle(false);
      });
    } else {
      fetchCornerstones().then(() => {
        setIsLoadingCornerstones(false);
      });
      fetchInitialArticles().then(() => {
        setIsLoadingArticles(false);
      });
    }
  }, []); // eslint-disable-line

  const renderArticleContainerArray = [
    screenSize === ScreenSize.LARGE ? (
      <CornerStonesContainer
        sx={{
          paddingLeft: paddingSide,
          paddingRight: paddingSide,
          justifyContent: screenSize === ScreenSize.LARGE ? 'center' : 'start',
          boxSizing: 'border-box',
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
            ))}
      </CornerStonesContainer>
    ) : (
      <Swiper
        slidesPerView="auto"
        spaceBetween={48}
        slidesOffsetAfter={slideOffset}
        style={{
          width: '100%',
          paddingLeft: paddingSide,
        }}
      >
        {cornerstones.map((article: CMSArticleType) => (
          <SwiperSlide style={{ width: '287px' }}>
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
    ),
  ];
  return (
    <MainContainer
      sx={{
        gap: screenSize === ScreenSize.LARGE ? primaryGap : secondaryGap,
        alignItems: screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
      }}
    >
      <MathSymbolsBackground />
      <Uppercontainer
        sx={{
          alignItems: screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
          paddingTop: paddingTopBottom,
          paddingLeft: paddingSide,
          paddingRight: paddingSide,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems:
              screenSize === ScreenSize.LARGE ? 'center' : 'flex-start',
            boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
              fontSize: '16px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            RESOURCES
          </Typography>
          <Typography
            sx={{
              lineHeight: '1.2',
              fontSize: '40px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            Explore our Resource Library
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize:
              screenSize === ScreenSize.MEDIUM ||
              screenSize === ScreenSize.SMALL
                ? '20px'
                : '24px',
            lineHeight:
              screenSize === ScreenSize.MEDIUM ||
              screenSize === ScreenSize.SMALL
                ? '100%'
                : '130%',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            color: '#FFFFFF',
          }}
        >
          Explore our library of resources created by educators like you!
        </Typography>
      </Uppercontainer>
      <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.sizing.lgPadding}px`,
      }}
      >
      <CornerStonesTitleContainer
        sx={{
          paddingLeft: paddingSide,
          paddingRight: paddingSide,
          boxSizing: 'border-box',
        }}
      >
        <Typography
          sx={{
            fontSize: '20px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          Suggested Resources:
        </Typography>
      </CornerStonesTitleContainer>
      <Box
        sx={{
          justifySelf: screenSize === ScreenSize.LARGE ? 'center' : 'start',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {renderArticleContainerArray}
      </Box>
      </Box>
             <Box
         sx={{
           width: '100%',
           paddingLeft: paddingSide,
           paddingRight: paddingSide,
           boxSizing: 'border-box',
         }}
       >
         <Box
           style={{
             display: 'block',
             width: '100%',
             height: '1px',
             background: '#FFF',
           }}
         />
       </Box>
      <ArticleContainer
        sx={{
          gap: secondaryGap,
          paddingLeft: paddingSide,
          paddingRight: paddingSide,
        }}
      >
        <ButtonContainer>
          <StyledButton
            selected={selected === LibraryType.ALL}
            onClick={() => handleArticleFilterClick(LibraryType.ALL)}
          >
            All
          </StyledButton>
          <StyledButton
            selected={selected === LibraryType.ARTICLE}
            onClick={() => handleArticleFilterClick(LibraryType.ARTICLE)}
          >
            Articles
          </StyledButton>
          <StyledButton
            selected={selected === LibraryType.VIDEO}
            onClick={() => handleArticleFilterClick(LibraryType.VIDEO)}
          >
            Videos
          </StyledButton>
          <StyledButton
            selected={selected === LibraryType.RESEARCH}
            onClick={() => handleArticleFilterClick(LibraryType.RESEARCH)}
          >
            Research
          </StyledButton>
        </ButtonContainer>
        <InfiniteScroll
          key={`${selected}-${filteredArticles.length}`}
          dataLength={filteredArticles.length}
          next={loadMoreArticles}
          hasMore={hasMore}
          loader={
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
              }}
            >
              <CircularProgress style={{ color: '#FFF' }} />
            </Box>
          }
        >
          <Grid
            container
            columnSpacing="16px"
            rowSpacing="24px"
            sx={{
              paddingBottom: paddingTopBottom,
            }}
          >
            {isLoadingArticles
              ? Array.from({ length: countArticle }).map((_, i) => (
                  <Grid size={{ xs: 12, md: 12, lg: 4 }} key={uuidv4()}>
                    <ArticleSkeleton index={i} />
                  </Grid>
                ))
              : filteredArticles.map(
                  (article: any) =>
                    article && (
                      <Grid size={{ xs: 12, md: 12, lg: 4 }} key={article._id}>
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
                    ),
                )}
          </Grid>
        </InfiniteScroll>
      </ArticleContainer>
    </MainContainer>
  );
}
