import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BodyContentAreaDoubleColumnStyled } from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import BodyCardContainerStyled from '../lib/styledcomponents/BodyCardContainerStyled';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';
import Card from '../components/Card';

interface PlaceholderContentAreaProps {
}

export default function PlaceholderContentArea({
}: PlaceholderContentAreaProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
  <BodyContentAreaDoubleColumnStyled
    container
    style={{ paddingTop: '16px' }}
  >
    <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
      <Card />
      <Card />
    </Grid>
    <Grid item xs={12} sm={6} sx={{ width: '100%', height: '100%' }}>
      <Card />
      <Card />
    </Grid>
  </BodyContentAreaDoubleColumnStyled>

  );
}

