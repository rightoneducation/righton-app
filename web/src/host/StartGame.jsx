import React from 'react'
import Button from '@material-ui/core/Button';


    //GameCode
    //game.gameCode -- get current game by id

      //CurrentGame
      //game.id or just id?
      //we want to display game title and how many questions

        //GameMode
        //game.isAdvanced -- determine which mode if false then we go on to contine with basic mode functionality
        
      //StudentsinSessionCount
      //teams.teamMembers.id? map this array to fetch and return count, render count to screen

        //CurrentStudents
        //teams.teamMembers.id? map to fetch and return team member names and attributes? as buttons with functionality to remove(delete) individual members
        //when a team member is in the session do we also need to be storing their answers at this stage?

    //StartGameButton
    //triggers next screen -- teacher / answer dashboard with time and first question

    //Do we need to get routing/ all updates from sprint 1/2 merged into sprint3-branch?

    //How DO we get to this page? After launch game is selected from central?
    //how is routing going to work here? index.js route and switch here and export to app.tsx
    //do we render this page/ component in app.jsx? 
    //How should file structure look with components? Is this all in one component or multiple sub components separated out?
    // url practices /display  /host
    
export const StartGame = () => {
  return (

    
    <Button variant="contained">Hello World!</Button>
  )
}
