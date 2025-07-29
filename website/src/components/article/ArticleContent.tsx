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

interface ArticleContainerInterface {
  article: CMSArticleType
}

export function ArticleContent({ // eslint-disable-line
  article
} : ArticleContainerInterface) {

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', maxWidth: '648px', gap: '40px' }}>
      <CMSHeroImage src={article?.image?.url} alt="Article Hero" />
      <CMSTitleText>{article.title}</CMSTitleText>
      <Box style={{ display: 'flex', flexDirection: 'column' }}>
        <CMSBodyText><strong>Author:</strong> {article.author}</CMSBodyText>
        <CMSBodyText><strong>Affiliation:</strong> {article.affiliation}</CMSBodyText>
        <CMSBodyText><strong>Contact:</strong> {article.contact}</CMSBodyText>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PortableText
          value={article.details}
          components={PortableTextComponentsConfig as PortableTextComponents}
        />
      </Box>
    </Box>
  );
}
