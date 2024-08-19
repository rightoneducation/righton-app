import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const BaseQuestionIndicator = styled(Box)(({ theme }) => ({
  width: `${theme.sizing.lgPadding}px`,
  height: `${theme.sizing.smPadding}px`,
  borderRadius: `${theme.sizing.xxSmPadding}px`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.primary.baseQuestionColor,
  boxSizing: 'border-box',
  fontFamily: 'Poppins',
  fontSize: '12px',
  fontWeight: '400',
}));

export const CurrentQuestionIndicator = styled(BaseQuestionIndicator)(
  ({ theme }) => ({
    background: theme.palette.primary.questionGradient,
    border: theme.borders.solidWhite,
    justifyContent: 'flex-start',
    width: `${theme.sizing.xxLgPadding}px`,
    paddingLeft: `${theme.sizing.xxSmPadding}px`,
    color: theme.palette.primary.darkBlue,
  }),
);

export const PlayedQuestionBox = styled(BaseQuestionIndicator)(({ theme }) => ({
  backgroundColor: theme.palette.primary.baseQuestionColor,
  border: theme.borders.transparent,
}));

export const UnplayedQuestionBox = styled(BaseQuestionIndicator)(
  ({ theme }) => ({
    border: theme.borders.semiTransparent,
  }),
);

export const CurrentQuestionBoxPhase2 = styled(CurrentQuestionIndicator)(
  ({ theme }) => ({
    background: theme.palette.primary.main,
  }),
);
