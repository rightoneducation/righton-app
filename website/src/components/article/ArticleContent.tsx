import React from 'react';
import { Box, useTheme } from '@mui/material';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  CMSHeroImage,
  CMSTitleText,
  CMSHeaderText,
  CMSBodyText,
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
      <CMSHeroImage
        src={article?.image?.url}
        alt="Article Hero"
        style={screenSize === ScreenSize.SMALL ? { aspectRatio: '1 / 1' } : {}}
      />
      <CMSTitleText>{article.title}</CMSTitleText>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '19px' }}>
        <CMSBodyText>
          {article.category}
        </CMSBodyText>
        <CMSBodyText>
          {article.apaCitation}
        </CMSBodyText>
        {article.abstract &&
         <>
         <CMSHeaderText>Abstract</CMSHeaderText>
         <CMSBodyText>
            {article.abstract}
          </CMSBodyText>
         </>
        }
        <CMSHeaderText>Summary</CMSHeaderText>
        <CMSBodyText>
          {article.summary}
        </CMSBodyText>
        <CMSBodyText>
          {article.resourceLink}
        </CMSBodyText>
      </Box>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${theme.sizing.mdPadding}px`,
        }}
      >
        <PortableText
          value={article.details}
          components={PortableTextComponentsConfig as PortableTextComponents}
        />
      </Box>
    </Box>
  );
}
