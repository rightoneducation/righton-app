import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

export default function ButtonSubmitAnswer({ isSelected, isSubmitted}) {
  const classes = useStyles();
  const buttonText = isSubmitted ? "Answer Submitted" : "Submit Answer";

  return (
    <Button 
            className={`${classes.buttonStyleBase} ${(isSelected && !isSubmitted) ? classes.buttonStyleSelected : null}`}
            onClick={() => { 
              handleSubmitAnswer();
            }}>
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