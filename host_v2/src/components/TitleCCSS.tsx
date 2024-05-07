// import React from 'react';
// import { Typography } from '@mui/material';

// interface CCSSProps {
//   grade: string;
//   domain: string;
//   cluster: string;
//   standard: string;
// }

// export default function CCSS({
//   grade,
//   domain,
//   cluster,
//   standard
// }: CCSSProps) {
//   if (grade === 'Mashup') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >Mashup</Typography>;
//   if (grade === 'Misc' && domain === 'Misc') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >Misc.</Typography>;
//   if (grade === 'Misc') return <Typography style={{fontWeight: 700, color: '#9139F8'}} >{`${domain}`}</Typography>;
//   if (grade && domain) {
//     const clusterCombined: string = cluster ? `.${cluster}` : '';
//     const standardCombined: string = standard ? `.${standard}` : '';
//     const domainCombined: string = domain ? `.${domain}` : '';
//     return (
//       <Typography style={{fontWeight: 700, color: '#9139F8'}}>
//         {`${grade}${domainCombined}${clusterCombined}${standardCombined}`}
//       </Typography>
//     );
//   }
//   return null;
// }
import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles'; // Import styled from MUI

// Styled component using the same typography style as TitleTypography
const TitleCCSSTypography = styled(Typography)({
  fontFamily: 'Poppins',
  // width: '100%', 
  textAlign: 'left', 
  fontWeight: 700, // No need for quotes here
  fontSize: '12px',
  lineHeight: '21px',
  letterSpacing: '.15em',
  color: '#9BA9D0', // Match the color from the TitleTypography
});

interface TitleCCSSProps {
  grade: string;
  domain: string;
  cluster: string;
  standard: string;
}

export default function TitleCCSS({
  grade,
  domain,
  cluster,
  standard
}: TitleCCSSProps) {
  if (grade === 'Mashup') return <TitleCCSSTypography>Mashup</TitleCCSSTypography>; // Use CCSSTypography component
  if (grade === 'Misc' && domain === 'Misc') return <TitleCCSSTypography>Misc.</TitleCCSSTypography>; // Use CCSSTypography component
  if (grade === 'Misc') return <TitleCCSSTypography>{domain}</TitleCCSSTypography>; // Use CCSSTypography component
  if (grade && domain) {
    const clusterCombined: string = cluster ? `.${cluster}` : '';
    const standardCombined: string = standard ? `.${standard}` : '';
    const domainCombined: string = domain ? `.${domain}` : '';
    return (
      <TitleCCSSTypography>
        {`${grade}${domainCombined}${clusterCombined}${standardCombined}`}
      </TitleCCSSTypography>
    );
  }
  return null;
}
