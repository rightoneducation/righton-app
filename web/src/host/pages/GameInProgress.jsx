import React, {useState} from "react";
import { makeStyles } from "@material-ui/core";
import QuestionCard from "../components/QuestionCard";
import FooterGameInProgress from '../components/FooterGameInProgress';
import MockGameSession from '../../mocks/gamesession.json';

export default function GameInProgress() { 
    const classes = useStyles();
    const [gameData, setGameData] = useState(MockGameSession);
    const teams = gameData.teams.items;
    const questions = gameData.questions.items;
    const currentQuestionId = gameData.currentQuestionId;
    const currentQuestion = questions[currentQuestionId - 1];

    const numAnswers = teams => {
      let count = 0;
      teams.map(teamsItem => {
        if(teamsItem.answered === "true")
          count++;
        });
      return count;
    };


    return (
      <div className={classes.background}>
        <div>
          {/*divs in this block replaced with UI components being worked on by Eric, Zach and Lucah */}
          <div>
            {questions.map((question, index) => (
              <grid className={classes.number} key={question.id}>
                {index + 1}
              </grid>
            ))}
          </div>
          <div className={classes.title}>
            <h1>Question {currentQuestionId} of {questions.length}</h1>
            <p>Phase 1 of 2</p>
          </div>
          <div className={classes.timebar}>
            <progress value={15} max={24} className={classes.timebar1} />
            <button>add time</button>
          </div>
          <QuestionCard title={currentQuestion.question} />
          <div>
            {/* results and drop down bar goes here */}
          </div>
        </div>

        <FooterGameInProgress teams={teams} currentState={gameData.currentState} numPlayers={teams.length} numAnswers={numAnswers(teams)} />
      </div>
    );
}

const useStyles = makeStyles(theme => ({
    background: {
        height: "100vh",
        width: "100%",
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(196.21deg, #0D68B1 0%, #02215F 73.62%)',
    },
    number: {
        color: "white",
        height: "15px",
        width: "15px",
        borderStyle: "solid",
        borderColor: "white",
    },
    title: {
        color: "white",
    },
    timebar: {
        animationDuration: "5",
    },
    timebar1: {
        height: "5px",
    },
    indexcard: {
        display: "center",
        backgroundColor: "white",
        height: "30%",
        width: "80%",
    },
    button: {
        color: "#00A1FF",
        fontWeight: "bold",
        width: "90%",
        height: "45px",
        display: "center",
        background: "none",
        borderRadius: "24px",
        borderColor: "#00A1FF",
        borderStyle: "solid",
        borderWidth: "thick",
        textAlign: "center",
        marginLeft: "5%",
        marginRight: "5%",
    },
}))