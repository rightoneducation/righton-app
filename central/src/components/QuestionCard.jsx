import react from './react';
import { Card, CardContent, Grid, Typography, Button, Menu, MenuItem } from '@material-ui/core';

const questionCard = (questions) => {
console.log(questions);
return (
  <Card className={classnames(classes.game, !match && classes.gameGrid, match && Number(match.params.gameIndex) === index + 1 && classes.gameSelected)} key={id} onClick={() => onClickGame(game.id, gameId)}>
    <CardContent>
      <Grid container>
        <Grid container item xs={8} md={9} >
          <div className={classes.cardText}>
            <Grid container>
              <Grid item xs={5}> 
                <CCSS grade={grade} domain={domain} cluster={cluster} standard={standard} />
              </Grid>
              <Grid item md={7}>
                <Typography className={classes.question}>
                  {questionCount} question{questionCount > 1 || questionCount === 0 ? 's' : null}
                </Typography>
              </Grid>
            </Grid>
            <Typography className={classes.title} >
              {title}
            </Typography>
            <Typography className={classes.textSecondary} color="textSecondary" >
              {description}
            </Typography>
          </div>
        </Grid>
        <Grid container className={classes.imageButton} item xs={4} md={3}>
          <Grid item xs={10} >
            <div className={classes.imageContainer}>
              {imageUrl ? <img className={classes.image} src={imageUrl} alt="" /> : <img src={RightOnPlaceHolder} alt="Placeholder" className={classes.image} />}
            </div>
          </Grid>
          { isUserAuth && 
            <Grid item xs={2} className={addquestion ? classes.hide : classes.show}>
              <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.moreButton} data-game-index={index}>
                <MoreVertIcon />
              </Button>
              <Menu
                id={`question-${index}-actions`}
                anchorEl={anchorEl}
                keepMounted
                open={activeIndex === String(index)}
                onClose={handleClose}
                onClick={(event) => { if (!match) event.stopPropagation(); }}
              >
                <MenuItem onClick={(event) => { history.push(`/gamemaker/${game.id}`); event.stopPropagation(); handleClose(); }}>Edit</MenuItem>
                <MenuItem onClick={cloneHandler(game)}>Clone</MenuItem>
                <MenuItem onClick={deleteHandler(id)}>Delete</MenuItem>
              </Menu>             
            </Grid>
          }
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
}