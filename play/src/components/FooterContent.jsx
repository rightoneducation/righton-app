import { makeStyles, Typography } from "@material-ui/core";
import { GameSessionState } from '@righton/networking'
import ScoreIndicator from '../components/ScoreIndicator';
import Icon from '../img/MonsterIcon1.png';
import Icon2 from '../img/MonsterIcon2.png';
import Icon3 from '../img/MonsterIcon3.png';
import Icon4 from '../img/MonsterIcon4.png';
import Icon5 from '../img/MonsterIcon5.png';
import Icon6 from '../img/MonsterIcon6.png';

export default function Header({
  avatar,
  teamName,
  score,
  originalScore
}) {
  const classes = useStyles();
  const avatarMap = {
    0: Icon,
    1: Icon2,
    2: Icon3,
    3: Icon4,
    4: Icon5,
    5: Icon6,
  }
  return(
    <div className={classes.footerContainer}>
      <div className={classes.footerLeftContainer}>
        <img className={classes.avatar} src={avatarMap[avatar]} />
        <Typography className={classes.text}> {teamName} </Typography>
      </div>
      <div>
        <ScoreIndicator score={score} originalScore={originalScore} /> 
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: `calc(100% - 48px)`,
    maxWidth: '700px',
    height: '60px',
    background: '#FFFFFF',
    marginLeft: '24px',
    marginRight: '24px',
    zIndex: 1,
  },
  footerLeftContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Karla',
    fontSize: '26px',
    fontWeight: 800,
    lineHeight: '30px',
    color: 'rgba(0, 0, 0, 0.38)',
    marginLeft: '12px',
  },
  avatar: {
    height: '42px',
    width: 'auto',
    boxShadow: '0px 5px 12px rgba(16, 54, 0, 0.3)',
    borderRadius: '12px',
  },
}));