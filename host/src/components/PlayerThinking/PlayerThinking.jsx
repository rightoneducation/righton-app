import React, {useState} from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import OpenAI from 'openai';
import { isNullOrUndefined } from '@righton/networking';
import PlayerThinkingGraph from './PlayerThinkingGraph';

export default function PlayerThinking({
  hints,
  numPlayers,
  totalAnswers,
  questionChoices,
  statePosition,
  graphClickInfo,
  isShortAnswerEnabled,
  handleGraphClick,
}) {
  console.log(hints);
  const classes = useStyles();
  const openai = new OpenAI({apiKey: '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', dangerouslyAllowBrowser: true});
  const [gptHints, setGptHints] = React.useState(null);
  const [hintsRequested, setHintsRequested] = React.useState(false);
  const processHints = async (hints) => {
    console.log(hints);
    let messages = [{
      role: "system",
      content: "You are a helpful assistant designed to output JSON. Respond with a JSON object following this structure: [ { themeText: the theme or category that you've found, teams: [the names of the teams whose responses fall into this category], teamCount: the number of teams in the teams array } ]"
    }];
  
    const formattedHints = hints?.prevSubmittedHints.map((hint) => `Team ${hint.teamName}: "${hint.rawHint}"`).join("\n");
    console.log(formattedHints);
    messages.push({
      role: "user",
      content: `
        Please analyze the following student responses from a class and identify any common themes or categories they can be grouped into:
        ${formattedHints}
        Categorize these responses into distinct themes or patterns you identify. Include the number of responses that fall into each category as well as the associated team names.
      `
    });
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: messages,
      });
      setGptHints(JSON.parse(completion.choices[0].message.content));
      setHintsRequested(true);
      console.log(completion);
      console.log(JSON.parse(completion.choices[0].message.content));
    } catch (e) {
      console.log(e);
    }

  };
  return (
    <Box className={classes.centerContent}>
      <Typography className={classes.titleStyle}>
        Player Thinking
      </Typography>
      <Typography className={classes.infoText}>
        Players are asked how sure they are of their answer for this question.
      </Typography>
      { hintsRequested && !isNullOrUndefined(gptHints)? 
        <>
          <PlayerThinkingGraph
            data={gptHints}
            numPlayers={numPlayers}
            totalAnswers={totalAnswers}
            questionChoices={questionChoices}
            statePosition={statePosition}
            graphClickInfo={graphClickInfo}
            isShortAnswerEnabled={isShortAnswerEnabled && statePosition < 6}
            handleGraphClick={handleGraphClick}
          />
          {graphClickInfo.graph === null ? (
            <Typography className={classes.subText}>
              Tap on a response to see more details.
            </Typography>
          ) : null}
        </>
      : 
      <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Typography className={classes.infoText}>
        {hints.prevSubmittedHints.length} / {numPlayers} players have submitted a hint
        </Typography>
          <Button
          className={classes.button}
          onClick={() => processHints(hints)}
        >
          Process Hints
        </Button>
       </Box>
      }
    </Box>
  );
}

const useStyles = makeStyles({
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  titleStyle: {
    color: 'var(--teacher-element-foreground, #FFF)',
    fontFamily: 'Poppins',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
    textTransform: 'none',
    textAlign: 'left',
  },
  infoText: {
    color: '#FFF',
    alignSelf: 'stretch',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: '400',
  },
  button: {
    border: '4px solid #159EFA',
    background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
    borderRadius: '34px',
    width: '150px',
    height: '24px',
    color: 'white',
    fontSize: '15px',
    bottom: '0',
    fontWeight: '700',
    lineHeight: '30px',
    textTransform: 'none',
  },
});
