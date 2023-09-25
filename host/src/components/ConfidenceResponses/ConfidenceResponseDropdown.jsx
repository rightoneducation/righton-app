import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card
} from "@material-ui/core";
import check from '../../images/correctAnswerCheck.png';

export default function ConfidenceResponseDropdown({ 
  graphClickInfo, 
  selectedConfidenceData 
}) {
  const classes = useStyles();
   // TODO: integrate this into ConfidenceLevel enum to prevent use of dictionaries here and in confidenceresponsegraph
   // see: https://github.com/rightoneducation/righton-app/issues/806
  const ConfidenceLevelDictionary = {
    0: "Not Rated",
    1: "Not At All Confident",
    2: "Kinda Confident",
    3: "Quite Confident",
    4: "Very Confident",
    5: "Totally Confident"
  }
  const playerResponse = ({ name, answer, isCorrect }) => {
    return (
      <Card className={classes.playerCard}>
        <Typography className={classes.nameText}>{name}</Typography>
        <Grid className={classes.answerDataContainer}>
          {isCorrect && <img src={check} className={classes.check} />}
          <Typography className={classes.answerText}>{answer}</Typography>
        </Grid>
      </Card>
    );
  };
  // sorts players based on the Figma criteria:
  // correct players sorted alphabetically
  // incorrect players sorted first by answer frequency, then alphabetically
  const sortPlayers = (selectedConfidenceData) => {
    const correctPlayers = [];
    const incorrectPlayers = [];
    const answerFrequency = {};
    selectedConfidenceData.players.forEach((playerData) => {
      // split players into correct and incorrect so .sort is limited to these subsets
      if (playerData.isCorrect) {
        correctPlayers.push(playerData);
      } else {
        incorrectPlayers.push(playerData);
        // if incorrect, also store the frequency of the answer for sorting later
        answerFrequency[playerData.answer] = (answerFrequency[playerData.answer] || 0) + 1;
      };
    });
    // sort correct alphabetically
    correctPlayers.sort((a, b) => a.name.localeCompare(b.name));
    incorrectPlayers.sort((a, b) => {
      // sort incorrect by answer frequency, then alphabetically
      const freqDifference = answerFrequency[b.answer] - answerFrequency[a.answer];
      return freqDifference !== 0 ? freqDifference : a.name.localeCompare(b.name);
    });
    return { correct: correctPlayers, incorrect: incorrectPlayers };
  };
  // return both and then render them in the correct order
  const sortedPlayers = sortPlayers(selectedConfidenceData);

  return (
    <>
    { selectedConfidenceData.length === 0 
      ? <Typography className={classes.headerText}>No players picked this option</Typography> 
      : <>
          <Typography className={classes.headerText}>Showing players who answered</Typography>
          <Typography className={classes.confidenceLevelText}>{ConfidenceLevelDictionary[graphClickInfo.selectedIndex]}</Typography>
          <Typography className={classes.answerLabelText}>Answer</Typography>
          <Grid className={classes.container}>
            {sortedPlayers.correct.forEach((playerData) => playerResponse(playerData))}
            {sortedPlayers.incorrect.forEach((playerData) => playerResponse(playerData))}
          </Grid>
        </>
    }
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    paddingBottom: "16px",
    flexDirection: "column",
    alignItems: "flexEnd",
    gap: "7px",
    alignSelf: "stretch"
  },
  headerText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
  confidenceLevelText: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Rubik',
    fontSize: '16px',
    fontWeight: '700',
    paddingTop: '8px',
  },
  answerLabelText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'right',
    fontFamily: 'Rubik',
    fontSize: '12px',
    fontWeight: '400',
  },
  playerCard: {
    display: "flex",
    padding: "8px 12px",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    alignSelf: "stretch",
    borderRadius: "8px",
    background: "#063772"
  },
  nameText: {
    overflow: "hidden",
    color: "#FFF",
    textOverflow: "ellipsis",
    fontFamily: "Poppins",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal"
  },
  answerDataContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center"
  },
  answerText: {
    fontSize: "16px",
    color: "#FFF",
    fontWeight: 800
  },
  check: {
    width: 18,
    height: 24
  }
}));