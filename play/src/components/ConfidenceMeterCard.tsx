import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface ConfidenceMeterCardProps {
  isSelected: boolean;
}

export default function ConfidenceMeterCard({
  isSelected,
}: ConfidenceMeterCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const confidenceOptionArray = [
    t('gameinprogress.chooseanswer.confidenceoption1'),
    t('gameinprogress.chooseanswer.confidenceoption2'),
    t('gameinprogress.chooseanswer.confidenceoption3'),
    t('gameinprogress.chooseanswer.confidenceoption4'),
    t('gameinprogress.chooseanswer.confidenceoption5')
  ]

  const confidenceHeader = <Box display="inline" sx={{ textAlign: 'left', marginX: `${theme.sizing.extraSmallPadding}px`, width: '100%' }}>
    <Typography variant="h2" sx={{ color: `${theme.palette.primary.darkBlue}` }}>
      {t('gameinprogress.chooseanswer.confidenceheader')}
    </Typography>
  </Box>

  const chooseConfidenceText = <Box display="inline" sx={{ textAlign: 'center', marginY: `${theme.sizing.mediumPadding}px` }}>
    <Typography variant="body1">
      {t('gameinprogress.chooseanswer.answerthankyou1')}
    </Typography>
    <Typography variant="body1">
      {t('gameinprogress.chooseanswer.confidencetext')}
    </Typography >
  </Box >

  const responseOption = (
    text: string
  ) => {
    return (
      <Box maxWidth={`${theme.sizing.extraLargePadding}px`} sx={{ textAlign: 'center', alignItems: 'center', marginX: `${theme.sizing.extraSmallPadding}px` }}>
        <FormControlLabel value={confidenceOptionArray.indexOf(text) + 1} control={<Radio />} label={text} labelPlacement='bottom' sx={{ marginX: "0" }} />
      </Box>
    )
  };

  const responseOptions = <Box display="inline" sx={{ alignItems: 'center' }}>
    <RadioGroup row value="confidence" sx={{ textAlign: 'center', justifyContent: 'center' }}>
      {confidenceOptionArray.map((option) => responseOption(option))}
    </RadioGroup>
  </Box>

  return (
    <BodyCardStyled>
      {confidenceHeader}
      {chooseConfidenceText}
      {responseOptions}
    </BodyCardStyled>
  );
}