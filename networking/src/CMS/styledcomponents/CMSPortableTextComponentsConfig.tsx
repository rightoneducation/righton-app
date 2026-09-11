  import { type PortableTextComponents } from '@portabletext/react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { CMSHeaderText, CMSBodyText } from './CMSStyledComponents';

interface CMSTableRow {
  _key?: string;
  cells?: string[];
}

interface CMSTableValue {
  headerRow?: boolean;
  rows?: CMSTableRow[];
}

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
    types: {
      table: ({ value }: { value: CMSTableValue }) => (
        <Box style={{ width: '100%', overflowX: 'auto' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              whiteSpace: 'nowrap',
              color: '#FFFFFF',
            }}
          >
            <tbody>
              {(value.rows ?? []).map((row, rowIndex) => {
                const isHeader = value.headerRow && rowIndex === 0;
                const cellStyle = {
                  padding: '6px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  textAlign: 'left' as const,
                };
                return (
                  <tr key={row._key ?? rowIndex}>
                    {(row.cells ?? []).map((cell, cellIndex) =>
                      isHeader ? (
                        <th key={cellIndex} style={cellStyle}>
                          <CMSBodyText style={{ fontWeight: 700 }}>{cell}</CMSBodyText>
                        </th>
                      ) : (
                        <td key={cellIndex} style={cellStyle}>
                          <CMSBodyText>{cell}</CMSBodyText>
                        </td>
                      ),
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      ),
    },
  }
