import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CMSCardThumbnailImage,
  CMSCardTag,
  CMSCardCaption,
  CMSCardTitle,
  CMSCardDateText,
} from '@righton/networking';

type ArticleCardProps = {
  image: any;
  tags: string[];
  date: string;
  title: string;
  caption: string;
};

const CardContainer = styled(Box)(({ theme }) => ({
  maxHeight: '98px',
  display: 'flex',
  gap: `${theme.sizing.smPadding}px`,
  background: '#224996',
  boxSizing: 'border-box',
  borderRadius: '8px',
}));

const InfoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.smPadding}px`,
  padding: `${theme.sizing.smPadding}px 0`,
  boxSizing: 'border-box',
  width: '100%',
}));

export default function ArticleCard({
  image,
  tags,
  date,
  title,
  caption,
}: ArticleCardProps) {
  const theme = useTheme();
  return (
    <CardContainer>
      <CMSCardThumbnailImage src={image.url} alt="Article Thumbnail" />
      <InfoWrapper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            gap: `${theme.sizing.smPadding}px`,
            paddingRight: `${theme.sizing.smPadding}px`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {tags.map((tag) => (
              <CMSCardTag key={tag}>{tag}</CMSCardTag>
            ))}
            <CMSCardDateText> {date} </CMSCardDateText>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <CMSCardTitle>{title}</CMSCardTitle>
            <CMSCardCaption>{caption}</CMSCardCaption>
          </Box>
        </Box>
      </InfoWrapper>
    </CardContainer>
  );
}
