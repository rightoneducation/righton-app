import React, { useState, useRef } from 'react';
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
import { debounce } from 'lodash';
import { ConfidenceLevel } from '@righton/networking';
import BodyCardStyled from '../lib/styledcomponents/BodyCardStyled';

interface ConfidenceMeterCardProps {
  selectedOption: string;
  handleSelectOption: (confidence: ConfidenceLevel) => void;
  isSelected: boolean;
  isSmallDevice: boolean;
  isTimeUp: boolean;
}

export default function ConfidenceMeterCard({
  selectedOption,
  handleSelectOption,
  isSelected,
  isSmallDevice,
  isTimeUp,
}: ConfidenceMeterCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [localSelectedOption, setLocalSelectedOption] = useState(selectedOption);

  // Keep a ref to the latest handleSelectOption so the debounced function
  // never holds a stale closure, without recreating the debounce each render.
  const handleSelectOptionRef = useRef(handleSelectOption);
  handleSelectOptionRef.current = handleSelectOption;

  const debouncedSelectRef = useRef(
    debounce((confidence: ConfidenceLevel) => {
      handleSelectOptionRef.current(confidence);
    }, 800)
  );

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
      sx={{
        display: 'block',
        boxSizing: 'border-box',
        textAlign: 'left',
        width: '100%',
        marginBottom: `${theme.sizing.smallPadding}px`,
      }}
    >
      <Typography variant="h1" style={{color: theme.palette.designSystem.surface.play}}>
        {t('gameinprogress.chooseanswer.confidenceheader')}
      </Typography>
    </Box>
  );

  const responseOption = (option: IConfidenceOption) => {
    return (
      <FormControlLabel
        key={option.value}
        value={option.value}
        sx={{ margin: 0 }}
        control={
          <Radio
            sx={{
              padding: '12px',
              '& .MuiSvgIcon-root': {
                fontSize: '30px',
              },
              '&.Mui-checked': {
                color: isTimeUp
                  ? `${theme.palette.primary.extraDarkGrey}`
                  : `${theme.palette.primary.blue}`,
              },
              '&.Mui-disabled.Mui-checked': {
                color: `${theme.palette.primary.extraDarkGrey}`,
              },
            }}
          />
        }
        label={<Typography
          style={{
            fontSize: isSmallDevice ?
              `${theme.typography.h4.fontSize}` :
              `${theme.typography.h5.fontSize}`,
            maxWidth: '50px',
            textAlign: 'center',
          }}>
          {option.text}
        </Typography>}
        labelPlacement="bottom"
      />
    );
  };

  const statusText = (() => {
    if (!isSelected) return null;
    return (
      <Box
        sx={{
          display: 'block',
          boxSizing: 'border-box',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: `${theme.palette.primary.darkBlue}`, opacity: '0.5' }}
        >
          {isTimeUp
            ? t('gameinprogress.chooseanswer.timeupconfidenceresponse')
            : t('gameinprogress.chooseanswer.submittedconfidenceresponse')}
        </Typography>
      </Box>
    );
  })();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isTimeUp) return;
    const newValue =
      confidenceOptionArray.find(
        (option) => option.value === event.target.value
      )?.value ?? ConfidenceLevel.NOT_RATED;
    setLocalSelectedOption(newValue);
    debouncedSelectRef.current(newValue);
  };

  const responseOptions = (
    <FormControl fullWidth disabled={isTimeUp}>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={localSelectedOption}
        onChange={handleRadioChange}
        sx={{
          flexWrap: 'nowrap',
          textAlign: 'center',
          justifyContent: 'space-between',
          marginBottom: `${theme.sizing.smallPadding}px`,
        }}
      >
        {confidenceOptionArray.map((option) => responseOption(option))}
      </RadioGroup>
    </FormControl>
  );

  return (
    <BodyCardStyled>
      {confidenceHeader}
      {responseOptions}
      {statusText}
    </BodyCardStyled>
  );
}
