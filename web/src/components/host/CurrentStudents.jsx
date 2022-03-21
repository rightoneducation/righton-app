import React from 'react'
import { makeStyles, MenuItem } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Skeleton from '@material-ui/lab/Skeleton';

const students = ["Ray W.", "Zach T.", "Jared J."]
const x = "X"

const CurrentStudents = () => {
    const classes = useStyles()
  return (
      <div>
          <hr className={classes.hr}/>
          {students.map((student) => (
              <MenuItem  container className={classes.studentCards} >  
              
                <Grid className={classes.name}>
                    {student}
                </Grid>
                <Button className={classes.removeStudent}>
                    {x}
                </Button>
                
              </MenuItem>
          ))}
          
      </div>
    
  )
}
const useStyles = makeStyles(theme => ({
    studentCards: {
        margin: "auto",
       
        marginBottom: "15px",
        borderRadius: "14px",
        width: "80%",
        height: "62px",
        background: "rgba(255, 255, 255, 0.25)",
        color: "rgba(255, 255, 255, 1)",
       
    },
    name: {
        fontWeight: "bold",  
    },
    removeStudent: {
        color: "white",
        fontWeight: "bold",
        position: "absolute",
        right: "-10px",
    },
    hr: {
        marginTop: "30px",
        marginBottom: "25px",
        marginRight: "11%",
        marginLeft: "11%",
        borderRadius: "1.54px",
        border: "0",
        borderTop: "1px solid rgba(255, 255, 255, 0.25)"
    }
  }))

export default CurrentStudents