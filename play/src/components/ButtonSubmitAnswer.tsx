import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface ButtonSubmitAnswerProps {
  isSelected: boolean;
  isSubmitted: boolean;
  handleSubmitAnswer: (isSubmitted: boolean) => void;
}

export default function ButtonSubmitAnswer({ 
  isSelected,
  isSubmitted,
  handleSubmitAnswer 
} : ButtonSubmitAnswerProps) {
  const classes = useStyles();
  const buttonText = isSubmitted ? "Answer Submitted" : "Submit Answer";

  return (
    <Button 
      className={`${classes.buttonStyleBase} ${(isSelected && !isSubmitted) ? classes.buttonStyleSelected : null}`}
      onClick={() => { 
        handleSubmitAnswer(true);
      }}
      disabled={!isSelected || isSubmitted}
      >
        <div className={classes.buttonText}> {buttonText} </div>
    </Button>
  )
}

const useStyles = makeStyles(theme => ({
  buttonStyleBase: {
    width: '160px',
    height: '26px',
    background: '#909090',
    borderRadius: '22px',
    textTransform: 'none',
  },
  buttonStyleSelected: {
    background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)',
    boxShadow: '0px 5px 22px rgba(71, 217, 255, 0.3)'
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Karla',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '16px',
  },
}));