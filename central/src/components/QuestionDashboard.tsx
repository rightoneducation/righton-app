import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Box, Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from './LoadingIndicator';
import { IQuestionTemplate, isNullOrUndefined } from '@righton/networking';
import QuestionCard from './QuestionCard';

type QuestionDashboardProps = {
  gameId: string | null;
  questions: IQuestionTemplate[];
  loading: boolean;
  isUserAuth: boolean;
  handleDeleteQuestionTemplate: (id: string) => void;
  handleCloneQuestionTemplate: (question: IQuestionTemplate) => void;
  nextToken: string | null; 
  handleScrollDown: (nextToken: string | null) => void;
  handleQuestionSelected: (question: IQuestionTemplate, isSelected: boolean) => void;
};

export default function QuestionDashboard({
  gameId,
  questions,
  loading,
  isUserAuth,
  handleCloneQuestionTemplate,
  handleDeleteQuestionTemplate,
  nextToken,
  handleScrollDown,
  handleQuestionSelected
}: QuestionDashboardProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const match = useRouteMatch('/questions/:questionIndex');
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setActiveIndex(Number(event.currentTarget.dataset.questionIndex));
    event.stopPropagation();
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveIndex(null);
  };
  const cloneHandler = (question: IQuestionTemplate) => () => {
    handleCloneQuestionTemplate(question);
    handleClose();
  };
  const deleteHandler = (id: string) => () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this questions?');
    if (confirmDelete) {
      handleDeleteQuestionTemplate(id);
    }
    handleClose();
  };

  const renderQuestions = (loading: boolean) => {
    if (loading) return ( 
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
    );
  
    if (questions.length >= 1) {
      return (
          <InfiniteScroll
            dataLength={questions.length}
            next={() => handleScrollDown(nextToken)}
            hasMore={nextToken !== null}
            loader={<h4>Loading...</h4>}
            height={`calc(100vh - 156px)`}
            scrollableTarget="questionsDashboard"
            style={{display: 'flex', justifyContent: 'flex-start', width: '100%', flexWrap: 'wrap', overflowY: 'scroll', zIndex: -2}}
          > 
            {questions.map((question, index) => 
              <Grid key={index} container item xs={12} md={match ? 12 : 6} lg={match ? 12 : 4} style={{width: '100%'}}>
                <QuestionCard  
                  gameId={gameId}
                  question={question}
                  anchorEl={anchorEl}
                  isUserAuth={isUserAuth}
                  match={match}
                  index={index}
                  activeIndex={activeIndex}
                  handleClick={handleClick}
                  cloneHandler={cloneHandler}
                  deleteHandler={deleteHandler}
                  handleClose={handleClose}
                  handleQuestionSelected={handleQuestionSelected}
                />
              </Grid>
            )}
        </InfiniteScroll>
      );
    };
    return (
      <Typography gutterBottom>
        No results found.
      </Typography>
    );
  };
  return (
    renderQuestions(loading)
  );
};


const useStyles = makeStyles((theme) => ({
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
