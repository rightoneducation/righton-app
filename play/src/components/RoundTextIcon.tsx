import React from 'react';
import { makeStyles, Button, Theme } from '@material-ui/core';
import Picked from '../images/Picked.png';

type AnswerProps = {
    answerStatus: string,
    icon: string,
    data: any,
    onPress: (data: any) => void,
}

const RoundTextIcon = ({
  answerStatus,
  icon,
  data,
  onPress,
} : AnswerProps ) => {
  const classes = useStyles();
  
  return (
    <div className={classes.container}>
      <Button
        className={classes.button}
        onClick={() => onPress(data)}
        disabled={false}
      >
          <div className={classes.text}>
          {'Sample'}
          </div>
          {answerStatus === undefined || !answerStatus ? null : (
            <img
              src={Picked}
              className={classes.icon}
            />
          )}
      </Button>
    </div>
  );
};

export default RoundTextIcon;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '45px',
    margin: '10%',
  
},
button: {
    width: '100%', 
    height: '100%',
    border: '2px solid #159EFA',
    borderRadius: '22px',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
icon: {
    padding: '10%',
    width: '16px',
    height: '16px',
},
text: {
    color: '#384466',
    fontFamily: 'Karla',
    fontSize: '16px',
},
}));