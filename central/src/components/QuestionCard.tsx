import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, CardContent, Grid, Typography, Button, Menu, MenuItem, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { IQuestionTemplate, PublicPrivateType } from '@righton/networking';
import RightOnPlaceHolder from '../images/RightOnPlaceholder.svg';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CCSS from './CCSSText';

type QuestionCardProps = {
  gameId: string | null;
  question: IQuestionTemplate;
  anchorEl: any;
  isUserAuth: boolean;
  match: {} | null;
  index: number;
  activeIndex: number | null;
  handleClick: (event: any) => void;
  editHandler: (question: IQuestionTemplate) => void;
  cloneHandler: (question: IQuestionTemplate) => void;
  deleteHandler: (question: IQuestionTemplate) => void;
  handleClose: () => void;
  handleQuestionSelected: (question: IQuestionTemplate, isSelected: boolean) => void;
  handleQuestionCardClick: (id: string) => void;
  publicPrivateQueryType: PublicPrivateType;
};

export default function QuestionCard({
  gameId,
  question,
  anchorEl,
  isUserAuth,
  match,
  index,
  activeIndex,
  handleClick,
  editHandler,
  cloneHandler,
  deleteHandler,
  handleClose,
  handleQuestionSelected,
  handleQuestionCardClick,
  publicPrivateQueryType
} : QuestionCardProps) {
  const classes = useStyles();
  const gameCount = question.gameTemplates ? question.gameTemplates.length : 0;
  const history = useHistory();
  const [isSelected, setIsSelected] = useState(false);
return (
  <Card className={classes.game} onClick={() => handleQuestionCardClick(question.id)}>
    <CardContent>
      <Grid container>
        <Grid container item xs={8} md={9} >
          <div className={classes.cardText}>
            <Grid container>
              <Grid item xs={5}> 
                <CCSS grade={question.grade ?? ''} domain={question.domain ?? ''} cluster={question.cluster ?? ''} standard={question.standard ?? ''} />
              </Grid>
              <Grid item md={7}>
                <Typography className={classes.question}>
                  Used in {gameCount} Game{gameCount > 1 || gameCount === 0 ? 's' : null}
                </Typography>
              </Grid>
            </Grid>
            <Typography className={classes.title} >
              {question.title}
            </Typography>
          </div>
        </Grid>
        <Grid container item xs={4} md={3}>
          <Grid item xs={10} >
            <div className={classes.imageContainer}>
              {question.imageUrl ? <img className={classes.image} src={question.imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" className={classes.image} />}
            </div>
          </Grid>
          {
            gameId &&
            <Grid item xs={2}>
              <Checkbox value="isSelected" onClick={(event) => {
                event.stopPropagation();
                handleQuestionSelected(question, !isSelected);
                setIsSelected(!isSelected);
              }}/>
            </Grid>
          }
          { isUserAuth && !gameId && 
              <Grid item xs={2} className={classes.show}>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.moreButton} data-question-index={index}>
                  <MoreVertIcon />
                </Button>
                <Menu
                  id={`question-${index}-actions`}
                  anchorEl={anchorEl}
                  keepMounted
                  open={activeIndex === index}
                  onClose={handleClose}
                  onClick={(event) => { if (!match) event.stopPropagation(); }}
                >
                  <MenuItem onClick={(event) => { editHandler(question)}}>Edit</MenuItem>
                  <MenuItem onClick={(event) => {cloneHandler(question)}}>Clone</MenuItem>
                  <MenuItem onClick={(event) => {deleteHandler(question)}}>Delete</MenuItem>
                </Menu>             
              </Grid>
            }
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
}


const useStyles = makeStyles(theme => ({
    game: {
      width: '100%',
      borderRadius: '10px',
      marginBottom: theme.spacing(2),
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        boxShadow: '1px 4px 12px grey',
        cursor: 'pointer',
      },
      height: '152px',
      boxShadow: '1px 4px 8px lightgrey',
      display: 'inline-block',
      marginRight: theme.spacing(2),
      verticalAlign: 'top',
    },
    cardText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      overflow: 'hidden'
    },
    question: {
      fontWeight: 700,
      color: '#159EFA',
      textAlign: 'right',
      marginRight: '15px'
    },
    title: {
      color: '#384466',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '95%',
    }, 
    owner: {
      fontWeight: 400,
      height: '60%',
      color: '#384466',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '95%',
    },
    textSecondary: {
      height: '90%',
      width: '50%',
      maxWidth: '90%',
      paddingRight: '5px',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    image: {
      width: '110px',
      height: '110px',
      objectFit: 'cover',
      borderWidth: '0',
      borderRadius: '15px',
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center',
      paddingTop:'5px',
    },
    show: {
      display: 'block'
    },
    hide: {
      display: 'none'
    },
    moreButton: {
      minWidth: '28px',
      margin: '0',
    }
  })
)