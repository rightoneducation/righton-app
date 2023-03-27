import React from 'react';
import { makeStyles, Theme } from "@material-ui/core";
import RoundTextIcon from '../components/RoundTextIcon';
import Card from '../components/Card';

export default function GameInProgress() {
  const classes = useStyles();
  const submitted = true;

  const onPress = () => {
    console.log(data);
  }


  return(
    <div className={classes.mainContainer} >
      <div className={classes.headerContainer}>
        <div>Answer the Question</div>
      </div>
      <div className={classes.bodyContainer}>
        <Card headerTitle="Answer the Question">
            <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>
            <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>
            <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>
            <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>
            <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>
            <RoundTextIcon answerStatus={"default"} submitted={true} index={0} answerText={"Sample"} onPress={onPress}></RoundTextIcon>

        </Card>
      </div>
    
      <div className={classes.footerContainer} />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: 'rgba(247, 249, 250, 1)',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '225px',
    boxShadow: '0px 2px 4px rgba(0, 141, 239, 0.3)',
    background: 'linear-gradient(to right, rgba(62, 0, 172, 1), rgba(98, 0, 204, 1))',
  },
  bodyContainer: {
    display: 'flex',
    flex: 1,
    width: '100vw',
    background: 'linear-gradient(to right, rgba(12, 10, 172, 0.2), rgba(198, 10, 34, 0.2))',
  },
  footerContainer: {
    height: '40px',
    width: '100%',
    backgroundColor: '#000000',
    bottom: 0,
  },
  answerButton:{
    height: '68px',
    width: '200px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#159EFA',
    borderRadius: 22,
  }
}));