import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfidenceLevel, isNullOrUndefined } from '@righton/networking';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface ConfidenceMeterCardProps {
  selectedOption: string;
  handleSelectOption: (confidence: ConfidenceLevel) => void;
  isSelected: boolean;
  isSmallDevice: boolean;
  timeOfLastSelect: number;
  setTimeOfLastSelect: (time: number) => void;
}

export default function ConfidenceMeterCard({
  selectedOption,
  handleSelectOption,
  isSelected,
  isSmallDevice,
  timeOfLastSelect,
  setTimeOfLastSelect,
}: ConfidenceMeterCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  interface IConfidenceOption {
    text: string;
    value: ConfidenceLevel;
  }

  const ConfidenceTitleTypography = styled(Typography)({
    lineHeight: '28px',
    fontFamily: 'Karla',
    fontWeight: '800',
    fontSize: '24px',
    color: 'black',
  });

  const confidenceOptionArray: IConfidenceOption[] = [
    {
      text: t('gameinprogress.chooseanswer.confidenceoption1'),
      value: ConfidenceLevel.NOT_AT_ALL,
    },
    {
      text: t('gameinprogress.chooseanswer.confidenceoption2'),
      value: ConfidenceLevel.KINDA,
    },
    {
      text: t('gameinprogress.chooseanswer.confidenceoption3'),
      value: ConfidenceLevel.QUITE,
    },
    {
      text: t('gameinprogress.chooseanswer.confidenceoption4'),
      value: ConfidenceLevel.VERY,
    },
    {
      text: t('gameinprogress.chooseanswer.confidenceoption5'),
      value: ConfidenceLevel.TOTALLY,
    },
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
      <ConfidenceTitleTypography>
        {t('gameinprogress.chooseanswer.confidenceheader')}
      </ConfidenceTitleTypography>
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

  const responseOption = (option: IConfidenceOption) => {
    return (
      <Box style={{width: '100%', maxWidth: `${theme.sizing.mediumPadding}px`, display: 'flex', justifyContent: 'center', textAlign: 'center', paddingLeft: '8px', paddingRight: '8px'}}>
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <Radio
              size={isSmallDevice ? 'small' : 'medium'}
              sx={{
                '&.Mui-checked': {
                  color: `${theme.palette.primary.blue}`,
                },
              }}
            />
          }
          label={<Typography
            style={{
              fontSize: isSmallDevice ?
                `${theme.typography.h4.fontSize}` :
                `${theme.typography.h5.fontSize}`
            }}>
            {option.text}
          </Typography>}
          labelPlacement="bottom"
          style={{width: '100%'}}
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
        {isSelected
          ? t('gameinprogress.chooseanswer.submittedconfidenceresponse')
          : t('gameinprogress.chooseanswer.sendingconfidenceresponse')}
      </Typography>
    </Box>
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentEpochTimeInSeconds = new Date().getTime() / 1000;
    if (
      isNullOrUndefined(timeOfLastSelect) ||
      currentEpochTimeInSeconds - timeOfLastSelect > 5
    ) {
      const confidence =
        confidenceOptionArray.find(
          (option) => option.value === event.target.value
        )?.value ?? ConfidenceLevel.NOT_RATED;
      setTimeOfLastSelect(currentEpochTimeInSeconds);
      handleSelectOption(confidence);
    }
  };

  const responseOptions = (
    <FormControl fullWidth>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={selectedOption}
        onChange={handleRadioChange}
        sx={{
          textAlign: 'center',
          justifyContent: 'space-between',
          marginY: `${theme.sizing.mediumPadding}px`,
        }}
      >
        {confidenceOptionArray.map((option) => responseOption(option))}
      </RadioGroup>
    </FormControl>
  );

  return (
    <BodyCardStyled
      sx={{
        paddingLeft: `${theme.sizing.extraSmallPadding}px`,
        paddingRight: `${theme.sizing.extraSmallPadding}px`
      }}
    >
      {confidenceHeader}
      {chooseConfidenceText}
      {responseOptions}
      {!isNullOrUndefined(timeOfLastSelect) || isSelected
        ? sendingResponseText
        : null}
    </BodyCardStyled>
  );
}
