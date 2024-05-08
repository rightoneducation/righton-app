
import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles'; // Import styled from MUI

const TitleCCSSTypography = styled(Typography)({
  fontFamily: 'Poppins',
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
