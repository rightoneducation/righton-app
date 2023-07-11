import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface ConfidenceMeterCardProps {
  selectedOption: number | null;
  handleSelectOption: (option: number) => void;
  isSelected: boolean;
  isSmallDevice: boolean;
}

export default function ConfidenceMeterCard({
  selectedOption,
  handleSelectOption,
  isSelected,
  isSmallDevice
}: ConfidenceMeterCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const confidenceOptionArray = [
    t('gameinprogress.chooseanswer.confidenceoption1'),
    t('gameinprogress.chooseanswer.confidenceoption2'),
    t('gameinprogress.chooseanswer.confidenceoption3'),
    t('gameinprogress.chooseanswer.confidenceoption4'),
    t('gameinprogress.chooseanswer.confidenceoption5'),
  ];

  const confidenceHeader = (
    <Box
      display="inline"
      sx={{
        textAlign: 'left',
        marginX: `${theme.sizing.extraSmallPadding}px`,
        width: '100%',
        marginBottom: `${theme.sizing.smallPadding}px`,
      }}
    >
      <Typography
        variant="h2"
        sx={{ color: `${theme.palette.primary.darkBlue}` }}
      >
        {t('gameinprogress.chooseanswer.confidenceheader')}
      </Typography>
    </Box>
  );
  const chooseConfidenceText = (
    <Box display="inline" sx={{ textAlign: 'center' }}>
      <Typography variant="body1">
        {t('gameinprogress.chooseanswer.answerthankyou1')}
      </Typography>
      <Typography variant="body1">
        {t('gameinprogress.chooseanswer.confidencetext')}
      </Typography>
    </Box>
  );
  const responseOption = (text: string, index: number) => {
    return (
      <Box
        maxWidth={isSmallDevice ? `${theme.sizing.largePadding}px` : `${theme.sizing.extraLargePadding}px`}
        sx={{
          textAlign: 'center',
          alignItems: 'center',
          marginX: `${theme.sizing.extraSmallPadding}px`
        }}
      >
        <FormControlLabel
          key={index}
          value={index}
          control={
            <Radio
              sx={{
                '&.Mui-checked': {
                  color: `${theme.palette.primary.blue}`,
                },
              }}
            />
          }
          label={text}
          labelPlacement="bottom"
          sx={{ marginX: '0' }}
        />
      </Box>
    );
  };
  const sendingResponseText = (
    <Box
      display="inline"
      sx={{
        textAlign: 'center',
        marginBottom: `${theme.sizing.smallPadding}px`,
      }}
    >
      <Typography
        variant="body1"
        sx={{ color: `${theme.palette.primary.darkBlue}`, opacity: '0.5' }}
      >
        {t('gameinprogress.chooseanswer.sendingconfidenceresponse')}
      </Typography>
    </Box>
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectOption(parseInt((event.target as HTMLInputElement).value, 10));
  };

  const responseOptions = (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={selectedOption}
        onChange={handleRadioChange}
        sx={{
          textAlign: 'center',
          justifyContent: 'center',
          marginY: `${theme.sizing.mediumPadding}px`,
        }}
      >
        {confidenceOptionArray.map((option, index) => responseOption(option, index))}
      </RadioGroup>
    </FormControl>
  );

  return (
    <BodyCardStyled
      sx={{
        marginTop: `${theme.sizing.smallPadding}px`,
      }}
    >
      {confidenceHeader}
      {chooseConfidenceText}
      {responseOptions}
      {isSelected ? sendingResponseText : null}
    </BodyCardStyled>
  );
}
