import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Typography, Box } from '@mui/material';
import { isNullOrUndefined, IAnswerContent, IAnswerText, GameSessionState } from '@righton/networking';
import { evaluate } from 'mathjs';
import * as DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import katex from "katex";
import './ReactQuill.css';
import "katex/dist/katex.min.css";
import { handleNormalizeAnswers } from '../../lib/HelperFunctions';
import { AnswerType, StorageKeyAnswer, LocalModel } from '../../lib/PlayModels';
import BodyCardStyled from '../../lib/styledcomponents/BodyCardStyled';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import ButtonSubmitAnswer from '../ButtonSubmitAnswer';

window.katex = katex;

interface OpenAnswerCardProps {
  answerContent: IAnswerContent;
  isSubmitted: boolean;
  currentState: GameSessionState;
  currentQuestionIndex: number;
  handleSubmitAnswer: (result: IAnswerContent) => void;
}

export default function OpenAnswerCard({
  answerContent,
  isSubmitted,
  currentState,
  currentQuestionIndex,
  handleSubmitAnswer,
}: OpenAnswerCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const modules = {
    toolbar: [
      ['formula']
    ],
  };
  const formats = [
    'formula'
  ];

  // these two functions isolate the quill data structure (delta) from the rest of the app
  // this allows for the use of a different editor in the future by just adjusting the parsing in these functions
  const insertQuillDelta = (inputAnswer: IAnswerContent) => {
    const quillDelta: any = [];
    console.log(inputAnswer);
    inputAnswer.answers.forEach((answer) => {
      if (answer.type === AnswerType.FORMULA) {
        quillDelta.push({ insert: { formula: answer.rawText } });
      } else {
        quillDelta.push({ insert: answer.rawText });
      }
    });
    return quillDelta;
  };

  const [editorContents, setEditorContents] = useState<any>(() => insertQuillDelta(answerContent));

  // this function is run onChange of the quill editor
  // it is designed to only pull the data that is req'd to reproduce it on reload
  // full normalization will be performed only on submitting answer
  const extractQuillDelta = (currentContents: any): IAnswerContent => {
    const answer: IAnswerText[] = [];

    currentContents.forEach((op: any) => {
      if(op.insert.formula) {
        answer.push( {
          rawText: op.insert.formula, 
          type: AnswerType.FORMULA
        });
      } else {
        answer.push( {
          rawText: op.insert, 
          type: AnswerType.TEXT
        });
      }
    });
    
    return {answers: answer, isSubmitted} as IAnswerContent;
  };

  // ReactQuill onChange expects four parameters
  const handleEditorContentsChange = (content: any, delta: any, source: any, editor: any) => {
    const currentAnswer = editor.getContents();
    setEditorContents(currentAnswer);
    const extractedAnswer = extractQuillDelta(currentAnswer);
    extractedAnswer.currentState = currentState;
    extractedAnswer.currentQuestionIndex = currentQuestionIndex;
    console.log(extractedAnswer);
    window.localStorage.setItem(StorageKeyAnswer, JSON.stringify(extractedAnswer));
   // console.log(currentAnswer);
  };

  const handleRetrieveAnswer = (currentContents: any) => {
    const extractedAnswer = extractQuillDelta(currentContents);
    const normalizedAnswers = handleNormalizeAnswers(extractedAnswer.answers);
    const packagedAnswer: IAnswerContent = {
      answers: normalizedAnswers,
      currentState,
      currentQuestionIndex,
    } as IAnswerContent;
    console.log(packagedAnswer);
    handleSubmitAnswer(packagedAnswer);
  };

  return (
    <BodyCardStyled elevation={10} >
      <BodyCardContainerStyled spacing={2}>
        <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'left' }}>
          {t('gameinprogress.chooseanswer.openanswercard')}
         </Typography> 
        <Box style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '20px'}}>
          <ReactQuill
            theme="snow"
            readOnly={isSubmitted}
            value={editorContents}
            onChange={handleEditorContentsChange}
            placeholder={t('gameinprogress.chooseanswer.openanswercardplaceholder') ?? ''}
            modules={modules}
            formats={formats}
            bounds={`[data-text-editor="name"]`}
            style={{width:'100%', backgroundColor: !isSubmitted ? '' : `${theme.palette.primary.lightGrey}` , borderRadius:'4px'}}
          />
          <ButtonSubmitAnswer
            isSelected={!isNullOrUndefined(editorContents) && editorContents !== ''}
            isSubmitted={isSubmitted}
            currentState={currentState}
            currentQuestionIndex={currentQuestionIndex}
            handleSubmitAnswer={() => handleRetrieveAnswer(editorContents)}
          />
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
