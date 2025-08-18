import React, { useEffect, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { CMSArticleType } from '@righton/networking';
import { ScreenSize } from '../lib/WebsiteModels';
import { ShareModal } from '../components/article/ShareModal';
import { ShareMobileModal } from '../components/article/ShareMobileModal';
import { ArticleHeader } from '../components/article/ArticleHeader';
import { ArticleContent } from '../components/article/ArticleContent';
import { VideoArticleContent } from '../components/article/VideoArticleContent';
import { OtherArticles } from '../components/article/OtherArticles';
import { BackToLibrary } from '../components/article/BackToLibrary';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import ShareMobileModalBackground from '../components/article/ShareMobileModalBackground';

interface MainContainerProps {
  screenSize: ScreenSize;
}

const MainContainer = styled(Box)<MainContainerProps>(
  ({ theme, screenSize }) => ({
    width: '100%',
    boxSizing: 'border-box',
    background: 'transparent',
  }),
);

export function Article({ cmsClient }: any) { // eslint-disable-line
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;

  const [selectedArticle, setSelectedArticle] = useState<CMSArticleType | null>(
    null,
  );
  const [otherArticles, setOtherArticles] = useState<CMSArticleType[]>([]);
  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOtherArticles, setIsLoadingOtherArticles] = useState(true);
  const [isVideoArticle, setIsVideoArticle] = useState(false);
  const [isMobileShareClicked, setIsMobileShareClicked] = useState(false);
  const articleId = useMatch('/library/:contentId')?.params.contentId;

  const modalWrapperRef = useRef<HTMLDivElement>(null);

  const handleShareClicked = () => {
    setIsShareClicked(true);
  };

  const handleMobileShareClicked = () => {
    setIsMobileShareClicked(true);
  };

  const handleCloseShareModalClick = () => {
    setIsMobileShareClicked(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (
      modalWrapperRef.current &&
      !modalWrapperRef.current.contains(e.target as Node)
    ) {
      setIsShareClicked(false);
    }
  };

  const handleCloseClick = () => {
    setIsShareClicked(false);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await cmsClient.fetchArticle(articleId);
        if (article.youtubeLink !== null) setIsVideoArticle(true);
        setSelectedArticle(article);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    const fetchOtherArticles = async () => {
      const other = await cmsClient.fetchRecentArticles();
      setOtherArticles(other);
      setIsLoadingOtherArticles(false);
    };
    fetchArticle();
    fetchOtherArticles();
  }, [cmsClient, articleId]);

  return (
    <>
      <MainContainer screenSize={screenSize}>
        <MathSymbolsBackground />
        {isLoading || !selectedArticle ? (
          <CircularProgress
            size={50}
            sx={{
              color: '#fff',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ) : (
          <>
            <BackToLibrary screenSize={screenSize} />
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop:
                  screenSize === ScreenSize.LARGE
                    ? `${theme.sizing.lgPadding}px`
                    : `${theme.sizing.lgPaddingMobile}px`,
                paddingBottom:
                  screenSize === ScreenSize.LARGE
                    ? `${theme.sizing.xxLgPadding}px`
                    : `${theme.sizing.lgPaddingMobile}px`,
                paddingLeft:
                  screenSize === ScreenSize.SMALL
                    ? `${theme.sizing.mdPadding}px`
                    : `${theme.sizing.xLgPadding}px`,
                paddingRight:
                  screenSize === ScreenSize.SMALL
                    ? `${theme.sizing.mdPadding}px`
                    : `${theme.sizing.xLgPadding}px`,
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap:
                    screenSize === ScreenSize.LARGE
                      ? `${theme.sizing.xxLgPadding}px`
                      : `${theme.sizing.lgPaddingMobile}px`,
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '648px',
                    paddingBottom:
                      screenSize === ScreenSize.LARGE ? '48px' : '0px',
                    gap: '40px',
                  }}
                >
                  <ArticleHeader
                    screenSize={screenSize}
                    selectedArticle={selectedArticle}
                    articleId={articleId ?? ''}
                    handleShareClicked={handleShareClicked}
                    handleMobileShareClicked={handleMobileShareClicked}
                  />
                  {isVideoArticle ? (
                    <VideoArticleContent article={selectedArticle} />
                  ) : (
                    <ArticleContent
                      article={selectedArticle}
                      screenSize={screenSize}
                    />
                  )}
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap:
                      screenSize === ScreenSize.LARGE
                        ? `${theme.sizing.xLgPadding}px`
                        : `${theme.sizing.lgPaddingMobile}px`,
                  }}
                >
                <Box
                  sx={{
                    width: '100%',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Box
                    style={{
                      width: '100%',
                      border: theme.sizing.dividerBorder,
                      display: 'block',
                    }}
                  />
                  </Box>
                  <OtherArticles
                    articles={otherArticles}
                    screenSize={screenSize}
                    isLoadingArticles={isLoadingOtherArticles}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </MainContainer>
      <AnimatePresence>
        {isShareClicked && (
          <Box
            onMouseDownCapture={handleClickOutside}
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 15000,
            }}
          >
            <motion.div
              ref={modalWrapperRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '21px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingLeft:
                  screenSize === ScreenSize.SMALL
                    ? `${theme.sizing.mdPadding}px`
                    : `${theme.sizing.xLgPadding}px`,
                paddingRight:
                  screenSize === ScreenSize.SMALL
                    ? `${theme.sizing.mdPadding}px`
                    : `${theme.sizing.xLgPadding}px`,
                boxSizing: 'border-box',
              }}
            >
              <ShareModal
                handleCloseClick={handleCloseClick}
                screenSize={screenSize}
              />
            </motion.div>
          </Box>
        )}
        {isMobileShareClicked && (
          <>
            <ShareMobileModalBackground
              isShareModalOpen={isMobileShareClicked}
              handleCloseShareModalClick={handleCloseShareModalClick}
            />
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 15000,
              }}
            >
              <motion.div
                ref={modalWrapperRef}
                initial={{ transform: 'translateY(100%)' }}
                animate={{ transform: 'translateY(1%)' }}
                exit={{ transform: 'translateY(100%)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ShareMobileModal
                  articleId={articleId ?? ''}
                  selectedArticle={selectedArticle}
                  handleCloseShareModalClick={handleCloseShareModalClick}
                />
              </motion.div>
            </Box>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
