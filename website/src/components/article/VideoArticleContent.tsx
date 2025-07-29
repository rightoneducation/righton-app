import React from 'react';
import { Box } from '@mui/material';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  CMSHeroImage,
  CMSTitleText,
  CMSHeaderText,
  CMSBodyText,
  PortableTextComponentsConfig,
  CMSArticleType
} from '@righton/networking';

interface VideoArticleContainerInterface {
  article: CMSArticleType
}

const getYouTubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export function VideoArticleContent({ // eslint-disable-line
  article
} : VideoArticleContainerInterface) { 
  const videoId = getYouTubeId(article.youtubeLink ?? '');
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', maxWidth: '648px', gap: '40px' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="encrypted-media"
        title="Youtube Video"
        style={{
          height: '450px', 
          border: 0
        }}
      />
      <CMSTitleText>{article.title}</CMSTitleText>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PortableText
          value={article.details}
          components={PortableTextComponentsConfig as PortableTextComponents}
        />
      </Box>
    </Box>
  );
}
