import React from 'react';
import { Grid } from '@mui/material';
import { BodyContentAreaDoubleColumnStyled } from '../lib/styledcomponents/layout/BodyContentAreasStyled';
import Card from './Card';

interface PlaceholderContentAreaProps {} // eslint-disable-line

export default function PlaceholderContentArea({}: PlaceholderContentAreaProps) {
  // eslint-disable-line
  return (
    <BodyContentAreaDoubleColumnStyled container style={{ paddingTop: '16px' }}>
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
