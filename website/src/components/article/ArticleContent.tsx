import React from 'react';
import { Box, useTheme } from '@mui/material';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  CMSHeroImage,
  CMSTitleText,
  CMSHeaderText,
  CMSBodyText,
  CMSLinkText,
  PortableTextComponentsConfig,
  CMSArticleType,
} from '@righton/networking';
import { ScreenSize } from '../../lib/WebsiteModels';

interface ArticleContainerInterface {
  article: CMSArticleType;
  screenSize?: ScreenSize;
}

export function ArticleContent({ // eslint-disable-line
  article,
  screenSize,
}: ArticleContainerInterface) {
  const theme = useTheme();
  // Function to get youtube id for embedding if youtubelink field is present
  const getYouTubeId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(article.youtubeLink ?? '');

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '648px',
        gap:
          screenSize !== ScreenSize.LARGE
            ? `${theme.sizing.mdPadding}px`
            : '40px',
      }}
    >
      { (article.youtubeLink && article.youtubeLink !== '') ? 
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="encrypted-media"
            title="Video Resource"
            style={{
              width: '100%',
              height: '450px',
              border: 0,
              borderRadius: '8px',
            }}
          /> 
        :
        <CMSHeroImage
          src={article?.image?.url}
          alt="Article Hero"
          style={screenSize === ScreenSize.SMALL ? { aspectRatio: '1 / 1' } : {}}
        />
      }
      <CMSTitleText>{article.title}</CMSTitleText>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: article.apaCitation ? '19px' : '0px' }}>
        <CMSBodyText>
          {article.category}
        </CMSBodyText>
        <CMSBodyText>
          {article.apaCitation}
        </CMSBodyText>
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${theme.sizing.mdPadding}px`,
        }}
      >
        { article.abstract &&
          <>
            <CMSHeaderText>Abstract</CMSHeaderText>
            <PortableText
              value={article.abstract}
              components={PortableTextComponentsConfig as PortableTextComponents}
            />
          </>
        }
        { article.summary &&
        <>
          <CMSHeaderText>Summary</CMSHeaderText>
          <PortableText
            value={article.summary}
            components={PortableTextComponentsConfig as PortableTextComponents}
          />
        </>
        }
        { article.content  &&
          <>
            { article.contentHeader &&
              <CMSHeaderText>{article.contentHeader}</CMSHeaderText>
            }
            <PortableText
              value={article.content}
              components={PortableTextComponentsConfig as PortableTextComponents}
            />
          </>
        }
        <CMSLinkText onClick={() => {
          window.open(article.resourceLink, '_blank');
        }} style={{ cursor: 'pointer' }}>
          {article.resourceLink}
        </CMSLinkText>
      </Box>
    </Box>
  );
}
