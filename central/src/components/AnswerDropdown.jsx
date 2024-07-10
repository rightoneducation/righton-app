import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardContent, Collapse, IconButton, Box} from "@material-ui/core";
import { ExpandMore } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
   
export default function AnswerDropdown({answer, instructions, explanation, correct}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    return(
        <Grid item xs={12}>
            <Card className={correct ? classes.correctCard : classes.card} onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
                <CardContent>
                    <Typography className={classes.answer}>
                        {answer}
                    </Typography>
                
                    <IconButton size='small' className={expanded ? classes.expanded : classes.expand}>
                        <ExpandMore fontSize='large'/>
                    </IconButton>
                </CardContent>

                <Collapse in={expanded}>
                    <CardContent>
                        <Typography className={classes.explanationTitle}>
                            Explanation:
                        </Typography>
                        <Typography className={classes.explanationText}>
                            {!correct 
                            ? explanation 
                            :
                            instructions.map((instruction, index) => (
                                <Box
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    gap: 5
                                  }}
                                  key={uuidv4()}
                                >
                                  <Box style={{ width: '30px' }}>
                                    <Typography
                                      style={{
                                        width: '30px',
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        color: '#4700B2',
                                        lineHeight: '20px',
                                        textAlign: 'right',
                                      }}
                                    >
                                      {index + 1}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    style={{ 
                                        fontWeight: '400',
                                        fontSize: '16px',
                                        lineHeight: '18px',
                                        paddingLeft: `8px`,
                                        color: '#384466',
                                        paddingBottom: '10px'
                                    }}
                                  >
                                    {instruction}
                                  </Typography>
                                </Box>
                              ))
                            }
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    );
}

const useStyles = makeStyles(theme => ({
    card: {
        borderRadius: '10px',
        boxShadow: '1px 4px 10px lightgrey',
        width: '100%',
        marginBottom: '20px',
    },
    correctCard: {
        borderRadius: '10px',
        boxShadow: '1px 4px 10px lightgrey',
        width: '100%',
        border: '5px solid #4DED66',
        marginBottom: '20px',
    },
    answer: {
        fontWeight: 500,
        color: '#384466',
        fontSize: '30px',
        display: 'inline',
    },
    expand: {
        float: 'right',
        color: '#384466',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expanded: {
        float: 'right',
        color: '#384466',
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    explanationTitle: {
        fontWeight: 700,
        fontSize: '20px',
        color: '#384466',
        paddingBottom: '10px'
    },
    explanationText: {
        fontWeight: 500,
        fontSize: '14px',
        color: '#384466',
    },
  }));