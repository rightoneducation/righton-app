import React, { useState } from 'react';
import {
  Collapse,
  Box,
  Divider,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { AnswerType, AnswerPrecision } from '@righton/networking';
import {
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
} from '../../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../../images/dropDownArrow.svg';
import {
  ScreenSize,
  AnswerSettingsDropdownType,
} from '../../../lib/CentralModels';
import { ErrorIcon } from '../../../lib/styledcomponents/CentralStyledComponents';
import errorIcon from '../../../images/errorIcon.svg';
import { SelectAnswerSettingLabel } from '../../../lib/styledcomponents/CreateQuestionStyledComponents';

export const SelectAnswerSettingStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize; error: boolean }>(
  ({ theme, screenSize, error }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: error ? '220px' : '200px',
    maxWidth: error ? '220px' : '200px',
    minHeight: '28px',
    background: '#fffbf6',
    border: '1px solid #02215f',
    padding: '4px 8px',
    gap: error ? '1px' : '9px',
    boxSizing: 'border-box',
    zIndex: 4,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#fffbf6',
    },
    '&:disabled': {
      backgroundColor: `${theme.palette.primary.buttonActionDisable}`,
    },
  }),
);

interface SelectAnswerSettingsProps {
  screenSize: ScreenSize;
  type: AnswerSettingsDropdownType;
  isCardSubmitted: boolean;
  answerSettingsType?: AnswerType | null;
  onSetAnswerSettingsType?: (type: AnswerType) => void;
  answerSettingsPrecisionType?: AnswerPrecision | null;
  onSetAnswerSettingsPrecisionType?: (type: AnswerPrecision) => void;
  isCardError: boolean;
}

export default function SelectAnswerSetting({
  screenSize,
  type,
  isCardSubmitted,
  answerSettingsType,
  onSetAnswerSettingsType,
  answerSettingsPrecisionType,
  onSetAnswerSettingsPrecisionType,
  isCardError,
}: SelectAnswerSettingsProps) {
  const theme = useTheme();
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;

  const answerTypeOptions: { value: AnswerType; label: string }[] = [
    { value: AnswerType.NUMBER, label: 'Number' },
    { value: AnswerType.STRING, label: 'Text' },
    { value: AnswerType.EXPRESSION, label: 'Mathematical Expression' },
    { value: AnswerType.MULTICHOICE, label: 'Multiple Choice' },
  ];

  const precisionOptions: { value: AnswerPrecision; label: string }[] = [
    { value: AnswerPrecision.WHOLE, label: 'Ones (0)' },
    { value: AnswerPrecision.TENTH, label: 'Tenths (0.1)' },
    { value: AnswerPrecision.HUNDREDTH, label: 'Hundredths (0.01)' },
    { value: AnswerPrecision.THOUSANDTH, label: 'Thousandths (0.001)' },
  ];

  const dropdownLabel =
    type !== AnswerSettingsDropdownType.TYPE
      ? 'Answer Type'
      : 'Answer Settings';
  // flag error if phase is not selected or
  const isError =
    (isCardSubmitted && answerSettingsType === null) ||
    (isCardError && answerSettingsType === null) ||
    (isCardSubmitted && answerSettingsPrecisionType === null) ||
    (isCardError && answerSettingsPrecisionType === null);

  const selectAnswerSettingsType = (answerType: AnswerType) => {
    if (onSetAnswerSettingsType) onSetAnswerSettingsType(answerType);
    setIsSelectOpen(false);
  };

  const selectAnswerSettingsNumberType = (precisionType: AnswerPrecision) => {
    if (onSetAnswerSettingsPrecisionType)
      onSetAnswerSettingsPrecisionType(precisionType);
    setIsSelectOpen(false);
  };

  // open menu on click
  const handleMenuToggle = () => {
    setIsSelectOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
      }}
    >
      <SelectAnswerSettingStyle
        error={isError}
        sx={{
          borderRadius: isSelectOpen ? '5px 5px 0 0' : '5px',
          ...(isError && { border: '1px solid #D0254D' }),
        }}
        screenSize={screenSize}
        onClick={handleMenuToggle}
      >
        {isError && (
          <ErrorIcon sx={{ width: 17, height: 17 }} src={errorIcon} />
        )}
        {type === AnswerSettingsDropdownType.TYPE ? (
          <SelectAnswerSettingLabel
            isSelected={answerSettingsType !== null}
            error={isError}
          >
            {answerSettingsType !== null && answerSettingsType !== undefined
              ? answerTypeOptions.find((o) => o.value === answerSettingsType)
                  ?.label
              : dropdownLabel}
          </SelectAnswerSettingLabel>
        ) : (
          <SelectAnswerSettingLabel
            isSelected={answerSettingsPrecisionType !== null}
            error={isError}
          >
            {answerSettingsPrecisionType !== null &&
            answerSettingsPrecisionType !== undefined
              ? precisionOptions.find(
                  (o) => o.value === answerSettingsPrecisionType,
                )?.label
              : dropdownLabel}
          </SelectAnswerSettingLabel>
        )}
        {/* space between is here */}
        <SelectArrowContainer isSelectOpen={isSelectOpen}>
          <img
            src={SelectArrow}
            style={{ color: '#02215f' }}
            alt="Select Arrow"
            width="13px"
            height="12px"
          />
        </SelectArrowContainer>
      </SelectAnswerSettingStyle>

      <Collapse in={isSelectOpen} timeout={1000}>
        <SelectMenu
          isSelectOpen={isSelectOpen}
          screenSize={screenSize}
          sx={{
            backgroundColor: '#fffbf6',
            padding: 0,
            top: 'auto',
            left: 0,
            width: isError ? '220px' : '200px',
            maxWidth: isError ? '220px' : '200px',
            minWidth: '200px',
            borderRadius: '0 0 4px 4px',
            borderRight: '1px solid #02215f',
            borderBottom: '1px solid #02215f',
            borderLeft: '1px solid #02215f',
            borderTop: 'none',
            transform: 'translateY(0px)',
            ...(isSmallerScreen && { zIndex: 5 }),
          }}
        >
          {type === AnswerSettingsDropdownType.TYPE
            ? answerTypeOptions.map((answerTypeOption, i) => {
                return (
                  <Box
                    onClick={() =>
                      selectAnswerSettingsType(answerTypeOption.value)
                    }
                    sx={{ cursor: 'pointer', width: '100%' }}
                  >
                    <SelectMenuItem sx={{ height: '23px', padding: '4px 8px' }}>
                      <Typography
                        fontWeight="normal"
                        fontSize="14px"
                        fontFamily="Rubik"
                        sx={{ color: '#02215f' }}
                      >
                        {answerTypeOption.label}
                      </Typography>
                    </SelectMenuItem>
                    {i !== answerTypeOptions.length - 1 && (
                      <Divider
                        flexItem
                        sx={{
                          width: '100%',
                          background: '#02215f',
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </Box>
                );
              })
            : precisionOptions.map((precisionOptionType, i) => (
                <Box
                  onClick={() =>
                    selectAnswerSettingsNumberType(precisionOptionType.value)
                  }
                  sx={{ cursor: 'pointer', width: '100%' }}
                >
                  <SelectMenuItem sx={{ height: '23px', padding: '4px 8px' }}>
                    <Typography
                      fontWeight="normal"
                      fontSize="14px"
                      fontFamily="Rubik"
                      sx={{ color: '#02215f' }}
                    >
                      {precisionOptionType.label}
                    </Typography>
                  </SelectMenuItem>
                  {i !== precisionOptions.length - 1 && (
                    <Divider
                      flexItem
                      sx={{
                        width: '100%',
                        background: '#02215f',
                        opacity: 0.5,
                      }}
                    />
                  )}
                </Box>
              ))}
        </SelectMenu>
      </Collapse>
    </Box>
  );
}
