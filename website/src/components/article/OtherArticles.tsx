import React from 'react';
import { Box, Typography, Grid, styled } from '@mui/material';
import {
  CMSArticleType
} from '@righton/networking';
import { v4 as uuidv4 } from 'uuid';
import CornerstoneArticleCard from '../../lib/styledcomponents/CornerstoneArticleCard';
import ArticleCard from '../../lib/styledcomponents/ArticleCard';
import CornerstoneSkeleton from '../library/CornerstoneSkeleton';
import ArticleSkeleton from '../library/ArticleSkeleton';
import { ScreenSize } from '../../lib/WebsiteModels';
import { ButtonContainer, StyledButton } from '../../lib/styledcomponents/StyledComponents';

const ArticleContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  alignItems: 'center'
}));

interface OtherArticlesInterface {
  articles: CMSArticleType[];
  isLoadingArticles: boolean;
  screenSize?: ScreenSize;
}

export function OtherArticles({ // eslint-disable-line
  articles,
  isLoadingArticles,
  screenSize
} : OtherArticlesInterface) {

  // TODO: ~~~Theme~~~
  const primaryGap = '72px';
  const secondaryGap = '48px';
  const countCornerstone = screenSize === ScreenSize.LARGE ? 5 : 3;
  const countArticle = screenSize === ScreenSize.LARGE ? 12 : 6;
  const paddingSide = screenSize === ScreenSize.SMALL ? '12px' : '72px';
  const paddingTopBottom = screenSize === ScreenSize.LARGE ? '96px' : '60px';
  const slideOffset = screenSize === ScreenSize.SMALL ? 24 : 148;

  return (
    <ArticleContainer
    sx={{
      gap: secondaryGap,
    }}
  >
    <Box style={{ width: '100%', display: 'flex', justifyContent: 'start' }}>
      <Typography sx={{fontSize: '20px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF'}}>
          Other Suggested Resources to Explore:
      </Typography>
    </Box>
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
        : articles.map((article: any) => (
            article && 
              <Grid size={{xs:12, md:12, lg:4}} key={article.id}>
                <Box 
                  onClick={() => {
                    window.location.href = `/library/${article._id}`;
                  }} 
                  style={{ cursor: 'pointer' }}
                >
                  {screenSize === ScreenSize.LARGE ? (
                    <CornerstoneArticleCard article={article} screenSize={screenSize} />
                  ) : (
                    <ArticleCard
                      image={article.image || article.thumbnailImage}
                      date={article.date}
                      tags={article.tags}
                      title={article.title}
                      caption={article.caption}
                    />
                  )}
                </Box>
              </Grid>
        ))
      }
    </Grid>
  </ArticleContainer>
  );
}
