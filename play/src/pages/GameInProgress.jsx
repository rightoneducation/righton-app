import React from 'react';
import { makeStyles, Theme } from "@material-ui/core";
import RoundTextIcon from '../components/RoundTextIcon';

export default function GameInProgress() {
  const classes = useStyles();
  const submitted = true;

  const onPress = () => {
    console.log(data);
  }


  return(
    <div className={classes.mainContainer} >
      <div className={classes.headerContainer}>
        <h1>Answer the Question</h1>
        {/* <Button 
             className={classes.answerButton}
             >
            Yes
            </Button> */}
            <div style={{width: '300px', backgroundColor: 'white'}}>
              <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>
            </div>
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: 'rgba(247, 249, 250, 1)',
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    background: 'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
    height: '225px',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    position: 'relative',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  answerButton:{
    height: '68px',
    width: '200px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#159EFA",
    borderRadius: 22,
  }
}));