import React, { useState } from 'react';
import {
  Collapse,
  Box,
  Divider,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { 
  CentralQuestionTemplateInput, 
  AnswerType,
  AnswerPrecision 
} from '@righton/networking';
import {
  SelectArrowContainer,
  SelectMenu,
  SelectMenuItem,
} from '../../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../../images/dropDownArrow.svg';
import { ScreenSize } from '../../../lib/CentralModels';
import { SelectPhaseLabel } from '../../../lib/styledcomponents/CreateGameStyledComponent';

export const SelectAnswerSettings = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<{ screenSize: ScreenSize; error: boolean }>(
  ({ theme, screenSize, error }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '361px',
    minHeight: '28px',
    background: '#FFFFFF',
    border: '1px solid #02215f',
    padding: '4px 8px',
    gap: error ? '1px' : '9px', // ask design team since button width is 128px
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

interface AnswerSettingsDropdownProps {
  screenSize: ScreenSize;
  draftQuestion: CentralQuestionTemplateInput;
  onHandleAnswerSettingsChange: (   
    draftQuestionInput: CentralQuestionTemplateInput,
    answerType: AnswerType,
    answerPrecision?: AnswerPrecision
  ) => void;
}

export default function AnswerSettingsDropdown({
  screenSize,
  draftQuestion,
  onHandleAnswerSettingsChange,
}: AnswerSettingsDropdownProps) {
  const theme = useTheme();
  // maps that connect AnswerType enum to display string
  const answerSettingsMap: { [key in AnswerType]: string } = {
    [AnswerType.NUMBER]: 'Number',
    [AnswerType.STRING]: 'Text',
    [AnswerType.EXPRESSION]: 'Mathematical Expression',
    [AnswerType.MULTICHOICE]: 'Multiple Choice',
  };
  // maps that connect AnswerPrecision enum to display string
  const answerPrecisionMap: { [key in AnswerPrecision]: string } = {
    [AnswerPrecision.WHOLE]: 'Ones (0)',
    [AnswerPrecision.TENTH]: 'Tenths (0.1)',
    [AnswerPrecision.HUNDREDTH]: 'Hundredths (0.01)',
    [AnswerPrecision.THOUSANDTH]: 'Thousandths (0.001)',
  };
  const [answerType, setAnswerType] = useState<AnswerType>(draftQuestion.correctCard.answerSettings.answerType);
  const [answerPrecision, setAnswerPrecision] = useState<AnswerPrecision>(draftQuestion.correctCard.answerSettings.answerPrecision ?? AnswerPrecision.WHOLE);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState<boolean>(false);
  const [isPrecisionMenuOpen, setIsPrecisionMenuOpen] = useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;

  // handle phase selection on menu item click
  const handleAnswerSettingsChange = (localAnswerType: AnswerType, localAnswerPrecision?: AnswerPrecision) => {
    setAnswerType(localAnswerType);
    setAnswerPrecision(localAnswerPrecision ?? AnswerPrecision.WHOLE);
    onHandleAnswerSettingsChange(draftQuestion, localAnswerType, localAnswerPrecision ?? AnswerPrecision.WHOLE);
    setIsTypeMenuOpen(false);
    setIsPrecisionMenuOpen(false);
  };

  // open menu on click
  const handleTypeMenuToggle = () => {
    setIsPrecisionMenuOpen(false);
    setIsTypeMenuOpen((prev) => !prev);
  };

  const handlePrecisionMenuToggle = () => {
    setIsTypeMenuOpen(false);
    setIsPrecisionMenuOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        gap: `${theme.sizing.xSmPadding}px`,
      }}
    >
      <SelectAnswerSettings
        error={false}
        sx={{
          borderRadius: isTypeMenuOpen ? '5px 5px 0 0' : '5px',
        }}
        screenSize={screenSize}
        onClick={handleTypeMenuToggle}
      >
        <SelectPhaseLabel isSelected={answerType !== null} error={false} style={{fontWeight: 'normal'}}>
          {answerType !== null ? answerSettingsMap[answerType] : ``}
        </SelectPhaseLabel>
        {/* space between is here */}
        <SelectArrowContainer isSelectOpen={isTypeMenuOpen}>
          <img
            src={SelectArrow}
            style={{ color: '#02215f' }}
            alt="Select Arrow"
            width="13px"
            height="12px"
          />
        </SelectArrowContainer>
      </SelectAnswerSettings>
      <Collapse 
        in={isTypeMenuOpen} 
        timeout={1000} 
        sx={{ 
          pointerEvents: isTypeMenuOpen ? 'auto' : 'none',
          zIndex: 1500 
        }}
      >
        <SelectMenu
          isSelectOpen={isTypeMenuOpen}
          screenSize={screenSize}
          sx={{
            backgroundColor: '#fffbf6',
            padding: 0,
            top: 'auto',
            left: 0,
            gap: 0,
            maxWidth: '361px',
            width: '100%',
            borderRadius: '0 0 4px 4px',
            borderRight: '1px solid #02215f',
            borderBottom: '1px solid #02215f',
            borderLeft: '1px solid #02215f',
            borderTop: 'none',
            transform: 'translateY(0px)',
            ...(isSmallerScreen && { zIndex: 1500 }),
          }}
        >
           {Object.keys(answerSettingsMap).map((val, i) => (
            <Box
              onClick={() => handleAnswerSettingsChange(val as AnswerType)}
              sx={{ cursor: 'pointer', width: '100%' }}
            >
              <SelectMenuItem
                sx={{ height: '23px', padding: '4px 8px', width: 'auto' }}
              >
                <Typography
                  fontWeight="normal"
                  fontSize="14px"
                  fontFamily="Rubik"
                  sx={{ color: '#02215f' }}
                >
                  {answerSettingsMap[val as AnswerType]}
                </Typography>
              </SelectMenuItem>
              {i !== Object.keys(answerSettingsMap).length - 1 && (
                <Divider
                  flexItem
                  sx={{ width: '100%', background: '#02215f', opacity: 0.5 }}
                />
              )}
            </Box>
          ))}
        </SelectMenu>
      </Collapse>
      { answerType === AnswerType.NUMBER && (
        <>
          <SelectAnswerSettings
            error={false}
            sx={{
              borderRadius: isPrecisionMenuOpen ? '5px 5px 0 0' : '5px',
            }}
            screenSize={screenSize}
            onClick={handlePrecisionMenuToggle}
          >
            <SelectPhaseLabel isSelected={answerPrecision !== null} error={false} style={{fontWeight: 'normal'}}>
              {answerPrecision !== null ? answerPrecisionMap[answerPrecision] : ``}
            </SelectPhaseLabel>
            {/* space between is here */}
            <SelectArrowContainer isSelectOpen={isPrecisionMenuOpen}>
              <img
                src={SelectArrow}
                style={{ color: '#02215f' }}
                alt="Select Arrow"
                width="13px"
                height="12px"
              />
            </SelectArrowContainer>
          </SelectAnswerSettings>
          <Collapse in={isPrecisionMenuOpen} timeout={1000}>
            <SelectMenu
              isSelectOpen={isPrecisionMenuOpen}
              screenSize={screenSize}
              sx={{
                backgroundColor: '#fffbf6',
                padding: 0,
                top: 'auto',
                left: 0,
                gap: 0,
                maxWidth: '361px',
                width: '100%',
                borderRadius: '0 0 4px 4px',
                borderRight: '1px solid #02215f',
                borderBottom: '1px solid #02215f',
                borderLeft: '1px solid #02215f',
                borderTop: 'none',
                transform: 'translateY(0px)',
                ...(isSmallerScreen && { zIndex: 1500 }),
              }}
            >
              {Object.keys(answerPrecisionMap).map((val, i) => (
                <Box
                  onClick={() => handleAnswerSettingsChange(answerType, val as AnswerPrecision)}
                  sx={{ cursor: 'pointer', width: '100%' }}
                >
                  <SelectMenuItem
                    sx={{ height: '23px', padding: '4px 8px', width: 'auto' }}
                  >
                    <Typography
                      fontWeight="normal"
                      fontSize="14px"
                      fontFamily="Rubik"
                      sx={{ color: '#02215f' }}
                    >
                      {answerPrecisionMap[val as AnswerPrecision]}
                    </Typography>
                  </SelectMenuItem>
                  {i !== Object.keys(answerPrecisionMap).length - 1 && (
                    <Divider
                      flexItem
                      sx={{ width: '100%', background: '#02215f', opacity: 0.5 }}
                    />
                  )}
                </Box>
              ))}
            </SelectMenu>
          </Collapse>
        </>
      )}
    </Box>
  );
}
