
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
