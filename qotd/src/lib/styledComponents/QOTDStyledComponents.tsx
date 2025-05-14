import { styled, Box, Paper, Grid, Typography, TextField, Button, FormControlLabel, Radio } from "@mui/material";
import mathSymbolsBackground from "../../images/mathSymbolsBackground.svg";
import { ScreenSize } from '../CentralModels';

export const MathBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    display: 'flex',
    zIndex: 0,
    backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
    backgroundImage: `
      linear-gradient(180deg, rgb(254, 251, 247) 0%, rgba(254, 251, 247, 0) 100%),
      url(${mathSymbolsBackground})
    `,
    backgroundSize: 'cover, contain',
    overflow: 'hidden'
  }));


export const QOTDMainContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', 
  boxSizing: 'border-box',
  display: 'flex'
}));

export const QOTDBoxContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${theme.sizing.lgPadding}px`,
  zIndex: 1,
  position: 'relative',
  paddingLeft: `${theme.sizing.mdPadding}px`,
  paddingRight: `${theme.sizing.mdPadding}px`,
  boxSizing: 'border-box',
  flexGrow: 1,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE and Edge
}));

interface BaseCardStyledProps {
  isHighlight?: boolean,
  isCardComplete?: boolean
  isClone?: boolean,
  dropShadow?: boolean
}

export const BaseCardStyled = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isHighlight' && prop !== 'isCardComplete' && prop !== 'dropShadow' && prop !== 'isClone',
})<BaseCardStyledProps>(({ theme, isHighlight, isCardComplete, isClone }) => ({
  width: '680px',
  padding: `${theme.sizing.mdPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
  background: '#FFFFFF',
  borderRadius: `8px`,
  boxSizing: 'border-box',
  height: 'fit-content',
  boxShadow: isHighlight ? `0px 0px 25px 0px ${theme.palette.primary.extraDarkBlue}` : '',
  opacity: isCardComplete && !isClone ? 0.6 : 1,
  transition: 'box-shadow 0.6s, opacity  0.6s',
}));

export const QOTDGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
}));

type SelectAnswerSettingProps = {
  error: boolean;
  isSelected: boolean;
}

export const SelectAnswerSettingLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "error"
})<SelectAnswerSettingProps>(({theme, error, isSelected}) => ({
    color: error ? '#D0254D': theme.palette.primary.sliderBlue,
    fontFamily: "Rubik",
    fontSize: 14,
    fontWeight: isSelected ? 'normal':'bold',
    margin: 0,
}))

interface TextContainerStyledProps {
  isAIEnabled?: boolean,
}


export const TextContainerStyled = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'isAIEnabled',
})<TextContainerStyledProps>(({ theme, isAIEnabled }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  backgroundColor: '#FFFFFF', // Set background color to white
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.darkPurple}`: `${theme.palette.primary.grey}`,
      borderRadius: `${theme.sizing.xSmPadding}px`,
     },
    "&.Mui-focused fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.darkPurple}`: `${theme.palette.primary.grey}`,
    },
    "&:hover fieldset": {
      borderWidth: `2px`,
      borderColor: isAIEnabled ? `${theme.palette.primary.extraDarkPurple}`: `${theme.palette.primary.extraDarkGrey}`,
    },
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.errorBorder,
    },
  },
}));

export const ImageURLTextContainerStyled = styled(TextContainerStyled)(({ theme }) => ({
  height: '60px',
  input: {
    color: "#000",
    zIndex: 1
  },
  '& .MuiInputBase-input': {
    width: `calc(100% - 130px)`,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      height: '60px',
      backgroundColor: `${theme.palette.primary.uploadLightGrey}`,
      zIndeX: 0
    },
  }
}));

export const ImageURLUploadButton = styled(Box)(({ theme }) => ({
  width: '100px',
  height: '43px',
  fontWeight: 700,
  fontSize: '18px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  borderColor: `${theme.palette.primary.uploadDarkGrey}`, 
  borderStyle: 'solid',
  borderWidth: '2px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  "&:hover": {
    backgroundColor: `${theme.palette.primary.uploadLightGrey}`
  },
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 2,
  boxSizing: 'border-box',
  marginTop: '8px',
  marginRight: '10px'
}));

export const RegenTextContainerStyled = styled(TextField)(({ theme }) => ({
  width: '100%',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  borderRadius: `${theme.sizing.xSmPadding}px`,
  "& .MuiOutlinedInput-root": {
    backgroundColor: `${theme.palette.primary.greyPurple}`,
  },
}));

export const CCSSIndicator = styled(Button)(({ theme }) => ({
  width: 'fit-content',
  height: `${theme.sizing.mdPadding}px`,
  padding: `${theme.sizing.xxSmPadding}px ${theme.sizing.xSmPadding}px`,
  gap: `${theme.sizing.xxSmPadding}px`,
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
  color: '#FFFFFF',
  textTransform: 'none',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '16.59px',
  textAlign: 'center',
  boxShadow: '0px 3px 12px 0px #95002366',
  zIndex: 2,
  boxSizing: 'border-box',
  minWidth: '20px',
  display: 'flex',
  alignItems: 'center',
}));




export const TitleBarStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

export const QuestionTitleStyled = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  lineHeight: '30px',
  fontWeight: 700,
  color: '#000',
}));

interface IAnswerResponse { isCorrect: boolean }
export const AnswerResponse = styled(Typography, {
    shouldForwardProp: (prop) => prop !== "isCorrect",
})<IAnswerResponse>(({ theme, isCorrect }) => ({
    fontSize: '15px',
    lineHeight: '30px',
    fontWeight: 600,
    color: isCorrect ? "green" : "red",
}));

export const RadioContainerStyled = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
}));

type RadioLabelProps = {
  isSelected?: boolean;
};

export const RadioLabelStyled = styled(FormControlLabel, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<RadioLabelProps>(
  ({ theme, isSelected }) => ({
    cursor: 'default',
    margin: 0,
    color: isSelected ? 'rbga(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.4)',
    '& .MuiTypography-root': {
      color: isSelected ? 'rbga(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.4)',
      fontSize: '14px'
    },
  }),
);

export const RadioStyled = styled(Radio)(({ theme }) => ({
  cursor: 'default',
  color: 'rgba(0, 0, 0, 0.2)',
  '&.Mui-checked': {
    color: `${theme.palette.primary.mediumBlue}`,
  },
}));

interface ContentContainerProps {
  screenSize: ScreenSize;
}

export const ContentContainerStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<ContentContainerProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: screenSize === ScreenSize.SMALL ? '100%' : '100%',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: `${theme.sizing.smPadding}px`,
}));

export const ImageStyled = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0
});

export const ContentRightContainerStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));


export const AnswerIndicator = styled(Box)(({ theme }) => ({
  width: '100%',
  height: `${theme.sizing.xLgPadding}px`,
  borderRadius: '20px',
  background: `${theme.palette.primary.lightGrey}`,
  paddingTop: `10px`,
  paddingBottom: '10px',
  paddingLeft: `12px`,
  paddingRight: `12px`,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxSizing: 'border-box',
}));
