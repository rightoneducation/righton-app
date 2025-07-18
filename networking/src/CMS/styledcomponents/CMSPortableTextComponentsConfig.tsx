  import { type PortableTextComponents } from '@portabletext/react';
  import { CMSHeaderText, CMSBodyText } from './CMSStyledComponents';

  export const PortableTextComponentsConfig: PortableTextComponents = {
    block: {
      h3: ({children}) => (
        <CMSHeaderText>{children}</CMSHeaderText>
      ),
      normal: ({children}) => (
        <CMSBodyText>{children}</CMSBodyText>
      ),
    },
    hardBreak: () => <br />,
  }