import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from "@material-ui/core";
import { v4 as uuidv4 } from 'uuid';
import { SubmittedAnswerObject, InputType } from '../lib/HostModels';

interface CommonWordsProps {
  topWords: string[];
}


export default function CommonWords({topWords}:CommonWordsProps) {
  console.log(topWords);
  return (
    <Paper style={{background: 0}} elevation={0}>
      {topWords.length > 0 ? topWords.map((word) => { 
          return (
            <Typography variant="h6" align="center">
              {word[0]}
            </Typography>
          )
        }
      ) : null}
      </Paper>
  );
};