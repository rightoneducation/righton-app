  import { type PortableTextComponents } from '@portabletext/react';
  import { CMSHeaderText, CMSBodyText } from './CMSStyledComponents';

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
      normal: ({ children }) => (
        <CMSBodyText>{children}</CMSBodyText>
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