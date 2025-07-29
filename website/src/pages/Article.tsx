import React, { useEffect, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { ShareModal } from '../components/article/ShareModal';
import { ArticleHeader } from '../components/article/ArticleHeader';
import { ArticleContent } from '../components/article/ArticleContent';
import { VideoArticleContent } from '../components/article/VideoArticleContent';
import MathSymbolBackground from '../images/mathSymbolsBackground4.svg';

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

export function Article({ cmsClient }: any) { // eslint-disable-line
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isShareClicked, setIsShareClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoArticle, setIsVideoArticle] = useState(false);
  const articleId = useMatch('/library/:contentId')?.params.contentId;

  const modalWrapperRef = useRef<HTMLDivElement>(null);

  const handleShareClicked = () => {
    setIsShareClicked(true);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (
      modalWrapperRef.current &&
      !modalWrapperRef.current.contains(e.target as Node)
    ) {
      setIsShareClicked(false);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await cmsClient.fetchArticle(articleId);
        if (article.youtubeLink !== null)
          setIsVideoArticle(true);
        setSelectedArticle(article);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [cmsClient, articleId]);

  return (
    <MainContainer>
      {isLoading ? (
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
        <Box style={{ display: 'flex', flexDirection: 'column', maxWidth: '648px', gap: '40px' }}>
          <ArticleHeader
            selectedArticle={selectedArticle}
            articleId={articleId ?? ''}
            handleShareClicked={handleShareClicked}
          />
          { isVideoArticle 
            ? <VideoArticleContent article={selectedArticle} />
            : <ArticleContent article={selectedArticle} />
          }
          <AnimatePresence>
            {isShareClicked && (
              <Box
                onMouseDownCapture={handleClickOutside}
                sx={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 1,
                }}
              >
                <motion.div
                  ref={modalWrapperRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{
                    position: 'fixed',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 1000,
                    paddingBottom: '24px',
                  }}
                >
                  <ShareModal />
                </motion.div>
              </Box>
            )}
          </AnimatePresence>
        </Box>
      )}
    </MainContainer>
  );
}
