
import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles'; 

const TitleCCSSTypography = styled(Typography)({
  fontFamily: 'Poppins',
  textAlign: 'left', 
  fontWeight: 700, 
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
// export default function TitleCCSS({ grade, domain, cluster, standard }: TitleCCSSProps) {
//   if (grade === 'Mashup') {
//     return <Typography style={{ fontWeight: 700, color: '#9139F8' }}>Mashup</Typography>;
//   }

//   if (grade === 'Misc' && domain === 'Misc') {
//     return <Typography style={{ fontWeight: 700, color: '#9139F8' }}>Misc.</Typography>;
//   }

//   if (grade === 'Misc') {
//     return <Typography style={{ fontWeight: 700, color: '#9139F8' }}>{`${domain}`}</Typography>;
//   }

//   if (grade && domain) {
//     const clusterCombined: string = cluster ? `.${cluster}` : '';
//     const standardCombined: string = standard ? `.${standard}` : '';
//     const domainCombined: string = domain ? `.${domain}` : '';

//     return (
//       <Typography style={{ fontWeight: 700, color: '#9139F8' }}>
//         {`${grade}${domainCombined}${clusterCombined}${standardCombined}`}
//       </Typography>
//     );
//   }

//   return null;
// }

export default function TitleCCSS({ grade, domain, cluster, standard }: TitleCCSSProps) {
  let titleText;

  switch (true) {
    case grade === 'Mashup':
      titleText = 'Mashup';
      break;
    case grade === 'Misc' && domain === 'Misc':
      titleText = 'Misc.';
      break;
    case grade === 'Misc':
      titleText = domain;
      break;
    case !!grade && !!domain: {
      const clusterCombined = cluster ? `.${cluster}` : '';
      const standardCombined = standard ? `.${standard}` : '';
      const domainCombined = domain ? `.${domain}` : '';
      titleText = `${grade}${domainCombined}${clusterCombined}${standardCombined}`;
      break;
    }
    default:
      return null;
  }

  return <TitleCCSSTypography>{titleText}</TitleCCSSTypography>;
}
