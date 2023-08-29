import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Box
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import EnableConfidenceCard from "../components/EnableConfidenceCard";

export default function QuestionSettingsCard({ 
  currentQuestionIndex, 
  isConfidenceEnabled,
  handleConfidenceSwitchChange,
  questions
}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className={classes.container}>
      <CardContent className={classes.cardContent}>
        <Box>
          <Typography className={classes.title}>Upcoming Question:</Typography>
          <Typography className={classes.text} >Question #{currentQuestionIndex +1}:</Typography>
          <Typography className={classes.text} style={{paddingBottom: '16px'}}>{questions[currentQuestionIndex ? currentQuestionIndex : 0].text}</Typography>
          <Box className={classes.expandContainer} onClick={() => setExpanded(!expanded)}>
            <Typography className={classes.text} style={{fontWeight: 700}}>Click to Configure Question </Typography>
            <IconButton
              size="small"
              className={expanded ? classes.expanded : classes.expand}
            >
              <ExpandMore />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      <Collapse in={expanded} >
        <CardContent >
          <EnableConfidenceCard 
            isConfidenceEnabled={isConfidenceEnabled} 
            handleConfidenceSwitchChange={handleConfidenceSwitchChange}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    padding: `8px`,
    backgroundColor: '#1D448A',
    width: "311px", // hardcoded to match GameCard width
    height: 'auto',
    boxSizing: 'border-box'
  },
  title: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: "normal",
    textTransform: "none",
    paddingBottom: '16px'
  },
  titleContainer: {
    marginTop: '3%',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  text: {
    color: '#FFF',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400'
  },
  expandContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  expand: {
    display: "flex",
    float: "right",
    color: "white",
    transform: "rotate(270deg)",
    padding: "0px",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expanded: {
    float: "right",
    color: "white",
    transform: "rotate(0deg)",
    padding: "0px",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
}));