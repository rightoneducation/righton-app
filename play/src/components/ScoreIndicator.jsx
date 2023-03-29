import { makeStyles, Typography } from "@material-ui/core";
import { isNullOrUndefined } from '@righton/networking'

export default function Header({
  score,
  originalScore,
}) {
  const classes = useStyles();

  return(
    <div className={classes.scoreContainer}>
      <Typography className={classes.text}> {isNullOrUndefined(score) ? 0 : score} </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `58px`,
    height: '22px',
    borderRadius: '23px',
    background: 'linear-gradient(190deg, #73B6F0 0%, #057BE3 80%)',
  },
  text: {
    fontFamily: 'Karla',
    fontSize: '18px',
    fontWeight: 800,
    lineHeight: '21px',
    color: '#FFFFFF',
    textShadow: '0px 1px 1px rgba(0, 0, 0, 0.15)',
  },
}));