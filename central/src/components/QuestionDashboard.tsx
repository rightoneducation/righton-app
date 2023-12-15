import React from 'react';
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import LoadingIndicator from './LoadingIndicator';
import { IQuestionTemplate } from '@righton/networking';
import QuestionCard from './QuestionCard';

type QuestionDashboardProps = {
  questions: IQuestionTemplate[];
  loading: boolean;
};

export default function QuestionDashboard({
  questions,
  loading
}: QuestionDashboardProps) {
  const classes = useStyles();
  console.log("sup");
  console.log(questions);
  return (
     loading ?   
      <>
        <div className={classes.loadingContainer}>
          <div>
            <LoadingIndicator
              theme={[
                'rgb(126, 90, 175)',
                'rgb(148, 98, 179)',
                'rgb(169, 104, 180)',
                'rgb(186, 107, 177)',
                'rgb(202, 109, 172)',
                'rgb(218, 112, 168)',
                'rgb(237, 115, 166)',
                'rgb(255, 120, 165)',
              ]}
              radius={110}
              timerStartInSecond={1000}
              gameCreate={false}
            />
            <Typography className={classes.loadingTitle}>
              Loading Question List...
            </Typography>
            <Typography className={classes.loadingText}>
              If there are issues with loading, try reloading this page.
            </Typography>
          </div>
        </div>
              </>
  :
    <Grid container item xs={12} md={6} lg={4} className={classes.container}>
    {
      questions.map((question) => {
        return <QuestionCard  {...question} />
      })
    }
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   width: '100%',
   height: '100vh'
  },
  loadingContainer: {
    margin: 'auto',
    width: '60%',
  },
  loadingTitle: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '36px',
    letterSpacing: '0em',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0em',
    textAlign: 'center',
  }
}));
