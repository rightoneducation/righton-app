import React, { useEffect, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  CMSHeroImage,
  CMSTitleText,
  CMSHeaderText,
  CMSBodyText,
  PortableTextComponentsConfig
} from '@righton/networking';
import { ShareModal } from '../components/article/ShareModal';
import { ArticleHeader } from '../components/article/ArticleHeader';
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
          <CMSHeroImage src={selectedArticle.image.url} alt="Article Hero" />
          <CMSTitleText>{selectedArticle.title}</CMSTitleText>
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <CMSBodyText><strong>Author:</strong> {selectedArticle.author}</CMSBodyText>
            <CMSBodyText><strong>Affiliation:</strong> {selectedArticle.affiliation}</CMSBodyText>
            <CMSBodyText><strong>Contact:</strong> {selectedArticle.contact}</CMSBodyText>
          </Box>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PortableText
              value={selectedArticle.details}
              components={PortableTextComponentsConfig as PortableTextComponents}
            />
          </Box>
          <CMSHeaderText>{selectedArticle.header}</CMSHeaderText>
          <CMSBodyText>{selectedArticle.body}</CMSBodyText>

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
