  import { type PortableTextComponents } from '@portabletext/react';
import { styled } from '@mui/material/styles';
import { CMSHeaderText, CMSBodyText } from './CMSStyledComponents';

const StyledLink = styled('a')(() => ({
  color: '#FFFFFF !important',
  textDecoration: 'underline',
  '&:hover': {
    color: '#FFFFFF !important',
  },
  '&:visited': {
    color: '#FFFFFF !important',
  },
  '&:link': {
    color: '#FFFFFF !important',
  },
}));

  export const PortableTextComponentsConfig: PortableTextComponents = {
    block: {
      h1: ({ children }) => (
        <CMSHeaderText>{children}</CMSHeaderText>
      ),
      h2: ({ children }) => (
        <CMSHeaderText>{children}</CMSHeaderText>
      ),
      h3: ({ children }) => (
        <CMSHeaderText>{children}</CMSHeaderText>
      ),
      a: ({ children }) => (
        <StyledLink>{children}</StyledLink>
      ),
      normal: ({ children }) => (
        <CMSBodyText sx={{ 
          '& a': {
            color: '#FFFFFF !important',
            textDecoration: 'underline',
          },
          '& a:hover': {
            color: '#FFFFFF !important',
          },
          '& a:visited': {
            color: '#FFFFFF !important',
          },
          '& a:link': {
            color: '#FFFFFF !important',
          }
        }}>{children}</CMSBodyText>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul style={{ color: '#FFFFFF' }}>
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol style={{ color: '#FFFFFF' }}>
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li>
          <CMSBodyText>{children}</CMSBodyText>
        </li>
      ),
      number: ({ children }) => (
        <li>
          <CMSBodyText>{children}</CMSBodyText>
        </li>
      ),
    },
    hardBreak: () => <br />,
  }