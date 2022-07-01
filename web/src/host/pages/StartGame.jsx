import React from 'react'
import { makeStyles } from "@material-ui/core";
import HostHeader from '../components/HostHeader';
import GameCard from '../components/GameCard';
import CurrentStudents from '../components/CurrentStudents';
import FooterStartGame from '../components/FooterStartGame';

export default function StartGame({
  teams: { items: teams },
  questions: { items: questions },
  title,
  gameCode,
  removeTeam,
}) {

  const classes = useStyles()
  return (
    <div className={classes.background}>
      <div>
        <HostHeader gameCode={gameCode} />
        <GameCard questions={questions} title={title} />
        <div className={classes.gameMode}>
          Basic Mode
        </div>
        <CurrentStudents teams={teams} removeTeam={removeTeam}/>
      </div>
      <FooterStartGame />
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  background: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'linear-gradient(#0D68B1 0%, #02215F 100%)',
  },

  gameMode: {
    textAlign: "center",
    fontWeight: "bold",
    fontStyle: "Italic",
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.46)",
    paddingTop: "10%",
  },

}))